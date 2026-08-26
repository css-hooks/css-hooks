import { fileURLToPath } from "node:url";

import cssWebRef from "@webref/css/css.json" with { type: "json" };
import { format, resolveConfig } from "prettier";

/** A CSS property definition from the Webref CSS data. */
type CSSProperty = (typeof cssWebRef.properties)[number];

/** Resolves and caches the canonical names of CSS property aliases. */
class CanonicalNames {
  private readonly cache = new Map<string, string>();
  private readonly propertiesByName: ReadonlyMap<string, CSSProperty>;

  constructor(propertiesByName: ReadonlyMap<string, CSSProperty>) {
    this.propertiesByName = propertiesByName;
  }

  get(name: string, ancestors = new Set<string>()): string {
    const cached = this.cache.get(name);
    if (cached) {
      return cached;
    }
    const property = this.propertiesByName.get(name);
    if (!property) {
      throw new Error(`Unknown CSS property reference: ${name}`);
    }
    if (ancestors.has(name)) {
      throw new Error(`CSS property alias cycle involving ${name}`);
    }
    const canonical = property.legacyAliasOf
      ? this.get(property.legacyAliasOf, new Set(ancestors).add(name))
      : name;
    this.cache.set(name, canonical);
    return canonical;
  }
}

/** Resolves and caches the longhand effects of CSS properties. */
class PropertyEffects {
  private readonly cache = new Map<string, ReadonlySet<string>>();
  private readonly propertiesByName: ReadonlyMap<string, CSSProperty>;
  private readonly canonicalNames: CanonicalNames;

  constructor(
    propertiesByName: ReadonlyMap<string, CSSProperty>,
    canonicalNames: CanonicalNames,
  ) {
    this.propertiesByName = propertiesByName;
    this.canonicalNames = canonicalNames;
  }

  get(name: string, ancestors = new Set<string>()): ReadonlySet<string> {
    const canonical = this.canonicalNames.get(name);
    const cached = this.cache.get(canonical);
    if (cached) {
      return cached;
    }
    if (ancestors.has(canonical)) {
      throw new Error(`CSS shorthand cycle involving ${canonical}`);
    }
    const property = this.propertiesByName.get(canonical);
    if (!property) {
      throw new Error(`Unknown canonical CSS property: ${canonical}`);
    }
    const components = [
      ...(property.longhands ?? []),
      ...(property.resetLonghands ?? []),
    ];
    const nextAncestors = new Set(ancestors).add(canonical);
    const result = new Set(
      components.length === 0
        ? [canonical]
        : components.flatMap(component => [
            ...this.get(component, nextAncestors),
          ]),
    );
    this.cache.set(canonical, result);
    return result;
  }
}

/** Builds the declaration and conflict relationships from the Webref CSS data. */
export function buildCSSPropertyConflictData() {
  const properties = cssWebRef.properties;
  const duplicateProperty = [
    ...Map.groupBy(properties, ({ name }) => name),
  ].find(([, properties]) => properties.length > 1);
  if (duplicateProperty) {
    throw new Error(`Duplicate CSS property: ${duplicateProperty[0]}`);
  }

  const propertiesByName = new Map(
    properties.map(property => [property.name, property] as const),
  );
  const canonicalNames = new CanonicalNames(propertiesByName);
  const propertyEffects = new PropertyEffects(propertiesByName, canonicalNames);

  const declarations = properties.flatMap(property =>
    property.styleDeclaration.map(declaration => ({
      declaration,
      property: canonicalNames.get(property.name),
    })),
  );
  const declarationToProperty = new Map(
    declarations.map(({ declaration, property }) => [declaration, property]),
  );
  const conflictingDeclaration = declarations.find(
    ({ declaration, property }) =>
      declarationToProperty.get(declaration) !== property,
  );
  if (conflictingDeclaration) {
    throw new Error(
      `CSS declaration ${conflictingDeclaration.declaration} maps to both ${conflictingDeclaration.property} and ${declarationToProperty.get(conflictingDeclaration.declaration)}`,
    );
  }
  const canonicalProperties = [
    ...new Set(properties.map(property => canonicalNames.get(property.name))),
  ];
  const declarationsByProperty = Map.groupBy(
    declarations,
    ({ property }) => property,
  );
  const propertyDeclarations = new Map(
    canonicalProperties.map(property => [
      property,
      new Set(
        (declarationsByProperty.get(property) ?? []).map(
          ({ declaration }) => declaration,
        ),
      ),
    ]),
  );

  const logicalProperties = canonicalProperties.flatMap(canonical =>
    [...propertyEffects.get(canonical)].flatMap(effect => {
      const property = propertiesByName.get(effect);
      if (!property) {
        throw new Error(`Unknown CSS property effect: ${effect}`);
      }
      return property.logicalPropertyGroup
        ? [
            {
              effect,
              group: property.logicalPropertyGroup,
              classification: classifyLogicalProperty(effect),
            },
          ]
        : [];
    }),
  );
  const logicalGroups = new Map(
    [...Map.groupBy(logicalProperties, ({ group }) => group)].map(
      ([group, properties]) => [
        group,
        new Map(
          properties.map(({ effect, classification }) => [
            effect,
            classification,
          ]),
        ),
      ],
    ),
  );

  const invalidLogicalGroup = [...logicalGroups].find(([, group]) => {
    const classifications = new Set(group.values());
    return !classifications.has("logical") || !classifications.has("physical");
  });
  if (invalidLogicalGroup) {
    throw new Error(
      `CSS logical property group ${invalidLogicalGroup[0]} does not contain both logical and physical properties`,
    );
  }

  function effectsConflict(left: string, right: string) {
    if (left === right) {
      return true;
    }
    const leftProperty = propertiesByName.get(left);
    const rightProperty = propertiesByName.get(right);
    if (
      !leftProperty?.logicalPropertyGroup ||
      leftProperty.logicalPropertyGroup !== rightProperty?.logicalPropertyGroup
    ) {
      return false;
    }
    const group = logicalGroups.get(leftProperty.logicalPropertyGroup);
    return group?.get(left) !== group?.get(right);
  }

  const sortedCanonicalProperties = canonicalProperties.toSorted();
  const propertyConflicts = new Map(
    sortedCanonicalProperties.map(left => [
      left,
      new Set(
        sortedCanonicalProperties.filter(right => {
          if (left === right) {
            return false;
          }
          const allProperty =
            left === "all" ? right : right === "all" ? left : null;
          return allProperty
            ? allProperty !== "direction" && allProperty !== "unicode-bidi"
            : [...propertyEffects.get(left)].some(leftEffect =>
                [...propertyEffects.get(right)].some(rightEffect =>
                  effectsConflict(leftEffect, rightEffect),
                ),
              );
        }),
      ),
    ]),
  );

  return {
    declarationToProperty,
    propertyDeclarations,
    propertyConflicts,
  };
}

/**
 * Renders CSS property conflicts as a formatted TypeScript type.
 *
 * @returns The formatted TypeScript source
 */
export async function renderCSSPropertyConflicts(
  {
    declarationToProperty,
    propertyDeclarations,
    propertyConflicts,
  }: ReturnType<typeof buildCSSPropertyConflictData>,
  casings: ReadonlySet<Parameters<typeof hasCasing>[1]>,
) {
  if (casings.size === 0) {
    throw new Error("At least one CSS property casing is required");
  }

  const selectedDeclarations = new Set(
    [...declarationToProperty.keys()].filter(declaration =>
      [...casings].some(casing => hasCasing(declaration, casing)),
    ),
  );
  const declarationConflicts = new Map(
    [...selectedDeclarations].map(declaration => {
      const property = declarationToProperty.get(declaration);
      if (!property) {
        throw new Error(`Unknown CSS declaration: ${declaration}`);
      }
      const conflictingDeclarations = new Set(
        [property, ...(propertyConflicts.get(property) ?? [])]
          .flatMap(conflictingProperty => [
            ...(propertyDeclarations.get(conflictingProperty) ?? []),
          ])
          .filter(
            conflictingDeclaration =>
              conflictingDeclaration !== declaration &&
              selectedDeclarations.has(conflictingDeclaration),
          ),
      );
      return [declaration, conflictingDeclarations] as const;
    }),
  );

  const prettierConfig = await resolveConfig(fileURLToPath(import.meta.url));
  return format(
    `/*
 * Generated from @webref/css by @scripts/css-property-conflicts.
 * Do not edit this file directly.
 */

/**
 * A map of conflicting CSS property names
 */
export type CSSPropertyConflicts = ${renderSetMap(declarationConflicts)};
`,
    { ...prettierConfig, parser: "typescript" },
  );
}

/** Returns whether a CSS declaration uses the specified casing. */
function hasCasing(declaration: string, casing: "camel" | "kebab") {
  if (casing === "camel") {
    return (
      /^[A-Za-z][A-Za-z0-9]*$/.test(declaration) &&
      !/^webkit[A-Z]/.test(declaration)
    );
  }
  return /^-?[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(declaration);
}

/** Classifies a member of a logical property group. */
function classifyLogicalProperty(name: string) {
  const logical = /(?:^|-)(?:block|inline|start|end)(?:-|$)/.test(name);
  if (logical) {
    return "logical";
  }
  const physical =
    /(?:^|-)(?:top|right|bottom|left|x|y|width|height)(?:-|$)/.test(name);
  if (!physical) {
    throw new Error(`Cannot classify logical property group member: ${name}`);
  }
  return "physical";
}

/** Renders a map of string sets as a TypeScript object type. */
function renderSetMap(values: Map<string, Set<string>>) {
  return renderEntries(
    [...values]
      .toSorted(([left], [right]) => left.localeCompare(right))
      .map(([key, set]) => [key, renderUnion([...set].toSorted())]),
  );
}

/** Renders entries as members of a TypeScript object type. */
function renderEntries(entries: [string, string][]) {
  return `{
${entries.map(([key, value]) => `  ${JSON.stringify(key)}: ${value};`).join("\n")}
}`;
}

/** Renders strings as a TypeScript union. */
function renderUnion(values: string[]) {
  return values.length === 0
    ? "never"
    : values.map(value => JSON.stringify(value)).join(" | ");
}

import { useId } from "react";
import { pipe } from "remeda";

import { and, dark, not, on } from "./css.ts";

type Theme = "dark" | "auto" | "light";

const warm = (l: number) => `oklch(${l}% 0.025 80)`;
const cool = (l: number) => `oklch(${l}% 0.015 260)`;

const themes: Theme[] = ["dark", "auto", "light"];

function SunIcon() {
  const id = useId();
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <clipPath id={id}>
          <circle cx="12" cy="12" r="3.8" />
        </clipPath>
      </defs>
      {/* Cardinal rays */}
      <line
        x1="12"
        y1="1"
        x2="12"
        y2="5.5"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <line
        x1="12"
        y1="18.5"
        x2="12"
        y2="23"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <line
        x1="1"
        y1="12"
        x2="5.5"
        y2="12"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <line
        x1="18.5"
        y1="12"
        x2="23"
        y2="12"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      {/* Diagonal rays */}
      <line
        x1="4.5"
        y1="4.5"
        x2="7.2"
        y2="7.2"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <line
        x1="19.5"
        y1="4.5"
        x2="16.8"
        y2="7.2"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <line
        x1="4.5"
        y1="19.5"
        x2="7.2"
        y2="16.8"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <line
        x1="19.5"
        y1="19.5"
        x2="16.8"
        y2="16.8"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* Sun body */}
      <circle cx="12" cy="12" r="3.8" stroke="currentColor" strokeWidth="1.1" />
      {/* Da Vinci hatching — diagonal parallel lines clipped to circle */}
      <g
        clipPath={`url(#${id})`}
        stroke="currentColor"
        strokeWidth="0.5"
        strokeLinecap="round"
        opacity="0.55"
      >
        <line x1="9.2" y1="14.8" x2="11.8" y2="12.2" />
        <line x1="10.2" y1="15.4" x2="13.2" y2="12.4" />
        <line x1="11.4" y1="15.6" x2="14.4" y2="12.6" />
        <line x1="12.6" y1="15.4" x2="15" y2="13" />
      </g>
    </svg>
  );
}

function MoonIcon() {
  const id = useId();
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <clipPath id={id}>
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </clipPath>
      </defs>
      {/* Crescent outline */}
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Da Vinci hatching — diagonal lines clipped to crescent */}
      <g
        clipPath={`url(#${id})`}
        stroke="currentColor"
        strokeWidth="0.55"
        strokeLinecap="round"
        opacity="0.7"
      >
        <line x1="4.5" y1="8" x2="9.5" y2="13" />
        <line x1="4" y1="11.5" x2="9.5" y2="17" />
        <line x1="4.5" y1="15" x2="8.5" y2="19" />
        <line x1="6" y1="18" x2="8.5" y2="20.5" />
        <line x1="8" y1="5.5" x2="12" y2="9.5" />
      </g>
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 10 6"
      width="10"
      height="6"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1 1l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const srOnly: React.CSSProperties = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0,0,0,0)",
  whiteSpace: "nowrap",
  border: 0,
};

interface ThemeSwitcherProps {
  value: Theme;
  onChange: (theme: Theme) => void;
}

export function ThemeSwitcher({ value, onChange }: ThemeSwitcherProps) {
  return (
    <div
      style={pipe(
        {
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          paddingLeft: 8,
          paddingRight: 4,
          paddingBlock: 4,
          borderRadius: "999px",
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: warm(84),
          cursor: "pointer",
          color: warm(55),
          userSelect: "none",
        },
        on("&:hover", { borderColor: warm(68) }),
        on(dark, { borderColor: cool(30), color: cool(60) }),
        on(and("&:hover", dark), { borderColor: cool(44) }),
      )}
    >
      {/* Moon — shown in dark mode */}
      <div style={pipe({ display: "none" }, on(dark, { display: "contents" }))}>
        <MoonIcon />
      </div>
      {/* Sun — shown in light mode */}
      <div
        style={pipe(
          { display: "none" },
          on(not(dark), { display: "contents" }),
        )}
      >
        <SunIcon />
      </div>
      <ChevronIcon />
      <label>
        <span style={srOnly}>Color scheme</span>
        <select
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0,
            fontSize: 0,
            cursor: "pointer",
          }}
          value={value}
          onChange={e => onChange(e.target.value as Theme)}
        >
          {themes.map(t => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

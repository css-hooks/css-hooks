import { forwardRef } from "react";

function getProps(spec, props) {
  if (!spec) {
    return {};
  }
  if (typeof spec === "function") {
    return getProps(spec(props), props);
  }
  if (typeof spec === "string") {
    return { className: spec };
  }
  if (typeof spec === "object") {
    if ("style" in spec || "className" in spec) {
      return spec;
    }
    return { style: spec };
  }
  return {};
}

export default function styled(Tag, spec) {
  const Component = forwardRef(({ children, ...props }, ref) => {
    const styledProps = getProps(spec, props);

    if (typeof children === "function") {
      const forwardProps = styledProps;
      return children(forwardProps);
    }

    const { className, style, ...restProps } = props;
    const forwardProps = {
      className: [styledProps.className, className].filter(x => x).join(" "),
      style: {
        ...styledProps.style,
        ...style,
      },
    };

    return (
      <Tag {...forwardProps} {...restProps} ref={ref}>
        {children}
      </Tag>
    );
  });
  Component.displayName = Tag[0].toUpperCase() + Tag.substring(1);
  return Component;
}

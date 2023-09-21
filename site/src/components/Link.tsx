import hooks from "@/css-hooks";
import styled from "@/util/styled";

export default styled("a", ({ selected }: { selected?: boolean }) =>
  hooks({
    color: selected ? "inherit" : "var(--blue-800)",
    textDecoration: "none",
    cursor: selected ? "default" : "pointer",
    ...(!selected && {
      hover: {
        color: "var(--blue-700)",
      },
      active: {
        color: "var(--red-700)",
      },
      dark: {
        color: "var(--blue-400)",
        hover: {
          color: "var(--blue-300)",
        },
        active: {
          color: "var(--red-400)",
        },
      },
    }),
  }),
);

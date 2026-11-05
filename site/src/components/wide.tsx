import type { ReactNode } from "react";

export function Wide({ children }: { children?: ReactNode }) {
  return (
    <div className="wide" style={{ width: "100%" }}>
      {children}
    </div>
  );
}

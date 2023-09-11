import Code from "@/components/Code";
import type frameworks from "../frameworks";

export default function HookName({
  children: name,
  framework,
}: {
  children: string;
  framework: (typeof frameworks)[number];
}) {
  return (
    <Code>
      {framework === "solid"
        ? name.replace(/[A-Z]/g, x => "-" + x.toLowerCase())
        : name}
    </Code>
  );
}

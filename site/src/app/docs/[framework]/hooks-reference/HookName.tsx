import type { generateStaticParams } from "../layout";
import Code from "@/components/Code";

export default function HookName({
  children: name,
  framework,
}: {
  children: string;
  framework: Awaited<
    ReturnType<typeof generateStaticParams>
  >[number]["framework"];
}) {
  return (
    <Code>
      {framework === "solid"
        ? name.replace(/[A-Z]/g, x => "-" + x.toLowerCase())
        : name}
    </Code>
  );
}

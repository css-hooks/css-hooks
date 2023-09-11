import frameworks from "../frameworks";
import guides from "../guides";
import API from "../api/page.mdx";
import GettingStarted from "../getting-started/page.mdx";
import HooksReference from "../hooks-reference/page.mdx";
import Usage from "../usage/page.mdx";

export async function generateStaticParams() {
  return guides.flatMap(([, guide]) =>
    frameworks.map(framework => ({ framework, guide })),
  );
}

export default function Page(props: {
  params: {
    framework: (typeof frameworks)[number];
    guide: (typeof guides)[number][1];
  };
}) {
  switch (props.params.guide) {
    case "api":
      return <API {...props} />;
    case "getting-started":
      return <GettingStarted {...props} />;
    case "hooks-reference":
      return <HooksReference {...props} />;
    case "usage":
      return <Usage {...props} />;
    default:
      return <div>Not found</div>;
  }
}

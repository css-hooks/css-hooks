import frameworks from "../frameworks";
import guides from "../guides";
import API from "../api/page.mdx";
import Configuration from "../configuration/page.mdx";
import GettingStarted from "../getting-started/page.mdx";
import Introduction from "../introduction/page.mdx";
import Usage from "../usage/page.mdx";

export async function generateStaticParams() {
  return guides.flatMap(([, guide]) =>
    frameworks.map(framework => ({ framework, guide })),
  );
}

type Props = {
  params: {
    framework: (typeof frameworks)[number];
    guide: (typeof guides)[number][1];
  };
};

export async function generateMetadata({ params }: Props) {
  const guide = guides.find(([, guide]) => guide === params.guide);
  return {
    title: `${guide?.[0] || "Documentation"} - CSS Hooks for ${
      params.framework[0].toUpperCase() + params.framework.substring(1)
    }`,
    description: guide?.[2],
  };
}

export default function Page(props: Props) {
  switch (props.params.guide) {
    case "api":
      return <API {...props} />;
    case "configuration":
      return <Configuration {...props} />;
    case "getting-started":
      return <GettingStarted {...props} />;
    case "introduction":
      return <Introduction {...props} />;
    case "usage":
      return <Usage {...props} />;
    default:
      return <div>Not found</div>;
  }
}

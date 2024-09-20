import type { Route } from "../route.js";
import docsArticle from "./docs/article.js";
import docsOverview from "./docs/overview.js";
import homepage from "./homepage.js";
import icons from "./icons.js";
import opengraph from "./opengraph.js";

export default (): Promise<Route[]> =>
  Promise.all(
    [homepage, docsOverview, docsArticle, icons, opengraph].map(f => f()),
  ).then(route => route.flatMap(x => x));

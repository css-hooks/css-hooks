import { createRoot } from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import { Page, PageLayout } from "./components.tsx";
import * as Docs from "./docs.tsx";
import { Home } from "./home.tsx";
import { Icon } from "./icon.tsx";
import { Opengraph } from "./opengraph.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Page />,
    children: [
      {
        path: "",
        element: <PageLayout />,
        children: [
          {
            path: "",
            element: <Home />,
          },
          {
            path: "docs",
            children: [
              { path: "", element: <Docs.Overview /> },
              { path: "*", element: <Docs.Article /> },
            ],
          },
        ],
      },
      {
        path: "",
        element: (
          <div data-theme="dark">
            <Outlet />
          </div>
        ),
        children: [
          {
            path: "icon",
            element: <Icon />,
          },
          {
            path: "opengraph",
            element: <Opengraph />,
          },
        ],
      },
    ],
  },
]);

const host = document.getElementById("root");
if (host) {
  const root = createRoot(host);
  root.render(<RouterProvider router={router} />);
}

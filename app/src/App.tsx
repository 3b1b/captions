import { IconContext } from "react-icons";
import {
  createBrowserRouter,
  Outlet,
  redirect,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";
import Edit, { loader as editLoader } from "@/pages/Edit";
import Home from "@/pages/Home";

/** entrypoint component */
function App() {
  return <RouterProvider router={router} />;
}

export default App;

/** route layout */
const Layout = () => {
  return (
    <IconContext.Provider
      value={{ className: "icon", attr: { "aria-hidden": true } }}
    >
      <QueryParamProvider
        adapter={ReactRouter6Adapter}
        options={{ updateType: "replaceIn" }}
      >
        <Outlet />
      </QueryParamProvider>
    </IconContext.Provider>
  );
};

/** route definitions */
const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
        loader: spaRedirect,
      },

      {
        path: "edit/:slug/:language",
        element: <Edit />,
        loader: editLoader,
      },
    ],
  },

  /** 404 */
  {
    path: "*",
    element: <Home />,
    loader: async () => {
      return redirect("/");
    },
  },
];

/** router */
const router = createBrowserRouter(routes, {
  basename: import.meta.env.BASE_URL,
});

/** handle single-page-app redirect */
async function spaRedirect() {
  /** see /public/404.html */
  const url = window.sessionStorage.redirect as string;
  if (url) {
    console.info("Redirecting to:", url);
    window.sessionStorage.removeItem("redirect");
    return redirect(url);
  } else return null;
}

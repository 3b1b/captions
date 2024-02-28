import { IconContext } from "react-icons";
import {
  createBrowserRouter,
  Outlet,
  redirect,
  RouteObject,
  RouterProvider,
  useNavigation,
} from "react-router-dom";
import {
  atom,
  Atom,
  getDefaultStore,
  PrimitiveAtom,
  useAtomValue,
} from "jotai";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";
import ProgressBar from "@/components/ProgressBar";
import Edit, { loader as editLoader } from "@/pages/Edit";
import Home from "@/pages/Home";
import "@/components/tooltip";

/** entrypoint component */
function App() {
  return <RouterProvider router={router} />;
}

export default App;

/** global loading state */
export const loading = atom(0);

/** route layout */
function Layout() {
  const { state } = useNavigation();
  const getLoading = useAtomValue(loading);

  return (
    <IconContext.Provider
      value={{ className: "icon", attr: { "aria-hidden": true } }}
    >
      <QueryParamProvider
        adapter={ReactRouter6Adapter}
        options={{ updateType: "replaceIn" }}
      >
        <Outlet />
        {state === "loading" && <ProgressBar progress={getLoading} />}
      </QueryParamProvider>
    </IconContext.Provider>
  );
}

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
        path: "edit/:lesson/:language",
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

/** get jotai atom (outside of component) */
export function getAtom<T>(atom: Atom<T>) {
  return getDefaultStore().get(atom);
}

/** set jotai atom (outside of component) */
export function setAtom<T>(atom: PrimitiveAtom<T>, value: T) {
  getDefaultStore().set(atom, value);
  return value;
}

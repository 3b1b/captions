import { useEffect } from "react";
import { atom } from "jotai";
import Completion from "@/pages/home/Completion";
import Header from "@/pages/home/Header";
import Search from "@/pages/home/Search";

/** home page */
function Home() {
  /** set browser tab title */
  useEffect(() => {
    document.title = import.meta.env.VITE_TITLE;
  }, []);

  return (
    <>
      <Header />
      <main>
        <Search />
        <Completion />
      </main>
    </>
  );
}

export default Home;

/** page-wide state */

export const titleSearch = atom("");
export const topicSearch = atom("");
export const languageSearch = atom("");
export const showAll = atom(false);

import { useEffect } from "react";
import ByLanguage from "@/pages/home/ByLanguage";
import ByTopic from "@/pages/home/ByTopic";
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
        <ByLanguage />
        <ByTopic />
      </main>
    </>
  );
}

export default Home;

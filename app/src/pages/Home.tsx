import { useEffect } from "react";
import ByLanguage from "@/pages/home/ByLanguage";
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
      </main>
    </>
  );
}

export default Home;

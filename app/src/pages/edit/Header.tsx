import { useEffect } from "react";
import { useParams } from "react-router";
import { startCase } from "lodash";
import classes from "./Header.module.css";

function Header() {
  const { video = "", language = "" } = useParams();

  useEffect(() => {
    document.title = [video, language].join(" | ");
  }, [video, language]);

  return (
    <header className={classes.header}>
      <div className={classes.video}></div>
      <nav className={classes.text}>
        <h1 className="sr-only">{import.meta.env.VITE_TITLE}</h1>

        <h2>{startCase(video)}</h2>

        <a href="./">{startCase(language)}</a>
      </nav>
    </header>
  );
}

export default Header;

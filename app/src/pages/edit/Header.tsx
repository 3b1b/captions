import { useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { startCase } from "lodash";
import { useSnapshot } from "valtio";
import Player from "@/components/Player";
import { id, sticky, title } from "@/pages/Edit";
import classes from "./Header.module.css";

function Header() {
  /** url params */
  let { lesson = "", language = "" } = useParams();

  /** de-kebab */
  lesson = startCase(lesson);
  language = startCase(language);

  /** reactive state */
  const idSnap = useSnapshot(id);
  const titleSnap = useSnapshot(title);
  const stickySnap = useSnapshot(sticky);

  /** title, with fallback */
  const _title = titleSnap.value?.original || lesson;

  /** set browser tab title */
  useEffect(() => {
    document.title = [_title, language].join(" | ");
  }, [_title, language]);

  return (
    <header
      className={classes.header}
      style={{ position: stickySnap.value ? "sticky" : undefined }}
    >
      <Player video={idSnap.value} />

      <nav className={classes.text}>
        <h1 className="sr-only">{import.meta.env.VITE_TITLE}</h1>

        <h2>{_title}</h2>

        <span>{language}</span>

        <Link to="/">Home</Link>
      </nav>
    </header>
  );
}

export default Header;
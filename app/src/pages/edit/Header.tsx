import { useEffect } from "react";
import { useParams } from "react-router";
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

  const titleFallback = titleSnap.value?.editHistory.at(-1)?.text || lesson;

  /** update browser tab title */
  useEffect(() => {
    document.title = [titleFallback, language].join(" | ");
  }, [titleFallback, language]);

  return (
    <header
      className={classes.header}
      style={{ position: stickySnap.value ? "sticky" : undefined }}
    >
      <Player video={idSnap.value} />

      <nav className={classes.text}>
        <h1 className="sr-only">{import.meta.env.VITE_TITLE}</h1>

        <h2>{titleFallback}</h2>

        <a href="./" title="Switch language" aria-label="Switch language">
          {language}
        </a>
      </nav>
    </header>
  );
}

export default Header;

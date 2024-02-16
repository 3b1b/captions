import { useEffect } from "react";
import { useParams } from "react-router";
import { startCase } from "lodash";
import { useSnapshot } from "valtio";
import Player from "@/components/Player";
import { sticky } from "@/pages/Edit";
import classes from "./Header.module.css";

function Header() {
  const { video = "", language = "" } = useParams();

  const stickySnap = useSnapshot(sticky);

  useEffect(() => {
    document.title = [video, language].join(" | ");
  }, [video, language]);

  return (
    <header
      className={classes.header}
      style={{ position: stickySnap.value ? "sticky" : undefined }}
    >
      <Player video="2g811Eo7K8U" />

      <nav className={classes.text}>
        <h1 className="sr-only">{import.meta.env.VITE_TITLE}</h1>

        <h2>{startCase(video)}</h2>

        <a href="./" title="Switch language" aria-label="Switch language">
          {startCase(language)}
        </a>
      </nav>
    </header>
  );
}

export default Header;

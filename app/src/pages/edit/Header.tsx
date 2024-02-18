import { useEffect } from "react";
import {
  FaAngleLeft,
  FaAngleRight,
  FaClockRotateLeft,
  FaHouse,
  FaRegCircleQuestion,
} from "react-icons/fa6";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { startCase } from "lodash";
import { useSnapshot } from "valtio";
import Player from "@/components/Player";
import { meta, sticky, title, video } from "@/pages/Edit";
import classes from "./Header.module.css";

function Header() {
  /** url params */
  const { slug = "", language = "" } = useParams();

  /** reactive state */
  const metaSnap = useSnapshot(meta);
  const videoSnap = useSnapshot(video);
  const titleSnap = useSnapshot(title);
  const stickySnap = useSnapshot(sticky);

  /** title, with fallback */
  const _title = titleSnap.value?.original || startCase(slug);

  /** set browser tab title */
  useEffect(() => {
    document.title = [_title, language].join(" | ");
  }, [_title, language]);

  return (
    <header
      className={classes.header}
      style={{ position: stickySnap.value ? "sticky" : undefined }}
    >
      {/* video */}
      <Player video={videoSnap.value} />

      {/* text and nav */}
      <div className={classes.text}>
        {/* links */}
        <nav className={classes.nav}>
          <Link to="/">
            <FaHouse />
            Home
          </Link>

          <Link to="https://github.com/3b1b/captions/issues" target="_blank">
            <FaRegCircleQuestion />
            Help
          </Link>

          {metaSnap.value?.path && (
            <Link
              to={`https://github.com/3b1b/captions/commits/main/${metaSnap.value?.path}`}
              target="_blank"
            >
              <FaClockRotateLeft />
              Edit History
            </Link>
          )}

          {metaSnap.value?.previousLesson && (
            <Link to={`/edit/${metaSnap.value?.previousLesson}/${language}`}>
              <FaAngleLeft />
              Previous
            </Link>
          )}

          {metaSnap.value?.nextLesson && (
            <Link to={`/edit/${metaSnap.value?.nextLesson}/${language}`}>
              <FaAngleRight />
              Next
            </Link>
          )}
        </nav>

        {/* lesson info */}
        <h1>{_title}</h1>
        <div>{startCase(language)}</div>
      </div>
    </header>
  );
}

export default Header;

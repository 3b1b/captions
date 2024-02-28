import { useEffect } from "react";
import {
  FaAngleLeft,
  FaAngleRight,
  FaClockRotateLeft,
  FaHouse,
  FaLock,
  FaRegCircleQuestion,
} from "react-icons/fa6";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useAtomValue } from "jotai";
import { startCase } from "lodash";
import { repoFull } from "@/api";
import Badge from "@/components/Badge";
import Player from "@/components/Player";
import { completion, locked, meta, sticky, title, video } from "@/pages/Edit";
import classes from "./Header.module.css";

function Header() {
  /** url params */
  const { lesson = "", language = "" } = useParams();

  /** page state */
  const getLocked = useAtomValue(locked);
  const getMeta = useAtomValue(meta);
  const getVideo = useAtomValue(video);
  const getTitle = useAtomValue(title);
  const getSticky = useAtomValue(sticky);
  const getCompletion = useAtomValue(completion);

  /** title, with fallback */
  const _title = getTitle[0]?.startingOriginal || startCase(lesson);

  /** set browser tab title */
  useEffect(() => {
    document.title = [_title, language].join(" | ");
  }, [_title, language]);

  return (
    <header
      className={classes.header}
      style={{
        position: getSticky ? "sticky" : undefined,
      }}
    >
      {/* video */}
      <Player video={getVideo} />

      {/* text and nav */}
      <div className={classes.text}>
        {/* links */}
        <nav className={classes.nav}>
          <Link to="/" data-tooltip="Back to translations app homepage">
            <FaHouse />
            Home
          </Link>

          <Link
            to={`${repoFull}/issues`}
            target="_blank"
            data-tooltip="Get help or report an issue"
          >
            <FaRegCircleQuestion />
            Help
          </Link>

          {getMeta?.path && (
            <Link
              to={`${repoFull}/commits/main/${getMeta?.path}`}
              target="_blank"
              data-tooltip="See full edit history of this lesson and language on GitHub"
            >
              <FaClockRotateLeft />
              Edit History
            </Link>
          )}

          {getMeta?.previousLesson && (
            <Link
              to={`/edit/${getMeta?.previousLesson}/${language}`}
              data-tooltip="Previous video in series or topic"
            >
              <FaAngleLeft />
              Previous
            </Link>
          )}

          {getMeta?.nextLesson && (
            <Link
              to={`/edit/${getMeta?.nextLesson}/${language}`}
              data-tooltip="Next video in series or topic"
            >
              <FaAngleRight />
              Next
            </Link>
          )}
        </nav>

        {/* lesson info */}
        <h1>{_title}</h1>
        <div>{startCase(language)}</div>

        <div className={classes.icons}>
          {getLocked && (
            <Link to={`${repoFull}/tree/${lesson}-${language}`} target="_blank">
              <FaLock />
            </Link>
          )}

          <Badge completion={getCompletion} />
        </div>
      </div>
    </header>
  );
}

export default Header;

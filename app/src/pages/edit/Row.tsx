import { useEffect, useRef } from "react";
import {
  FaArrowsRotate,
  FaFlag,
  FaPlay,
  FaRegThumbsUp,
  FaStop,
  FaThumbsUp,
} from "react-icons/fa6";
import { FaExclamationTriangle } from 'react-icons/fa';
import { Link, useParams } from "react-router-dom";
import classNames from "classnames";
import { useAtom, useAtomValue } from "jotai";
import { cloneDeep } from "lodash";
import { issueLink } from "@/api";
import { playing, playSegment, stopVideo, time } from "@/components/Player";
import Textarea from "@/components/Textarea";
import { isEdited, originalMax, translationMax } from "@/data/data";
import { Entry } from "@/data/types";
import {
  captions,
  completion,
  description,
  showLegacy,
  title,
} from "@/pages/Edit";
import { glow, scrollIntoView } from "@/util/dom";
import { formatTime } from "@/util/string";
import classes from "./Row.module.css";

type Props = {
  index: number;
  entries: typeof title | typeof captions | typeof description;
};

/** editable entry row */
function Row({ index, entries }: Props) {
  /** get/set entry from list of entries and index */
  const [getEntries, setEntries] = useAtom(entries);
  const entry = getEntries[index]!;
  function setEntry(entry: Partial<Entry>) {
    const entries = cloneDeep(getEntries);
    entries[index] = { ...entries[index]!, ...entry };
    setEntries(entries);
  }

  /** extract entry props */
  const {
    startingOriginal,
    currentOriginal,
    startingTranslation,
    currentTranslation,
    legacyTranslation,
    reviews,
    upvoted,
    start,
    end,
  } = entry;
  const ref = useRef<HTMLDivElement>(null);

  /** url params */
  const { lesson = "", language = "" } = useParams();

  /** page state */
  const getTime = useAtomValue(time);
  const getPlaying = useAtomValue(playing);
  const getShowLegacy = useAtomValue(showLegacy);
  const getCompletion = useAtomValue(completion);

  /** when user seeks youtube player */
  useEffect(() => {
    /** find first row that falls in seeked time range */
    if (ref.current && getTime > start && getTime < end) {
      scrollIntoView(ref.current);
      glow(ref.current);
      return;
    }
  }, [getTime, start, end]);

  /** whether this row has been edited */
  const edited = isEdited(entry);

  const translationWarning =
    currentTranslation.length >= translationMax(entry, language);
  const originalWarning = currentOriginal.length >= originalMax(entry);

  /** issue url params */
  const issueTitle = `${lesson}/${language}`;
  const issueBody = [
    `**Line**:\n`,
    `${startingOriginal.slice(0, 100)}...\n`,
    "\n",
    ...(start && end ? ["**Time**:\n", `${start} - ${end}\n`, "\n"] : []),
    `**Describe the issue**:\n`,
  ];

  return (
    <div
      ref={ref}
      className={classNames(classes.row, (edited || upvoted || reviews > 0) && classes.edited)}
    >
      {/* actions */}
      <div className={classes.actions}>
        <button
          onClick={() => setEntry({ upvoted: !upvoted })}
          data-tooltip="Number of upvotes for latest edit"
        >
          {edited || upvoted ? <FaThumbsUp /> : <FaRegThumbsUp />}
          <span>{edited ? 1 : reviews + Number(upvoted)}</span>
        </button>

        <div className={classes.playWarningWrapper}>
          {translationWarning && (
            <FaExclamationTriangle 
              className={classes.warningTriangle}
              data-tooltip="This translation may be too long to fit in the time slot"
            />
          )}

          {start && end && (
            <button
              className={classes.action}
              onClick={() => {
                const header = document.querySelector("header")!;

                if (getPlaying) {
                  stopVideo();
                  header.style.height = "";
                } else {
                  // Add a little breathing room at the end
                  playSegment(start, end + 0.5);

                  /** expand header */
                  const expand = innerHeight / 3;
                  if (parseFloat(window.getComputedStyle(header).height) < expand)
                    header.style.height = expand + "px";
                }
              }}
              data-tooltip={`Play video at this timestamp<br/>(${formatTime(start)} - ${formatTime(end)})`}
            >
              {getPlaying ? <FaStop /> : <FaPlay />}
            </button>
          )}
        </div>
      </div>

      {/* translation edit textbox */}
      <Textarea
        className={classNames(
          classes.edit,
          translationWarning && classes.warning,
        )}
        value={currentTranslation}
        onChange={(value) => setEntry({ currentTranslation: value })}
        data-tooltip={"Edit translated text"}
      />

      {/* original english textbox */}
      <Textarea
        className={classNames(
          classes.original,
          originalWarning && classes.warning,
        )}
        value={entry.currentOriginal}
        onChange={(value) => setEntry({ currentOriginal: value })}
        data-tooltip={"Original English text. If you see a significant problem, click to edit."}
      />

      {/* secondary actions */}
      <div className={classes.actions}>
        <button
          onClick={() => {
            setEntry({
              currentTranslation: startingTranslation,
              currentOriginal: startingOriginal,
              upvoted: false,
            });
          }}
          data-tooltip="Reset entry"
        >
          <FaArrowsRotate />
        </button>

        <Link
          to={issueLink(issueTitle, issueBody)}
          target="_blank"
          data-tooltip="Create an issue about this translation"
        >
          <FaFlag />
        </Link>
      </div>

      {/* legacy translation */}
      {legacyTranslation && getShowLegacy && getCompletion < 1 && (
        <div className={classes.legacy}>
          <strong>Legacy translation</strong>: {legacyTranslation}
        </div>
      )}
    </div>
  );
}

export default Row;

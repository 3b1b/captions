import { useEffect, useRef } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import {
  FaArrowsRotate,
  FaFlag,
  FaPlay,
  FaRegThumbsUp,
  FaStop,
  FaThumbsUp,
} from "react-icons/fa6";
import { LuBraces } from "react-icons/lu";
import { Link, useParams } from "react-router-dom";
import classNames from "classnames";
import { useAtom, useAtomValue } from "jotai";
import { cloneDeep, truncate } from "lodash";
import { issueLink, repoFull } from "@/api";
import { playing, playSegment, stopVideo, time } from "@/components/Player";
import Textarea from "@/components/Textarea";
import { isEdited, originalMax, translationMax } from "@/data/data";
import { Entry } from "@/data/types";
import {
  captions,
  completion,
  description,
  meta,
  showLegacy,
  title,
} from "@/pages/Edit";
import { legacyTooltip } from "@/pages/edit/Footer";
import { glow, scrollIntoView } from "@/util/dom";
import { isRtl } from "@/util/language";
import { formatTime } from "@/util/string";
import classes from "./Row.module.css";

type Props = {
  index: number;
  entries: typeof title | typeof captions | typeof description;
  file: string;
};

/** editable entry row */
function Row({ index, entries, file }: Props) {
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
  const getMeta = useAtomValue(meta);
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

  /** right to left languages need special styling */
  const rtlLanguage = isRtl(language);

  /** get (rough) line number in raw json */
  const lineNumber = 1 + index * (6 + 2) + 2;
  /** get first few words in original english, url-encoded */
  const firstFewWords = window.encodeURIComponent(
    startingOriginal.split(/\s+/).slice(0, 20).join(" "),
  );

  /** issue url params */
  const issueTitle = `${lesson}/${language}`;
  const issueBody = [
    ["**Original**", truncate(startingOriginal, { length: 300 })],
    ["**Translation**:", truncate(startingTranslation, { length: 300 })],
    start && end ? ["**Time**:", `${start} - ${end}`] : [],
    ["**Line**", `Entry # ${index}`, `Line # ~${lineNumber}`],
    ["**Describe the issue**"],
  ]
    .filter((line) => line.length)
    .map((line) => line.join("\n"))
    .join("\n\n")
    .concat("\n");

  /** get full path to file and line number */
  const path = `${repoFull}/tree/main/${getMeta?.path}/${language}/${file}#:~:text=${firstFewWords}`;

  return (
    <div
      ref={ref}
      className={classNames(
        classes.row,
        (edited || upvoted || reviews > 0) && classes.edited,
      )}
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

        <div className={classes.playWrapper}>
          {translationWarning && (
            <FaExclamationTriangle
              className={classes.warningIcon}
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
                  if (
                    parseFloat(window.getComputedStyle(header).height) < expand
                  )
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
        dir={rtlLanguage ? "rtl" : "ltr"}
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
        data-tooltip={
          "Original English text. If you see a significant problem, click to edit."
        }
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
          to={path}
          target="_blank"
          data-tooltip="See raw JSON for this entry"
        >
          <LuBraces />
        </Link>

        <Link
          to={issueLink(issueTitle, issueBody)}
          target="_blank"
          data-tooltip="Create an issue about this entry"
        >
          <FaFlag />
        </Link>
      </div>

      {/* legacy translation */}
      {legacyTranslation && getShowLegacy && getCompletion < 1 && (
        <>
          <strong className={classes.legacyLabel} data-tooltip={legacyTooltip}>
            Legacy:
          </strong>
          <span
            className={classes.legacyText}
            dir={rtlLanguage ? "rtl" : "ltr"}
          >
            {legacyTranslation}
          </span>
        </>
      )}
    </div>
  );
}

export default Row;

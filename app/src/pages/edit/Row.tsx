import { useEffect, useRef, useState } from "react";
import {
  FaArrowsRotate,
  FaFlag,
  FaPlay,
  FaRegThumbsUp,
  FaThumbsUp,
} from "react-icons/fa6";
import { Link, useParams } from "react-router-dom";
import classNames from "classnames";
import { useSnapshot } from "valtio";
import { playCaption, playerTime } from "@/components/Player";
import Textarea from "@/components/Textarea";
import charsPerSecData from "@/data/avg_char_per_sec.json";
import { Caption, filterFuncs } from "@/pages/Edit";
import { scrollIntoView } from "@/util/dom";
import { issueLink } from "@/util/github";
import { formatTime } from "@/util/string";
import classes from "./Row.module.css";

/** avg chars spoken per sec for each language */
const charsPerSec: Record<string, number> = charsPerSecData;
/** fallback max avg chars per sec */
const maxCharsPerSec = Math.max(...Object.values(charsPerSec));

type Props = {
  caption: Caption;
};

/** editable caption/title/description row */
function Row({ caption }: Props) {
  const {
    reviews,
    startingTranslation,
    currentTranslation,
    startingOriginal,
    timeRange = [],
    legacyTranslation,
  } = useSnapshot(caption);
  const [start = 0, end = 0] = timeRange;

  const ref = useRef<HTMLDivElement>(null);

  /** url params */
  const { slug = "", language = "" } = useParams();

  /** reactive state */
  const timeSnap = useSnapshot(playerTime);

  /** when user seeks youtube player */
  useEffect(() => {
    /** find first row that falls in seeked time range */
    if (ref.current && timeSnap.value > start && timeSnap.value < end) {
      scrollIntoView(ref.current);
      return;
    }
  }, [timeSnap.value, start, end]);

  /** whether this row has been edited */
  const edited = filterFuncs.my(caption);

  /** whether this row is upvoted */
  const [upvoted, setUpvoted] = useState(false);

  useEffect(() => {
    caption.upvoted = upvoted;
  }, [caption, upvoted]);

  /** avg chars spoken per sec for lang */
  const perSec =
    (charsPerSec[language] || maxCharsPerSec) *
    /** allow for some variance around avg */
    1.5;

  /** max allowed chars for translation edit box */
  const maxTranslationLength =
    start && end
      ? /** for entries with time range, i.e. captions */
        perSec * (end - start)
      : /** for entries without a time range, i.e. title and description */
        startingTranslation.length * 1.5 || startingOriginal.length * 2;

  /** max allowed chars for original edit box */
  const maxOriginalLength = startingOriginal.length * 1.2;

  /** issue url params */
  const title = `${slug}/${language}`;
  const body = [
    `**Line**:\n`,
    `${startingOriginal.slice(0, 100)}...\n`,
    "\n",
    ...(start && end ? ["**Time**:\n", `${start} - ${end}\n`, "\n"] : []),
    `**Describe the issue**:\n`,
  ];

  return (
    <div
      ref={ref}
      className={classNames(classes.row, edited && classes.edited)}
    >
      {/* actions */}
      <div className={classes.actions}>
        <button
          onClick={() => setUpvoted(!upvoted)}
          data-tooltip="Number of upvotes for latest edit"
        >
          {edited || upvoted ? <FaThumbsUp /> : <FaRegThumbsUp />}
          <span>{edited ? 1 : reviews + Number(upvoted)}</span>
        </button>

        {timeRange && (
          <button
            className={classes.action}
            onClick={() => {
              /** play */
              playCaption(caption);

              /** expand header */
              const header = document.querySelector("header");
              const expand = innerHeight / 3;
              if (header)
                if (parseFloat(window.getComputedStyle(header).height) < expand)
                  header.style.height = expand + "px";
            }}
            data-tooltip={`Play video at this timestamp<br/>(${formatTime(start)} - ${formatTime(end)})`}
          >
            <FaPlay />
          </button>
        )}
      </div>

      {/* translation edit textbox */}
      <Textarea
        className={classNames(
          classes.edit,
          maxTranslationLength &&
            currentTranslation.length >= maxTranslationLength &&
            classes.limit,
        )}
        value={currentTranslation}
        onChange={(value) => (caption.currentTranslation = value)}
        maxLength={Math.ceil(maxTranslationLength * 1.5)}
        data-tooltip={
          currentTranslation.length >= maxTranslationLength
            ? "This translation is starting to become too long too fit in the time slot"
            : "Edit translated text"
        }
      />

      {/* original english textbox */}
      <Textarea
        className={classNames(
          classes.original,
          maxOriginalLength &&
            caption.currentOriginal.length >= maxOriginalLength &&
            classes.limit,
        )}
        maxLength={Math.ceil(maxOriginalLength * 1.5)}
        value={caption.currentOriginal}
        onChange={(value) => (caption.currentOriginal = value)}
        data-tooltip="Original English text. If you see a significant problem, click to edit."
      />

      {/* secondary actions */}
      <div className={classes.actions}>
        <button
          onClick={() => {
            caption.currentTranslation = startingTranslation;
            caption.currentOriginal = startingOriginal;
            caption.upvoted = false;
          }}
          data-tooltip="Reset entry"
        >
          <FaArrowsRotate />
        </button>

        <Link
          to={issueLink(title, body)}
          target="_blank"
          data-tooltip="Create an issue about this translation"
        >
          <FaFlag />
        </Link>
      </div>

      {/* legacy translation */}
      {legacyTranslation && (
        <div className={classes.legacy}>
          <strong data-tooltip="A community contributed translation from back when YouTube had that feature built-in. For reference or copying/pasting. It may apply to one or more adjacent entries.">
            Legacy translation
          </strong>
          : {legacyTranslation}
        </div>
      )}
    </div>
  );
}

export default Row;

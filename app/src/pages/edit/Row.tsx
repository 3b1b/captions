import { useEffect, useRef, useState } from "react";
import { FaFlag, FaPlay, FaRegThumbsUp, FaThumbsUp } from "react-icons/fa6";
import { Link, useParams } from "react-router-dom";
import classNames from "classnames";
import { startCase } from "lodash";
import { useSnapshot } from "valtio";
import { playCaption, playerTime } from "@/components/Player";
import Textarea from "@/components/Textarea";
import { Caption, filterFuncs } from "@/pages/Edit";
import { scrollIntoView } from "@/util/dom";
import { issueLink } from "@/util/github";
import { formatTime } from "@/util/string";
import classes from "./Row.module.css";

type Props = {
  caption: Caption;
};

/** editable caption/title/description row */
function Row({ caption }: Props) {
  const { timeRange: [start = 0, end = 0] = [], reviews } = caption;
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

  /** whether this row is reviewed (upvoted/edited) */
  const [upvote, setUpvote] = useState(false);
  const reviewed = upvote || edited;
  useEffect(() => {
    caption.reviewed = reviewed;
  }, [caption, reviewed]);

  /** max allowed chars of translated text per original english text */
  const maxTranslationLength = caption.startingOriginal.length * 2;
  const maxOriginalLength = caption.startingOriginal.length * 1.2;

  /** issue url params */
  const title = `${startCase(slug)} - ${startCase(language)}`;
  const body = [
    `**Line**:\n`,
    `${caption.startingOriginal.slice(0, 100)}...\n`,
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
          onClick={() => !edited && setUpvote(!upvote)}
          data-tooltip="Number of upvotes/edits"
        >
          {reviewed ? <FaThumbsUp /> : <FaRegThumbsUp />}
          <span>{reviews + Number(reviewed)}</span>
        </button>

        {caption.timeRange && (
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
            caption.currentTranslation.length === maxTranslationLength &&
            classes.maxlength,
        )}
        value={caption.currentTranslation}
        onChange={(value) => (caption.currentTranslation = value)}
        maxLength={maxTranslationLength}
        data-tooltip={
          caption.currentTranslation.length === maxTranslationLength
            ? "This translation is too long compared to the original text"
            : "Edit translated text"
        }
      />

      {/* original english textbox */}
      <Textarea
        className={classNames(
          classes.original,
          maxOriginalLength &&
            caption.currentOriginal.length === maxOriginalLength &&
            classes.maxlength,
        )}
        value={caption.currentOriginal}
        onChange={(value) => (caption.currentOriginal = value)}
        data-tooltip="Original English text. If you see a significant problem, click to edit."
      />

      {/* secondary actions */}
      <div className={classes.actions}>
        <Link
          to={issueLink(title, body)}
          target="_blank"
          data-tooltip="Create an issue about this translation"
        >
          <FaFlag />
        </Link>
      </div>
    </div>
  );
}

export default Row;

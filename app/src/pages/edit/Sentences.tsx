import { useEffect } from "react";
import { FaClockRotateLeft } from "react-icons/fa6";
import { useParams } from "react-router";
import classNames from "classnames";
import { useSnapshot } from "valtio";
import { playerTime, playSentence } from "@/components/Player";
import Textarea from "@/components/Textarea";
import { filter, filterFuncs, sentences } from "@/pages/Edit";
import { scrollIntoView } from "@/util/dom";
import { formatTime } from "@/util/string";
import classes from "./Sentences.module.css";

/** sentences/captions */
function Sentences() {
  /** url params */
  const { language } = useParams();

  /** reactive state */
  const timeSnap = useSnapshot(playerTime);
  const filterSnap = useSnapshot(filter);
  const sentencesSnap = useSnapshot(sentences, { sync: true });

  /** when user seeks youtube player */
  useEffect(() => {
    /** don't scroll */
    if (preventScroll) {
      preventScroll = false;
      return;
    }

    /** go through sentence rows */
    const rows = document.querySelectorAll(`.${classes.row}`);
    for (const element of rows) {
      /** get time range */
      const start = Number(element.getAttribute("data-start")) || 0;
      const end = Number(element.getAttribute("data-end")) || 0;

      /** find first row that falls in seeked time range */
      if (timeSnap.value > start && timeSnap.value < end) {
        scrollIntoView(element);
        return;
      }
    }
  }, [timeSnap.value]);

  return (
    <div className={classes.rows}>
      {sentencesSnap.value
        .filter(filterFuncs[filterSnap.value])
        .map((sentence, index) => {
          const {
            timeRange: [start, end],
            editHistory,
            original,
          } = sentence;

          return (
            <div
              key={index}
              data-start={start}
              data-end={end}
              className={classNames(
                classes.row,
                filterFuncs.my(sentence) ? classes.edited : "",
              )}
              title={`${formatTime(start)} – ${formatTime(end)}`}
            >
              {/* actions */}
              <div
                className={classes.actions}
                title="Number of edits"
                aria-label="Number of edits"
              >
                <span className={classes.action}>
                  <FaClockRotateLeft />
                  <span>{editHistory.length}</span>
                </span>
              </div>

              {/* edit textbox */}
              <Textarea
                className={classes.edit}
                value={
                  sentencesSnap.value[index]!.currentEdit !== null
                    ? sentencesSnap.value[index]!.currentEdit!
                    : sentencesSnap.value[index]!.editHistory.at(-1)?.text || ""
                }
                onChange={(value) =>
                  (sentences.value[index]!.currentEdit = value)
                }
                onFocus={() => {
                  preventScroll = true;
                  /** seek video to associated time */
                  playSentence(start, end);
                }}
                title={`Translated ${language} text`}
                aria-label={`Translated ${language} text`}
              />

              {/* original english text */}
              <div
                title="Original English text"
                aria-label="Original English text"
              >
                {original}
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default Sentences;

/** flag for if video seek was triggered by textbox focus instead of from user
 * directly seeking in video player, to prevent unnecessary scroll */
let preventScroll = false;

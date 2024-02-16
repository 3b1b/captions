import { Fragment, useEffect } from "react";
import { FaClockRotateLeft } from "react-icons/fa6";
import { useParams } from "react-router";
import classNames from "classnames";
import { useSnapshot } from "valtio";
import { playerTime, playSegment } from "@/components/Player";
import Textarea from "@/components/Textarea";
import { filter, filterFuncs, segments } from "@/pages/Edit";
import { scrollIntoView } from "@/util/dom";
import { formatTime } from "@/util/string";
import classes from "./Segments.module.css";

function Segments() {
  const { language } = useParams();

  const time = useSnapshot(playerTime);
  const filterSnap = useSnapshot(filter);
  const segmentsSnap = useSnapshot(segments, { sync: true });

  useEffect(() => {
    if (preventScroll) {
      preventScroll = false;
      return;
    }

    const rows = document.querySelectorAll(`.${classes.row}[data-index]`);
    for (const element of rows) {
      const index = Number(element.getAttribute("data-index")) || 0;
      const [start = 0, end = 0] = segments[index]?.timeRange || [];
      if (time.value > start && time.value < end) {
        scrollIntoView(element);
        return;
      }
    }
  }, [time.value]);

  return (
    <div className={classes.rows}>
      {segmentsSnap.map((segment, index) => {
        if (!filterFuncs[filterSnap.value](segment))
          return <Fragment key={index} />;

        const {
          timeRange: [start, end],
          editHistory,
          original,
        } = segment;

        return (
          <div
            key={index}
            data-index={index}
            className={classNames(
              classes.row,
              filterFuncs.my(segment) ? classes.edited : "",
            )}
            title={`${formatTime(start)} – ${formatTime(end)}`}
          >
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

            <Textarea
              className={classes.edit}
              value={
                segmentsSnap[index]!.currentEdit !== null
                  ? segmentsSnap[index]!.currentEdit!
                  : segmentsSnap[index]!.editHistory.at(-1)?.text || ""
              }
              onChange={(value) => (segments[index]!.currentEdit = value)}
              onFocus={() => {
                preventScroll = true;
                playSegment(start, end);
              }}
              title={`Translated ${language} text`}
              aria-label={`Translated ${language} text`}
            />

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

export default Segments;

let preventScroll = false;

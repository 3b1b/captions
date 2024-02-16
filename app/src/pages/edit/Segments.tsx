import { useEffect } from "react";
import { FaClockRotateLeft } from "react-icons/fa6";
import classNames from "classnames";
import { useSnapshot } from "valtio";
import { playerTime, playSegment } from "@/components/Player";
import Textarea from "@/components/Textarea";
import { scrollIntoView } from "@/util/dom";
import { formatTime } from "@/util/string";
import classes from "./Segments.module.css";

const segments = Array(20)
  .fill({})
  .map((_, index, array) => ({
    time: [
      25 * ((index + 1) / (array.length - 2) - 0.5 / array.length),
      25 * ((index + 1) / (array.length - 2) + 0.5 / array.length),
    ] as const,
    edits: [
      { text: "Lorem ipsum dolor sit amet" },
      { text: "Lorem ipsum dolor sit" },
      { text: "Lorem ipsum dolor" },
      { text: "Lorem ipsum" },
      { text: "Lorem" },
    ].slice(0, Math.floor(Math.random() * 5)),
    original:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nunc sed velit dignissim sodales ut eu sem integer.",
  }));

function Segments() {
  const time = useSnapshot(playerTime);

  useEffect(() => {
    const rows = document.querySelectorAll(`.${classes.row}[data-index]`);
    for (const element of rows) {
      const index = Number(element.getAttribute("data-index")) || 0;
      const [start = 0, end = 0] = segments[index]?.time || [];
      if (time.value > start && time.value < end) {
        scrollIntoView(element);
        break;
      }
    }
  }, [time.value]);

  return (
    <div className={classes.rows}>
      {segments.map(({ time: [start, end], edits, original }, index) => (
        <div
          key={index}
          data-index={index}
          className={classNames(classes.row, classes.inactive)}
          title={`${formatTime(start)} – ${formatTime(end)}`}
        >
          <div className={classes.actions}>
            <span className={classes.action}>
              <FaClockRotateLeft />
              <span>{edits.length}</span>
            </span>
          </div>

          <Textarea
            className={classes.edit}
            value={edits.at(-1)?.text || original}
            onChange={() => null}
            onFocus={() => playSegment(start, end)}
          />

          <div>{original}</div>
        </div>
      ))}
    </div>
  );
}

export default Segments;

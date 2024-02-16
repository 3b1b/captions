import { FaClockRotateLeft } from "react-icons/fa6";
import classNames from "classnames";
import Textarea from "@/components/Textarea";
import classes from "./Segments.module.css";

const segments = Array(20)
  .fill({})
  .map(() => ({
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
  return (
    <div className={classes.rows}>
      {segments.map((segment, index) => (
        <div key={index} className={classNames(classes.row, classes.inactive)}>
          <div className={classes.action}>
            <FaClockRotateLeft />
            <span>{segment.edits.length}</span>
          </div>

          <Textarea
            className={classes.edit}
            value={segment.edits.at(-1)?.text || segment.original}
            onChange={() => null}
          />

          <div>{segment.original}</div>
        </div>
      ))}
    </div>
  );
}

export default Segments;

import { FaClockRotateLeft } from "react-icons/fa6";
import classNames from "classnames";
import Textarea from "@/components/Textarea";
import { filterFuncs, ReadonlyCaption } from "@/pages/Edit";
import { formatTime } from "@/util/string";
import classes from "./Row.module.css";

type Props = {
  caption: ReadonlyCaption;
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
};

function Row({ caption, value, onChange, onFocus }: Props) {
  const { timeRange: [start, end] = [], editHistory, original } = caption;

  const range =
    start && end ? `${formatTime(start)} – ${formatTime(end)}` : undefined;

  return (
    <div
      data-start={start}
      data-end={end}
      className={classNames(
        classes.row,
        filterFuncs.my(caption) ? classes.edited : "",
      )}
      title={range}
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
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        title="Translated text"
        aria-label="Translated text"
      />

      {/* original english text */}
      <div title="Original English text" aria-label="Original English text">
        {original}
      </div>
    </div>
  );
}

export default Row;

import { Fragment } from "react";
import { Link, useParams } from "react-router-dom";
import { useAtomValue } from "jotai";
import { startCase } from "lodash";
import { issueLink } from "@/api";
import {
  captions,
  description,
  filter,
  filterFuncs,
  title,
} from "@/pages/Edit";
import Row from "@/pages/edit/Row";
import classes from "../Edit.module.css";

type Props = {
  label: string;
  entries: typeof title | typeof captions | typeof description;
  file: string;
};

/** title/caption/description editor rows */
function Section({ label, entries, file }: Props) {
  /** url params */
  const { lesson = "", language = "" } = useParams();

  /** page state */
  const getFilter = useAtomValue(filter);
  const getEntries = useAtomValue(entries);

  return (
    <section data-full>
      <h2>{startCase(label)}</h2>

      {/* rows of captions */}
      {getEntries.length ? (
        <div className={classes.rows}>
          {getEntries.map((entry, index) =>
            filterFuncs[getFilter](entry) ? (
              <Row key={index} index={index} entries={entries} file={file} />
            ) : (
              <Fragment key={index} />
            ),
          )}
        </div>
      ) : (
        /* missing */
        <span>
          No {label} file found.{" "}
          <Link
            to={issueLink(`${lesson}/${language}`, `Missing ${label} file`)}
            target="_blank"
          >
            Create an issue.
          </Link>
        </span>
      )}
    </section>
  );
}

export default Section;

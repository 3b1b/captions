import { Link, useParams } from "react-router-dom";
import { startCase } from "lodash";
import { useSnapshot } from "valtio";
import { filter, filterFuncs, title } from "@/pages/Edit";
import Row from "@/pages/edit/Row";
import { issueLink } from "@/util/github";
import classes from "../Edit.module.css";

/** title editor row */
function Title() {
  /** url params */
  const { slug = "", language = "" } = useParams();

  /** reactive state */
  const filterSnap = useSnapshot(filter);
  const titleSnap = useSnapshot(title, { sync: true });

  /** filtered title */
  const _title =
    titleSnap.value && filterFuncs[filterSnap.value](titleSnap.value)
      ? [titleSnap.value]
      : [];

  return (
    <section data-full>
      <h2>Title</h2>

      {/* title row */}
      {titleSnap.value ? (
        <div className={classes.rows}>
          {_title.map((_, index) => (
            <Row key={index} caption={title.value!} />
          ))}
        </div>
      ) : (
        /* missing */
        <span>
          No title file found.{" "}
          <Link
            to={issueLink(`${startCase(slug)} - ${startCase(language)}`, [
              "Missing title file",
            ])}
            target="_blank"
          >
            Create an issue.
          </Link>
        </span>
      )}
    </section>
  );
}

export default Title;

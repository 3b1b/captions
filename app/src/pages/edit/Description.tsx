import { Link, useParams } from "react-router-dom";
import { startCase } from "lodash";
import { useSnapshot } from "valtio";
import { description, filter, filterFuncs } from "@/pages/Edit";
import Row from "@/pages/edit/Row";
import { issueLink } from "@/util/github";
import classes from "../Edit.module.css";

/** description editor rows */
function Description() {
  /** url params */
  const { slug = "", language = "" } = useParams();

  /** reactive state */
  const filterSnap = useSnapshot(filter);
  const descriptionSnap = useSnapshot(description, { sync: true });

  return (
    <section data-full>
      <h2>Description</h2>

      {/* rows of description */}
      {descriptionSnap.value.length ? (
        <div className={classes.rows}>
          {descriptionSnap.value
            .filter(filterFuncs[filterSnap.value])
            .map((_, index) => (
              <Row key={index} caption={description.value[index]!} />
            ))}
        </div>
      ) : (
        /* missing */
        <span>
          No description file found.{" "}
          <Link
            to={issueLink(`${startCase(slug)} - ${startCase(language)}`, [
              "Missing description file",
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

export default Description;

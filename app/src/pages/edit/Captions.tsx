import { Link, useParams } from "react-router-dom";
import { startCase } from "lodash";
import { useSnapshot } from "valtio";
import { captions, filter, filterFuncs } from "@/pages/Edit";
import Row from "@/pages/edit/Row";
import { issueLink } from "@/util/github";
import classes from "../Edit.module.css";

/** caption editor rows */
function Captions() {
  /** url params */
  const { slug = "", language = "" } = useParams();

  /** reactive state */
  const filterSnap = useSnapshot(filter);
  const captionsSnap = useSnapshot(captions, { sync: true });

  return (
    <section data-full>
      <h2>Captions</h2>

      {/* rows of captions */}
      {captionsSnap.value.length ? (
        <div className={classes.rows}>
          {captionsSnap.value
            .filter(filterFuncs[filterSnap.value])
            .map((_, index) => (
              <Row key={index} caption={captions.value[index]!} />
            ))}
        </div>
      ) : (
        /* missing */
        <span>
          No caption file found.{" "}
          <Link
            to={issueLink(`${startCase(slug)} - ${startCase(language)}`, [
              "Missing caption file",
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

export default Captions;

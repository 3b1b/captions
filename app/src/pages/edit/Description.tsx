import { useSnapshot } from "valtio";
import { description, filter, filterFuncs } from "@/pages/Edit";
import Row from "@/pages/edit/Row";
import classes from "../Edit.module.css";

/** description editor rows */
function Description() {
  /** reactive state */
  const filterSnap = useSnapshot(filter);
  const descriptionSnap = useSnapshot(description, { sync: true });

  return (
    <section data-full>
      <h2>Description</h2>

      <div className={classes.rows}>
        {descriptionSnap.value
          .filter(filterFuncs[filterSnap.value])
          .map((caption, index) => (
            <Row
              key={index}
              caption={caption}
              value={descriptionSnap.value[index]!.currentEdit || ""}
              onChange={(value) =>
                (description.value[index]!.currentEdit = value)
              }
            />
          ))}
      </div>
    </section>
  );
}

export default Description;

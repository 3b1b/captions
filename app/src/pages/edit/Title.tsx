import { useSnapshot } from "valtio";
import { filter, filterFuncs, title } from "@/pages/Edit";
import Row from "@/pages/edit/Row";
import classes from "../Edit.module.css";

/** title editor row */
function Title() {
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

      <div className={classes.rows}>
        {_title.map((caption, index) => (
          <Row
            key={index}
            caption={caption}
            value={titleSnap.value!.currentEdit || ""}
            onChange={(value) => (title.value!.currentEdit = value)}
          />
        ))}
      </div>
    </section>
  );
}

export default Title;

import { FaPaperPlane } from "react-icons/fa6";
import { useSnapshot } from "valtio";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import Select from "@/components/Select";
import {
  captions,
  description,
  filter,
  filterFuncs,
  filters,
  sticky,
  title,
} from "@/pages/Edit";
import classes from "./Footer.module.css";

function Footer() {
  /** reactive state */
  const filterSnap = useSnapshot(filter);
  const stickySnap = useSnapshot(sticky);
  const titleSnap = useSnapshot(title);
  const descriptionSnap = useSnapshot(description);
  const captionsSnap = useSnapshot(captions);

  /** full list of all entries */
  const list = descriptionSnap.value.concat(captionsSnap.value);
  if (titleSnap.value) list.unshift(titleSnap.value);

  /** get count for each filter */
  const filterCounts = filters.map((filter) => ({
    ...filter,
    count: list.filter(filterFuncs[filter.id]).length,
  }));

  /** edit filter count */
  const edits = filterCounts.find((filter) => filter.id === "my")?.count || 0;

  return (
    <footer
      className={classes.footer}
      style={{ position: stickySnap.value ? "sticky" : undefined }}
    >
      <div className={classes.options}>
        <Select
          label="Show"
          options={filterCounts}
          value={filterSnap.value}
          onChange={(value) => (filter.value = value)}
        />
        <Checkbox
          label="Sticky header/footer"
          value={stickySnap.value}
          onChange={(value) => (sticky.value = value)}
        />
      </div>
      <Button
        disabled={edits === 0}
        text={`Submit ${edits.toLocaleString()} Edit(s)`}
        icon={<FaPaperPlane />}
      />
    </footer>
  );
}

export default Footer;
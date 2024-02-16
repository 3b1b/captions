import { FaPaperPlane } from "react-icons/fa6";
import { useSnapshot } from "valtio";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import Select from "@/components/Select";
import { filter, filterFuncs, filters, segments, sticky } from "@/pages/Edit";
import classes from "./Footer.module.css";

function Footer() {
  const filterSnap = useSnapshot(filter);
  const stickySnap = useSnapshot(sticky);
  const segmentsSnap = useSnapshot(segments);

  const filterCounts = filters.map((filter) => ({
    ...filter,
    count: segmentsSnap.filter(filterFuncs[filter.id]).length,
  }));

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

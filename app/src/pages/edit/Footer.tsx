import { FaPaperPlane } from "react-icons/fa6";
import { useLocalStorage } from "react-use";
import { useSnapshot } from "valtio";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import Input from "@/components/Input";
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
  /** local state */
  const [user, setUser] = useLocalStorage("3b1b-captions", "");

  /** reactive state */
  const filterSnap = useSnapshot(filter);
  const stickySnap = useSnapshot(sticky);
  const titleSnap = useSnapshot(title);
  const descriptionSnap = useSnapshot(description);
  const captionsSnap = useSnapshot(captions);

  /** full list of all entries */
  const list = descriptionSnap.value.concat(captionsSnap.value);

  /** add title entry */
  if (titleSnap.value) list.unshift(titleSnap.value);

  /** filter options, with counts */
  const filterOptions = filters.map((filter) => ({
    ...filter,
    count: list.filter(filterFuncs[filter.id]).length,
  }));

  /** edit filter count */
  const edits = filterOptions.find((filter) => filter.id === "my")?.count || 0;

  return (
    <footer
      className={classes.footer}
      style={{ position: stickySnap.value ? "sticky" : undefined }}
    >
      <div className={classes.row}>
        <Select
          label="Show"
          options={filterOptions}
          value={filterSnap.value}
          onChange={(value) => (filter.value = value)}
        />
        <Checkbox
          label="Sticky header/footer"
          value={stickySnap.value}
          onChange={(value) => (sticky.value = value)}
        />
      </div>

      <div className={classes.row}>
        <Input
          value={user}
          onChange={setUser}
          placeholder="@github-user or name"
        />

        <Button
          disabled={edits === 0}
          text={`Submit ${edits.toLocaleString()} Edit(s)`}
          icon={<FaPaperPlane />}
        />
      </div>
    </footer>
  );
}

export default Footer;

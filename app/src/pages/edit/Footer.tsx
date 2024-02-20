import { FaDownload, FaPaperPlane } from "react-icons/fa6";
import { useParams } from "react-router";
import { useLocalStorage } from "react-use";
import { useSnapshot } from "valtio";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import Input from "@/components/Input";
import Select from "@/components/Select";
import {
  captions,
  description,
  exportData,
  filter,
  filterFuncs,
  filters,
  sticky,
  title,
} from "@/pages/Edit";
import { downloadZip } from "@/util/download";
import classes from "./Footer.module.css";

function Footer() {
  /** url params */
  const { slug = "", language = "" } = useParams();

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
          data-tooltip="Show only certain entries"
        />
        <Checkbox
          label="Sticky header/footer"
          value={stickySnap.value}
          onChange={(value) => (sticky.value = value)}
          data-tooltip="Keep the header/footer at the top/bottom of the screen"
        />
      </div>

      <div className={classes.row}>
        <Button
          icon={<FaDownload />}
          data-tooltip="Download your changes as a backup or to submit a pull request manually."
          onClick={() => downloadZip(exportData(), `${slug} ${language}`)}
        />

        <Input
          value={user}
          onChange={setUser}
          placeholder="@github-user or name"
          data-tooltip="So we can tag you on GitHub and/or attribute these edits to you"
        />

        <Button
          disabled={edits === 0}
          text={`Submit ${edits.toLocaleString()} Edit(s)`}
          icon={<FaPaperPlane />}
          data-tooltip="Submit your changes to be reviewed. Opens a public a pull request on GitHub."
        />
      </div>
    </footer>
  );
}

export default Footer;

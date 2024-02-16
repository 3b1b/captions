import { FaPaperPlane } from "react-icons/fa6";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import Select from "@/components/Select";
import classes from "./Footer.module.css";

const filters = [
  "All",
  "Original AI-generated",
  "Human-edited",
  "My edits",
  // "Heavily edited segments",
  // "Recently edited segments",
] as const;

function Footer() {
  return (
    <footer className={classes.footer}>
      <div className={classes.options}>
        <Select
          label="Segments"
          options={filters}
          value={filters[0]}
          onChange={console.info}
        />
        <Checkbox
          label="Sticky header/footer"
          value={true}
          onChange={console.info}
        />
      </div>
      <Button text="Submit X Edit(s)" icon={<FaPaperPlane />} />
    </footer>
  );
}

export default Footer;

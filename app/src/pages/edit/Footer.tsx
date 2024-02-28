import { useState } from "react";
import { FaDownload, FaPaperPlane } from "react-icons/fa6";
import { ImSpinner8 } from "react-icons/im";
import { useParams } from "react-router";
import { useLocalStorage } from "react-use";
import { useAtom, useAtomValue } from "jotai";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import Input from "@/components/Input";
import Select from "@/components/Select";
import {
  captions,
  completion,
  description,
  exportData,
  filter,
  filterFuncs,
  filters,
  showLegacy,
  sticky,
  submitPr,
  title,
} from "@/pages/Edit";
import { downloadZip } from "@/util/download";
import classes from "./Footer.module.css";

function Footer() {
  /** url params */
  const { lesson = "", language = "" } = useParams();

  /** local state */
  const [submitting, setSubmitting] = useState(false);
  const [author, setAuthor] = useLocalStorage("3b1b-translations-author", "");

  /** page state */
  const [getFilter, setFilter] = useAtom(filter);
  const [getSticky, setSticky] = useAtom(sticky);
  const [getShowLegacy, setShowLegacy] = useAtom(showLegacy);
  const getTitle = useAtomValue(title);
  const getCaptions = useAtomValue(captions);
  const getDescription = useAtomValue(description);
  const getCompletion = useAtomValue(completion);

  /** full list of all entries */
  const list = getDescription.concat(getCaptions);

  /** add title entry */
  if (getTitle) list.unshift(...getTitle);

  /** filter options, with counts */
  const filterOptions = filters.map((filter) => ({
    ...filter,
    count: list.filter(filterFuncs[filter.id]).length,
  }));

  /** edit filter count */
  const edits = filterOptions.find((filter) => filter.id === "my")?.count || 0;

  /** when page submitted */

  return (
    <footer
      className={classes.footer}
      style={{ position: getSticky ? "sticky" : undefined }}
    >
      <div className={classes.row}>
        <Select
          label="Show"
          options={filterOptions}
          value={getFilter}
          onChange={setFilter}
          data-tooltip="Show only certain entries"
        />

        <Checkbox
          label="Sticky header/footer"
          value={getSticky}
          onChange={setSticky}
          data-tooltip="Keep the header/footer at the top/bottom of the screen"
        />

        {getCaptions.some((caption) => caption.legacyTranslation) &&
          getCompletion < 1 && (
            <Checkbox
              label="Show legacy translations"
              value={getShowLegacy}
              onChange={setShowLegacy}
              data-tooltip="Show community contributed translations from back when YouTube had that feature built-in. For reference or copy/pasting.<br/><br/><b>Note:</b> The way they are split is different and they may apply to one or more adjacent entries."
            />
          )}
      </div>

      <div className={classes.row}>
        <Button
          icon={<FaDownload />}
          data-tooltip="Download your edits as a backup or to submit a pull request manually."
          onClick={() => downloadZip(exportData(), `${lesson} ${language}`)}
        />

        <Input
          value={author}
          onChange={setAuthor}
          placeholder="@github-user or name"
          data-tooltip="So we can tag you on GitHub and/or attribute these edits to you"
          required={true}
          form="submit-edits"
        />

        <Button
          disabled={edits === 0 || submitting}
          text={
            submitting
              ? "Submitting"
              : `Submit ${edits.toLocaleString()} Edit(s)`
          }
          icon={submitting ? <ImSpinner8 className="spin" /> : <FaPaperPlane />}
          type="submit"
          form="submit-edits"
          data-tooltip="Submit your edits to be reviewed. Opens a public pull request on GitHub."
        />

        <form
          id="submit-edits"
          onSubmit={async () => {
            setSubmitting(true);
            const pr = await submitPr(lesson, language, author || "");
            setSubmitting(false);
            if (pr && window.confirm(successMessage(pr.link)))
              window.location.href = pr.link;
          }}
        />
      </div>
    </footer>
  );
}

export default Footer;

const successMessage = (link: string) =>
  `Edits submitted successfully at ${link}! Would you like to go there now? This is where you can make further edits, make comments, and watch for reviews.`;

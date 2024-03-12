import { useRef, useState } from "react";
import { FaDownload, FaPaperPlane, FaUpload } from "react-icons/fa6";
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
  importData,
  showLegacy,
  sticky,
  submitPr,
  title,
} from "@/pages/Edit";
import { downloadZip, uploadZip } from "@/util/download";
import classes from "./Footer.module.css";

function Footer() {
  /** url params */
  const { lesson = "", language = "" } = useParams();

  const uploadRef = useRef<HTMLInputElement>(null);

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

  /** whether to disable submitting */
  const disabled = edits === 0 || submitting;

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
              data-tooltip={legacyTooltip}
            />
          )}
      </div>

      <div className={classes.row}>
        <Button
          icon={<FaUpload />}
          data-tooltip="Import a previously downloaded zip file of edits"
          onClick={(event) =>
            (
              (event.currentTarget as HTMLButtonElement)
                .nextElementSibling as HTMLInputElement
            )?.click()
          }
        />
        <input
          ref={uploadRef}
          type="file"
          accept=".zip"
          style={{ display: "none" }}
          onChange={async (event) => {
            /** get uploaded file object */
            const file = (event.target?.files || [])[0];
            if (file) importData(await uploadZip(await file.arrayBuffer()));
            /** reset input */
            if (uploadRef.current) uploadRef.current.value = "";
          }}
        />

        <Button
          icon={<FaDownload />}
          data-tooltip="Download your edits as a backup or to submit a pull request manually"
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
          aria-disabled={disabled}
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
          onSubmit={async (event) => {
            /** prevent page from nav'ing away before submitting finished */
            event.preventDefault();

            if (disabled) return;

            setSubmitting(true);
            await submitPr(lesson, language, author || "");
            setSubmitting(false);
          }}
        />
      </div>
    </footer>
  );
}

export default Footer;

export const legacyTooltip =
  "Community contributed translations from back when YouTube had that feature built-in. For reference or copy/pasting.<br/><br/><b>Note:</b> The way they are split is different and they may apply to one or more adjacent entries.";

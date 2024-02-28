import { LoaderFunction, redirect, useBlocker } from "react-router";
import { atom } from "jotai";
import { branchExists, createPr, repoRaw, request } from "@/api";
import { getAtom, loading, setAtom } from "@/App";
import { calcCompletion, convert, isEdited, revert } from "@/data/data";
import lessons from "@/data/lessons.json";
import { _Entry, Entry } from "@/data/types";
import Footer from "@/pages/edit/Footer";
import Header from "@/pages/edit/Header";
import Section from "@/pages/edit/Section";

/** translation edit page */
function Edit() {
  /** protect users from losing work */
  useBlocker(() => !window.confirm(navMessage));

  return (
    <>
      <Header />
      <main>
        <Section label="title" entries={title} />
        <Section label="captions" entries={captions} />
        <Section label="description" entries={description} />
      </main>
      <Footer />
    </>
  );
}

export default Edit;

/** page-wide state */

/** whether lesson is locked */
export const locked = atom(false);
/** video id */
export const video = atom("");
/** lesson metadata */
export const meta = atom<(typeof lessons)[number] | null>(null);
/** lesson language */
let language = "";
/** lesson title */
export const title = atom<Entry[]>([]);
/** lesson captions */
export const captions = atom<Entry[]>([]);
/** lesson description */
export const description = atom<Entry[]>([]);
/** selected filter id */
export const filter = atom<Filter>("all");
/** whether header/footer are sticky */
export const sticky = atom(true);
/** whether to show legacy translations */
export const showLegacy = atom(true);
/** completion of current lesson */
export const completion = atom((get) =>
  calcCompletion(get(captions), language),
);

/** filter options */
export const filters = [
  { id: "all", label: "All" },
  { id: "original", label: "Original AI-generated" },
  { id: "human", label: "Human-edited" },
  { id: "my", label: "My edits" },
  // "Heavily edited captions",
  // "Recently edited captions",
] as const;

/** filter option id enum */
type Filter = (typeof filters)[number]["id"];

/** take in a entry and return whether it should be kept */
type FilterFunc = (value: Entry) => boolean;

/** filter function for each filter option */
export const filterFuncs: Record<Filter, FilterFunc> = {
  all: () => true,
  original: (entry) => entry.reviews === 0,
  human: (entry) => entry.reviews > 0,
  my: (entry) => isEdited(entry) || entry.upvoted,
};

/** page data loader */
export const loader: LoaderFunction = async ({ params }) => {
  /** get lesson and language slug from url */
  const { lesson = "" } = params;
  language = params.language || "";

  setAtom(loading, 0);

  /** check if edit already open for lesson/language */
  setAtom(locked, await branchExists(`${lesson}-${language}`));
  if (getAtom(locked)) {
    window.alert(lockedMessage);
    return redirect("/");
  }

  setAtom(loading, 0.2);

  /** lookup lesson metadata */
  setAtom(meta, lessons.find((l) => l.lesson === lesson) || null);
  const { path = "" } = getAtom(meta) || {};

  /** reset */
  setAtom(video, "");
  setAtom(title, []);
  setAtom(description, []);
  setAtom(captions, []);

  if (!getAtom(meta)) {
    console.error("Couldn't load lesson meta");
    return null;
  }

  /** base raw folder containing json files */
  const base = `${repoRaw}/main`;

  /** load video id */
  {
    const url = `${base}/${getAtom(meta)?.path}/video_url.txt`;
    const data = await request<string>(url, {}, "text");
    if (data) setAtom(video, data.split("/").pop() || "");
  }

  setAtom(loading, 0.4);

  /** load title entry */
  {
    const url = `${base}/${path}/${language}/title.json`;
    const data = await request<_Entry>(url);
    if (data) setAtom(title, [data].map(convert));
  }

  setAtom(loading, 0.6);

  /** load description entries */
  {
    const url = `${base}/${path}/${language}/description.json`;
    const data = await request<_Entry[]>(url);
    if (data) setAtom(description, data.map(convert));
  }

  setAtom(loading, 0.8);

  /** load caption entries */
  {
    const url = `${base}/${path}/${language}/sentence_translations.json`;
    const data = await request<_Entry[]>(url);
    if (data) setAtom(captions, data.map(convert));
  }

  setAtom(loading, 1);

  return null;
};

/** clean data for export */
export function exportData() {
  return {
    title: getAtom(title).map(revert)[0],
    description: getAtom(description).map(revert),
    sentence_translations: getAtom(captions).map(revert),
  };
}

/** submit pr */
export async function submitPr(
  lesson: string,
  language: string,
  author: string,
) {
  const path = `${getAtom(meta)?.path}/${language}`;

  /** make request */
  const pr = await createPr({
    branch: `${lesson}-${language}`,
    title: `Edit "${lesson} (${language})"`,
    body: [`Author: ${author}`].join("\n"),
    files: [
      {
        path: `${path}/title.json`,
        content: getAtom(title).map(revert)[0],
      },
      {
        path: `${path}/sentence_translations.json`,
        content: getAtom(captions).map(revert),
      },
      {
        path: `${path}/description.json`,
        content: getAtom(description).map(revert),
      },
    ],
  });

  console.info(pr);

  /** error */
  if (typeof pr === "string") window.alert(submitMessage(pr));
  /** success */ else if (window.confirm(successMessage(pr.data.html_url)))
    window.location.href = pr.data.html_url;
}

const lockedMessage =
  "This lesson/language is already being edited by someone, see github.com/3b1b/captions/pulls. Please work on something else for now.";

const navMessage =
  "Are you sure you want to navigate away from this page? Unsaved edits will be lost.";

const submitMessage = (error: string) =>
  `There was an error submitting: ${error.replace(/\.$/, "")}. Please save your edits as a backup, then try again later or report this issue.`;

const successMessage = (link: string) =>
  `Edits submitted successfully at ${link}! Would you like to go there now? This is where you can make further edits, make comments, and watch for reviews.`;

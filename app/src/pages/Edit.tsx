import { LoaderFunction, useBlocker } from "react-router";
import { atom } from "jotai";
import { branchExists, repoRaw, request } from "@/api";
import { getAtom, setAtom } from "@/App";
import { calcCompletion, convert, revert } from "@/data/data";
import lessons from "@/data/lessons.json";
import { _Entry, _Timings, Entry } from "@/data/types";
import Footer from "@/pages/edit/Footer";
import Header from "@/pages/edit/Header";
import Section from "@/pages/edit/Section";

const navWarning =
  "Are you sure you want to navigate away from this page? Unsaved edits will be lost.";

const lockedWarning =
  "This lesson/language is already being edited by someone. Click the lock for more info. You may want to work on something else for now.";

/** translation edit page */
function Edit() {
  /** protect users from losing work */
  useBlocker(() => !window.confirm(navWarning));

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
  my: (entry) =>
    entry.currentTranslation !== entry.startingTranslation ||
    entry.currentOriginal !== entry.startingOriginal ||
    entry.upvoted,
};

/** page data loader */
export const loader: LoaderFunction = async ({ params }) => {
  /** get lesson and language slug from url */
  const { lesson = "" } = params;
  language = params.language || "";

  /** set language */

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

  /** check if edit already open for lesson/language */
  setAtom(locked, await branchExists(`${lesson}-${language}`));
  if (getAtom(locked))
    window.setTimeout(() => {
      window.alert(lockedWarning);
    }, 1000);

  /** base raw folder containing json files */
  const base = `${repoRaw}/main`;

  /** load video id */
  {
    const url = `${base}/${getAtom(meta)?.path}/video_url.txt`;
    const data = await request<string>(url, {}, "text");
    if (data) setAtom(video, data.split("/").pop() || "");
  }

  /** load title entry */
  {
    const url = `${base}/${path}/${language}/title.json`;
    const data = await request<_Entry>(url);
    if (data) setAtom(title, [data].map(convert));
  }

  /** load description entries */
  {
    const url = `${base}/${path}/${language}/description.json`;
    const data = await request<_Entry[]>(url);
    if (data) setAtom(description, data.map(convert));
  }

  /** load caption entries */
  {
    const url = `${base}/${path}/${language}/sentence_translations.json`;
    const data = await request<_Entry[]>(url);
    if (data) setAtom(captions, data.map(convert));
  }

  /** load caption timings */
  {
    const url = `${base}/${path}/english/sentence_timings.json`;
    const data = await request<_Timings>(url);
    if (data)
      data.forEach(([, start, end], index) => {
        if (getAtom(captions)[index])
          getAtom(captions)[index]!.timeRange = [start, end];
      });
  }

  return null;
};

/** clean data for export */
export function exportData() {
  return {
    title: getAtom(description).map(revert),
    description: getAtom(description).map(revert),
    sentence_translations: getAtom(captions).map(revert),
  };
}

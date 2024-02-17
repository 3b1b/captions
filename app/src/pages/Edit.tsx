import { LoaderFunction, useBlocker } from "react-router";
import { proxy, useSnapshot } from "valtio";
import Captions from "@/pages/edit/Captions";
import Description from "@/pages/edit/Description";
import Footer from "@/pages/edit/Footer";
import Header from "@/pages/edit/Header";
import Title from "@/pages/edit/Title";

/** video edit page */
function Edit() {
  useBlocker(
    () =>
      !window.confirm(
        "Are you sure you want to navigate away from this page? Unsaved changes will be lost.",
      ),
  );

  return (
    <>
      <Header />
      <main>
        <Title />
        <Description />
        <Captions />
      </main>
      <Footer />
    </>
  );
}

export default Edit;

/** caption format on github */
type _Caption = {
  input: string;
  translatedText: string;
  time_range?: [number, number];
};

/** page data loader */
export const loader: LoaderFunction = async ({ params }) => {
  /** get lesson and language slug from url */
  const { lesson, language } = params;

  /** base raw folder containing json files */
  let base = `https://raw.githubusercontent.com/3b1b/captions/main`;

  /** try years until we get right one */
  let year = 0;
  for (let y = 2015; y < 2030; y++) {
    /** try to lookup folder on github */
    try {
      const url = `${base}/${y}/${lesson}/video_url.txt`;
      const response = await fetch(url);
      if (!response.ok) throw Error();
      year = y;
      break;
    } catch (error) {
      continue;
    }
  }

  /** check if we found year */
  if (!year) {
    console.error("Couldn't find video folder");
    year = new Date().getFullYear();
  }

  /** add to base url */
  base += `/${year}/${lesson}`;

  /** load video id */
  try {
    const url = `${base}/video_url.txt`;
    const data = (await (await fetch(url)).text()) as string;

    /** map raw format to format needed for app */
    id.value = data.split("/").pop() || "";
  } catch (error) {
    console.error("Couldn't load caption data");
  }

  /** add to base url */
  base += `/${language}`;

  /** load title */
  try {
    const url = `${base}/title.json`;
    const { input, translatedText } = (await (
      await fetch(url)
    ).json()) as _Caption;

    /** map raw format to format needed for app */
    title.value = {
      original: input,
      editHistory: [{ text: translatedText }],
      currentEdit: null,
    };
  } catch (error) {
    console.error("Couldn't load title data");
  }

  /** load description */
  try {
    const url = `${base}/description.json`;
    const data = (await (await fetch(url)).json()) as _Caption[];

    /** map raw format to format needed for app */
    description.value = data.map(({ input, translatedText }) => ({
      original: input,
      editHistory: [{ text: translatedText }],
      currentEdit: null,
    }));
  } catch (error) {
    console.error("Couldn't load description data");
  }

  /** load captions */
  try {
    const url = `${base}/sentence_translations.json`;
    const data = (await (await fetch(url)).json()) as _Caption[];

    /** map raw format to format needed for app */
    captions.value = data.map(({ input, translatedText, time_range }) => ({
      original: input,
      editHistory: [{ text: translatedText }],
      timeRange: time_range || [0, 0],
      currentEdit: null,
    }));
  } catch (error) {
    console.error("Couldn't load caption data");
  }

  return null;
};

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

/** selected filter id */
export const filter = proxy<{ value: Filter }>({ value: "all" });

/** take in a caption and return whether it should be kept */
type FilterFunc = (value: ReadonlyCaption) => boolean;

/** filter function for each filter option */
export const filterFuncs: Record<Filter, FilterFunc> = {
  all: () => true,
  original: (caption) => caption.editHistory.length === 1,
  human: (caption) => caption.editHistory.length > 1,
  my: (caption) => caption.currentEdit !== null,
};

/** whether header/footer are sticky */
export const sticky = proxy({ value: true });

/** video id */
export const id = proxy({ value: "" });

/** video title */
export const title = proxy<{ value: Caption | null }>({ value: null });

/** video description */
export const description = proxy<{ value: Caption[] }>({ value: [] });

/** caption data */
export type Caption = {
  original: string;
  editHistory: { text: string }[];
  currentEdit: string | null;
  timeRange?: [number, number];
};

/** caption, but deeply readonly (when using snapshot) */
export type ReadonlyCaption = ReturnType<typeof useSnapshot<Caption>>;

/** editable captions state */
export const captions = proxy<{ value: Caption[] }>({ value: [] });

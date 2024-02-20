import { LoaderFunction, useBlocker } from "react-router";
import { proxy, useSnapshot } from "valtio";
import lessonMeta from "@/data/lesson-meta.json";
import Captions from "@/pages/edit/Captions";
import Description from "@/pages/edit/Description";
import Footer from "@/pages/edit/Footer";
import Header from "@/pages/edit/Header";
import Title from "@/pages/edit/Title";

const navWarning =
  "Are you sure you want to navigate away from this page? Unsaved changes will be lost.";

/** translation edit page */
function Edit() {
  /** protect users from losing work */
  useBlocker(() => !window.confirm(navWarning));

  return (
    <>
      <Header />
      <main>
        <Title />
        <Captions />
        <Description />
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
  n_edits?: number;
};

/** page data loader */
export const loader: LoaderFunction = async ({ params }) => {
  /** get lesson and language slug from url */
  const { slug = "", language = "" } = params;

  /** lookup lesson metadata */
  meta.value =
    lessonMeta.find(
      (lesson) => lesson.slug === slug && lesson.languages.includes(language),
    ) || null;

  if (!meta.value) {
    video.value = "";
    title.value = null;
    description.value = [];
    captions.value = [];
    console.error("Couldn't load lesson meta");
    return null;
  }

  /** base raw folder containing json files */
  const base = `https://raw.githubusercontent.com/3b1b/captions/main`;

  /** load video id */
  try {
    const url = `${base}/${meta.value.path}/video_url.txt`;
    const data = (await (await fetch(url)).text()) as string;

    /** map raw format to format needed for app */
    video.value = data.split("/").pop() || "";
  } catch (error) {
    console.error("Couldn't load video data");
    video.value = "";
  }

  /** load title */
  try {
    const url = `${base}/${meta.value.path}/${language}/title.json`;
    const { input, translatedText, n_edits } = (await (
      await fetch(url)
    ).json()) as _Caption;

    /** map raw format to format needed for app */
    title.value = {
      reviewed: false,
      reviews: n_edits || 0,
      startingTranslation: translatedText,
      currentTranslation: translatedText,
      startingOriginal: input,
      currentOriginal: input,
    };
  } catch (error) {
    console.error("Couldn't load title data");
    title.value = null;
  }

  /** load description */
  try {
    const url = `${base}/${meta.value.path}/${language}/description.json`;
    const data = (await (await fetch(url)).json()) as _Caption[];

    /** map raw format to format needed for app */
    description.value = data.map(({ input, translatedText, n_edits }) => ({
      reviewed: false,
      reviews: n_edits || 0,
      startingTranslation: translatedText,
      currentTranslation: translatedText,
      startingOriginal: input,
      currentOriginal: input,
    }));
  } catch (error) {
    console.error("Couldn't load description data");
    description.value = [];
  }

  /** load captions */
  try {
    const url = `${base}/${meta.value.path}/${language}/sentence_translations.json`;
    const data = (await (await fetch(url)).json()) as _Caption[];

    /** map raw format to format needed for app */
    captions.value = data.map(({ input, translatedText, n_edits }) => ({
      reviews: n_edits || 0,
      reviewed: false,
      startingTranslation: translatedText,
      currentTranslation: translatedText,
      startingOriginal: input,
      currentOriginal: input,
    }));
  } catch (error) {
    console.error("Couldn't load caption data");
    captions.value = [];
  }

  /** load caption timings */
  try {
    const url = `${base}/${meta.value.path}/english/sentence_timings.json`;
    const data = (await (await fetch(url)).json()) as [
      string,
      number,
      number,
    ][];

    /** map raw format to format needed for app */
    data.forEach(
      ([, start, end], index) =>
        (captions.value[index]!.timeRange = [start, end]),
    );
  } catch (error) {
    console.error("Couldn't load caption timings");
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
  original: (caption) => caption.reviews === 0,
  human: (caption) => caption.reviews > 0,
  my: (caption) =>
    caption.currentTranslation !== caption.startingTranslation ||
    caption.currentOriginal !== caption.startingOriginal,
};

/** whether header/footer are sticky */
export const sticky = proxy({ value: true });

/** lesson metadata */
export const meta = proxy<{ value: (typeof lessonMeta)[number] | null }>({
  value: null,
});

/** video id */
export const video = proxy({ value: "" });

/** lesson title */
export const title = proxy<{ value: Caption | null }>({ value: null });

/** lesson description */
export const description = proxy<{ value: Caption[] }>({ value: [] });

/** caption data */
export type Caption = {
  /** number of reviews (upvotes/edits) */
  reviews: number;
  /** reviewed state */
  reviewed: boolean;
  /** starting translation state */
  startingTranslation: string;
  /** translation edit state */
  currentTranslation: string;
  /** starting original english state  */
  startingOriginal: string;
  /** original english edit state */
  currentOriginal: string;
  /** timestamp range */
  timeRange?: [number, number];
};

/** caption, but deeply readonly (when using snapshot) */
export type ReadonlyCaption = ReturnType<typeof useSnapshot<Caption>>;

/** editable captions state */
export const captions = proxy<{ value: Caption[] }>({ value: [] });

/** clean data for export */
export function exportData() {
  /** map entries back to raw format */
  function revert({
    reviews,
    reviewed,
    currentTranslation,
    currentOriginal,
  }: Caption): _Caption {
    return {
      translatedText: currentTranslation,
      input: currentOriginal,
      n_edits: reviews + Number(reviewed),
    };
  }

  return {
    title: title.value ? revert(title.value) : {},
    description: description.value.map(revert),
    sentence_translations: captions.value.map(revert),
  };
}

import { LoaderFunction } from "react-router";
import { proxy, useSnapshot } from "valtio";
import Footer from "@/pages/edit/Footer";
import Header from "@/pages/edit/Header";
import Sentences from "@/pages/edit/Sentences";

/** video edit page */
function Edit() {
  return (
    <>
      <Header />
      <main>
        <Sentences />
      </main>
      <Footer />
    </>
  );
}

export default Edit;

/** sentence format on github */
type _Sentence = {
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
    console.error("Couldn't load sentence data");
  }

  /** add to base url */
  base += `/${language}`;

  /** load title */
  try {
    const url = `${base}/title.json`;
    const { input, translatedText } = (await (
      await fetch(url)
    ).json()) as _Sentence;

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
    const data = (await (await fetch(url)).json()) as _Sentence[];

    /** map raw format to format needed for app */
    description.value = data.map(({ input, translatedText }) => ({
      original: input,
      editHistory: [{ text: translatedText }],
      currentEdit: null,
    }));
  } catch (error) {
    console.error("Couldn't load description data");
  }

  /** load sentences */
  try {
    const url = `${base}/sentence_translations.json`;
    const data = (await (await fetch(url)).json()) as _Sentence[];

    /** map raw format to format needed for app */
    sentences.value = data.map(({ input, translatedText, time_range }) => ({
      original: input,
      editHistory: [{ text: translatedText }],
      timeRange: time_range || [0, 0],
      currentEdit: null,
    }));
  } catch (error) {
    console.error("Couldn't load sentence data");
  }

  return null;
};

/** filter options */
export const filters = [
  { id: "all", label: "All" },
  { id: "original", label: "Original AI-generated" },
  { id: "human", label: "Human-edited" },
  { id: "my", label: "My edits" },
  // "Heavily edited sentences",
  // "Recently edited sentences",
] as const;

/** filter option id enum */
type Filter = (typeof filters)[number]["id"];

/** selected filter id */
export const filter = proxy<{ value: Filter }>({
  value: "all",
});

/** take in a sentence and return whether it should be kept */
type FilterFunc = (value: ReadonlySentence) => boolean;

/** filter function for each filter option */
export const filterFuncs: Record<Filter, FilterFunc> = {
  all: () => true,
  original: (sentence) => sentence.editHistory.length === 1,
  human: (sentence) => sentence.editHistory.length > 1,
  my: (sentence) => sentence.currentEdit !== null,
};

/** whether header/footer are sticky */
export const sticky = proxy({ value: true });

/** video id */
export const id = proxy({ value: "" });

/** video title */
export const title = proxy<{ value: Omit<Sentence, "timeRange"> | null }>({
  value: null,
});

/** video description */
export const description = proxy<{
  value: Omit<Sentence, "timeRange">[];
}>({
  value: [],
});

/** sentence data */
export type Sentence = {
  timeRange: [number, number];
  currentEdit: string | null;
  editHistory: { text: string }[];
  original: string;
};

/** sentence, but deeply readonly (when using snapshot) */
type ReadonlySentence = ReturnType<typeof useSnapshot<Sentence>>;

/** editable sentences state */
export const sentences = proxy<{ value: Sentence[] }>({ value: [] });

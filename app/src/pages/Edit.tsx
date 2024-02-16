import { proxy, useSnapshot } from "valtio";
import Footer from "@/pages/edit/Footer";
import Header from "@/pages/edit/Header";
import Segments from "@/pages/edit/Segments";

export const filters = [
  { id: "all", label: "All" },
  { id: "original", label: "Original AI-generated" },
  { id: "human", label: "Human-edited" },
  { id: "my", label: "My edits" },
  // "Heavily edited segments",
  // "Recently edited segments",
] as const;

type Filter = (typeof filters)[number]["id"];

export const filter = proxy<{ value: Filter }>({
  value: "all",
});

type FilterFunc = (value: ReadonlySegment) => boolean;

export const filterFuncs: Record<Filter, FilterFunc> = {
  all: () => true,
  original: (segment) => segment.editHistory.length === 1,
  human: (segment) => segment.editHistory.length > 1,
  my: (segment) => segment.currentEdit !== null,
};

export const sticky = proxy({ value: true });

type Segment = {
  timeRange: [number, number];
  currentEdit: string | null;
  editHistory: { text: string }[];
  original: string;
};

type ReadonlySegment = ReturnType<typeof useSnapshot<Segment>>;

export const segments = proxy<Segment[]>(
  Array(20)
    .fill({})
    .map((_, index, array) => {
      const length = 25;
      const width = 0.5 / array.length;
      const mid = (index + 1) / (array.length - 2);
      return {
        timeRange: [length * (mid - width), length * (mid + width)],
        currentEdit: null,
        editHistory: [
          { text: "Lorem ipsum dolor sit amet" },
          { text: "Lorem ipsum dolor sit" },
          { text: "Lorem ipsum dolor" },
          { text: "Lorem ipsum" },
          { text: "Lorem" },
        ].slice(0, Math.floor(Math.random() * 5)),
        original:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      };
    }),
);

function Edit() {
  return (
    <>
      <Header />
      <main>
        <Segments />
      </main>
      <Footer />
    </>
  );
}

export default Edit;

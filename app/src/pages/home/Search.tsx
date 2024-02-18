import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { sortBy, startCase } from "lodash";
import { useDebounce } from "use-debounce";
import Input from "@/components/Input";
import Select from "@/components/Select";
import lessonCompletion from "@/data/lesson-completion.json";
import lessonMeta from "@/data/lesson-meta.json";
import Badge from "@/pages/home/Badge";
import classes from "./Search.module.css";

type Slug = keyof typeof lessonCompletion;
type Language = keyof (typeof lessonCompletion)[Slug];

/** flatten lesson languages */
const flatLessonMeta = lessonMeta
  .map(({ slug, name, topic, languages }) =>
    languages.map((language) => ({
      slug,
      name,
      topic,
      language,
      completion: lessonCompletion[slug as Slug][language as Language] || 0,
    })),
  )
  .flat();

/** result count options */
const countOptions = [
  { id: "10", label: "Top 10" },
  { id: "50", label: "Top 50" },
  { id: "100", label: "Top 100" },
  { id: "Infinity", label: "All" },
] as const;

function Search() {
  /** local state */
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [count, setCount] = useState<(typeof countOptions)[number]["id"]>("10");

  /** filtered search results */
  let results = useMemo(() => {
    /** split search text into separate terms */
    const terms = debouncedSearch.toLowerCase().split(/\s+/);

    return sortBy(
      flatLessonMeta.filter(({ slug, name, topic, language }) => {
        /** combined string to search */
        const combined = [slug, name, topic, language].join(" ");

        /** if every term is present in combined string */
        return terms.every((term) => combined.includes(term));
      }),
      /** sort lowest completion % first */
      "completion",
    );
  }, [debouncedSearch]);

  /** don't show results if nothing searched */
  if (!search) results = [];

  return (
    <section>
      <h2>Find a Video</h2>

      {/* input controls */}
      <div className={classes.controls}>
        <Input
          value={search}
          onChange={setSearch}
          placeholder="Search video/language/topic"
        />

        <Select
          label="Results"
          options={countOptions}
          value={count}
          onChange={setCount}
        />
      </div>

      {/* results */}
      <div className={classes.results}>
        {results
          .slice(0, Number(count))
          .map(({ name, slug, language, completion }, index) => (
            <Badge key={index} completion={completion}>
              <Link to={`/edit/${slug}/${language}`}>
                {name} ({startCase(language)})
              </Link>
            </Badge>
          ))}
      </div>
    </section>
  );
}

export default Search;

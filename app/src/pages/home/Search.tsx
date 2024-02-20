import { useMemo, useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { sortBy, startCase } from "lodash";
import Input from "@/components/Input";
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

function Search() {
  /** local state */
  const [nameSearch, setNameSearch] = useState("");
  const [languageSearch, setLanguageSearch] = useState("");
  const [showAll, setShowAll] = useState(false);

  /** filtered search results */
  const results = useMemo(() => {
    /** split search text into separate terms */
    const nameTerms = nameSearch.toLowerCase().split(/\s+/);

    return sortBy(
      flatLessonMeta.filter(({ slug, name, topic, language }) => {
        /** combined name string to search */
        const combinedName = [slug, name, topic].join(" ").toLowerCase();

        /** if every term is present in combined string */
        return (
          nameTerms.every((term) => combinedName.includes(term)) &&
          language.toLowerCase().includes(languageSearch)
        );
      }),
      /** sort lowest completion % first */
      "completion",
    );
  }, [nameSearch, languageSearch]);

  /** limit results */
  const limit = 10;

  return (
    <section>
      <h2>Find a Video</h2>

      {/* input controls */}
      <div className={classes.controls}>
        <Input
          value={nameSearch}
          onChange={(value) => {
            setNameSearch(value);
            setShowAll(false);
          }}
          placeholder="Search video name or topic"
        />
        <Input
          value={languageSearch}
          onChange={(value) => {
            setLanguageSearch(value);
            setShowAll(false);
          }}
          placeholder="Search language"
        />
      </div>

      {/* results */}
      <div className={classes.results}>
        {(showAll ? results : results.slice(0, limit)).map(
          ({ name, slug, language, completion }, index) => (
            <Badge key={index} completion={completion}>
              <Link to={`/edit/${slug}/${language}`}>
                {name} ({startCase(language)})
              </Link>
            </Badge>
          ),
        )}
      </div>

      <button onClick={() => setShowAll(!showAll)}>
        {showAll ? <FaAngleUp /> : <FaAngleDown />}
        {showAll && results.length > limit ? "Show less" : "Show all results"}
      </button>
    </section>
  );
}

export default Search;

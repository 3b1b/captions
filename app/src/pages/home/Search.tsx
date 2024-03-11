import { useMemo, useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useAtom } from "jotai";
import { startCase } from "lodash";
import Badge from "@/components/Badge";
import Input from "@/components/Input";
import { flatLessons } from "@/data/data";
import { languageSearch, titleSearch, topicSearch } from "@/pages/Home";
import classes from "./Search.module.css";

function Search() {
  /** page state */
  const [getTitleSearch, setTitleSearch] = useAtom(titleSearch);
  const [getTopicSearch, setTopicSearch] = useAtom(topicSearch);
  const [getLanguageSearch, setLanguageSearch] = useAtom(languageSearch);
  const [showAll, setShowAll] = useState(false);

  /** filtered search results */
  const results = useMemo(() => {
    /** split search text into separate terms */
    const nameTerms = getTitleSearch.toLowerCase().split(/\s+/);
    const topicSearch = getTopicSearch.toLowerCase();
    const languageSearch = getLanguageSearch.toLowerCase();

    /** filter by search terms */
    const filtered = flatLessons.filter(
      ({ lesson, title, topic, language }) =>
        nameTerms.every(
          (term) =>
            title.toLowerCase().includes(term) ||
            lesson.toLowerCase().includes(term),
        ) &&
        (topic === "" || topic.toLowerCase().includes(topicSearch)) &&
        language.toLowerCase().includes(languageSearch),
    );

    return filtered;
  }, [getTitleSearch, getTopicSearch, getLanguageSearch]);

  /** limit results */
  const limit = 10;

  /** slice results */
  let slice = Infinity;
  if (!showAll) slice = limit;
  if (!getTitleSearch && !getTopicSearch && !getLanguageSearch) slice = 0;

  return (
    <section>
      <h2>Find a Video</h2>

      {/* input controls */}
      <div className={classes.controls}>
        <Input
          value={getTitleSearch}
          onChange={(value) => setTitleSearch(value)}
          placeholder="Search lesson title"
        />
        <Input
          value={getTopicSearch}
          onChange={(value) => setTopicSearch(value)}
          placeholder="Search topic"
        />
        <Input
          value={getLanguageSearch}
          onChange={(value) => setLanguageSearch(value)}
          placeholder="Search language"
        />
      </div>

      {/* results */}
      <div className={classes.results}>
        {results
          .slice(0, slice)
          .map(({ lesson, title, language, completion }, index) => (
            <div key={index} className={classes.result}>
              <Badge completion={completion} />
              <Link to={`/edit/${lesson}/${language}`}>
                {title} ({startCase(language)})
              </Link>
            </div>
          ))}
      </div>

      {!!slice && results.length > limit && (
        <button onClick={() => setShowAll(!showAll)}>
          {showAll ? <FaAngleUp /> : <FaAngleDown />}
          {showAll ? "Show less" : "Show all"}
        </button>
      )}
    </section>
  );
}

export default Search;

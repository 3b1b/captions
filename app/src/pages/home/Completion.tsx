import { CSSProperties, Fragment } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { startCase } from "lodash";
import { repoFull } from "@/api";
import { setAtom } from "@/App";
import Badge from "@/components/Badge";
import { completion } from "@/data/data";
import languages from "@/data/languages.json";
import topics from "@/data/topics.json";
import { languageSearch, topicSearch } from "@/pages/Home";
import { glow, scrollIntoView } from "@/util/dom";
import classes from "./Completion.module.css";

/** grid of completions */
function Completion() {
  return (
    <section>
      <h2>Completion</h2>

      <p className="narrow">
        <strong>A high-level overview of what we need help with</strong>.
        Measured as a % of lines that have been reviewed or edited, fall within
        a certain length, and{" "}
        <Link
          to={`${repoFull}?tab=readme-ov-file#3blue1brown-captions`}
          target="_blank"
        >
          meet other requirements
        </Link>
        .
      </p>

      <div
        className={classes.grid}
        style={
          {
            "--rows": topics.length,
            "--cols": languages.length,
          } as CSSProperties
        }
      >
        {/* bg to cover sticky labels */}
        <div className={classes["col-cover"]} />
        <div className={classes["row-cover"]} />

        {/* language col label */}
        {languages.map((language, index) => (
          <div
            key={index}
            className={classes.language}
            style={{ gridRow: "1", gridColumn: index + 1 + 1 }}
          >
            <div>{startCase(language)}</div>
          </div>
        ))}

        {/* topic rows */}
        {topics.map((topic, index) => (
          <Fragment key={index}>
            {/* topic row header */}
            <div
              className={classNames(
                classes.topic,
                topic === "total" && classes.bold,
              )}
              style={{ gridRow: index + 1 + 1, gridColumn: "1" }}
            >
              {startCase(topic)}
            </div>

            {/* cells */}
            {languages.map((language, index) => (
              <button
                key={index}
                onClick={() => {
                  setAtom(topicSearch, topic === "total" ? "" : topic);
                  setAtom(languageSearch, startCase(language));
                  const search = document.querySelector("main > section");
                  scrollIntoView(search);
                  glow(search);
                }}
              >
                <Badge
                  className={classes.cell}
                  completion={
                    topic === "total"
                      ? completion[language]?.total || 0
                      : completion[language]?.[topic]?.total || 0
                  }
                />
              </button>
            ))}
          </Fragment>
        ))}
      </div>
    </section>
  );
}

export default Completion;

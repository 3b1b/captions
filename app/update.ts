import { readFileSync, writeFileSync } from "fs";
import { globSync } from "glob";
import { mapValues } from "lodash";
import { parse } from "yaml";

/** get folder paths */
const paths = globSync("**/**/", {
  ignore: ["app/**", ".github/**"],
  cwd: "../",
})
  .map((path) => {
    /** split props from path */
    const [, year, slug, language] =
      path
        .replace("/shorts", "")
        .match(/(\d\d\d\d)\/([A-Za-z0-9-]+)\/([A-Za-z0-9-]+)/) || [];

    return {
      /** path, minus language */
      full: path.split("/").slice(0, -1).join("/"),
      year,
      slug,
      language,
    };
  })
  /** remove irrelevant paths */
  .filter(
    ({ year, slug, language }) =>
      year && slug && language && language !== "english",
  );

/** get topic lists */
type Topics = { name: string; lessons: string[] }[];
const topicsUrl =
  "https://raw.githubusercontent.com/3b1b/3Blue1Brown.com/main/data/topics.yaml";
const topics: Topics = parse(await (await fetch(topicsUrl)).text());

/** add any lessons with no matching topic to miscellaneous topic */
const misc = topics.find((topic) => topic.name === "Miscellaneous")!;
for (const { slug } of paths)
  if (!topics.find((topic) => topic.lessons.includes(slug)))
    misc.lessons.push(slug);

type Lesson = {
  path: string;
  slug: string;
  name: string;
  languages: string[];
  topic: string;
  previousLesson?: string;
  nextLesson?: string;
};

/** complete list of lessons */
const lessons: Record<string, Lesson> = {};

/** tally of completions */
const lessonCompletion: Record<string, Record<string, number>> = {};
const languageCompletion: Record<string, number[]> = {};

/** init basic info */
for (const { full, slug, language } of paths) {
  /** unique id for lesson */
  const id = full;

  /** cross-ref topic */
  const topic = topics.find((topic) => topic.lessons.includes(slug))!;

  /** init entry */
  lessons[id] ??= {
    path: full,
    slug,
    name: slug,
    languages: [],
    topic: topic.name,
  };

  /** add language */
  lessons[id].languages.push(language);

  /** get full lesson name */
  if (lessons[id].name === slug) {
    const titleFile = `../${full}/${language}/title.json`;
    try {
      lessons[id].name = JSON.parse(
        readFileSync(titleFile, { encoding: "utf8" }),
      )?.input;
    } catch (error) {
      //
    }
  }

  /** find next/prev lessons */
  const index = topic.lessons.indexOf(slug);
  if (index - 1 >= 0) lessons[id].previousLesson = topic.lessons[index - 1];
  if (index + 1 < topic.lessons.length)
    lessons[id].nextLesson = topic.lessons[index + 1];

  /** get caption translation data */
  let translation: { n_reviews: number }[] = [];
  try {
    const captionsFile = `../${full}/${language}/sentence_translations.json`;
    translation = JSON.parse(readFileSync(captionsFile, { encoding: "utf8" }));
  } catch (error) {
    console.warn(`No completion info for ${full}/${language}`);
  }

  /** get completion % from number of lines reviewed by human */
  const completion =
    translation.filter((entry) => entry.n_reviews > 0).length /
    (translation.length || 1);

  /** tally completion */
  lessonCompletion[slug] ??= {};
  lessonCompletion[slug][language] ??= completion;
  languageCompletion[language] ??= [];
  languageCompletion[language].push(completion);
}

/** write files */
writeFile("src/data/lesson-meta.json", Object.values(lessons));
writeFile("src/data/lesson-completion.json", lessonCompletion);
writeFile(
  "src/data/language-completion.json",
  mapValues(languageCompletion, average),
);

function average(array) {
  return array.reduce((total, value) => total + value, 0) / array.length;
}

function writeFile(filename, data) {
  writeFileSync(filename, JSON.stringify(data));
}

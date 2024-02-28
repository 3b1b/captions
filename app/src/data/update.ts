import { globSync } from "glob";
import { clamp, sortBy, uniq } from "lodash";
import { parse } from "yaml";
import { websiteRaw } from "@/api";
import { calcCompletion, convert } from "@/data/data";
import { _Entry, _Title, _Topic, Completion, Lesson, Path } from "@/data/types";
import { average, readFile, writeFile } from "@/data/util";

/** get folder paths */
let paths = globSync("**/**/", {
  ignore: ["app/**", ".github/**"],
  cwd: "../",
})
  .map((path): Path => {
    /** split props from path */
    const [, year = "", lesson = "", language = ""] =
      path
        .replace("/shorts", "")
        .match(/(\d\d\d\d)\/([A-Za-z0-9-]+)\/([A-Za-z0-9-]+)/) || [];

    return {
      /** path, minus language */
      full: path.split("/").slice(0, -1).join("/"),
      year,
      lesson,
      language,
    };
  })
  /** remove irrelevant paths */
  .filter(
    ({ year, lesson, language }) =>
      year && lesson && language && language !== "english",
  );

/** get topic lists */
const topicsUrl = `${websiteRaw}/main/data/topics.yaml`;
const topics: _Topic[] = parse(await (await fetch(topicsUrl)).text());

/** get all languages */
const languageList = uniq(paths.map(({ language }) => language)).sort();

/** get all topics */
const topicList = uniq(topics.map(({ name }) => name));

/** add any lessons with no matching topic to miscellaneous topic */
const misc = topics.find((topic) => topic.name === "Miscellaneous")!;
for (const { lesson } of paths)
  if (!topics.find((topic) => topic.lessons.includes(lesson)))
    misc.lessons.push(lesson);

/** sort paths in order that lessons appear in topics listing */
const lessonOrder = uniq(topics.map(({ lessons }) => lessons).flat());
paths = sortBy(paths, [({ lesson }) => lessonOrder.indexOf(lesson)]);

/** complete list of lessons */
const lessons: Record<string, Lesson> = {};

/** tally of completions */
const completion: Completion = {};

/** init completions */
for (const language of languageList)
  for (const { name: topic, lessons } of topics)
    for (const lesson of lessons) {
      completion[language] ??= {};
      completion[language]![topic] ??= {};
      completion[language]![topic]![lesson] = 0;
    }

for (const { full, lesson, language } of paths) {
  /** cross-ref topic */
  const topic = topics.find((topic) => topic.lessons.includes(lesson))!;

  /** init entry */
  const newLesson: Lesson = {
    path: full,
    lesson,
    title: lesson,
    topic: topic.name,
  };

  /** get full lesson name */
  if (newLesson.title === lesson) {
    const titleFile = `../${full}/${language}/title.json`;
    newLesson.title = readFile<_Title>(titleFile)?.input || lesson || "";
  }

  /** find next/prev lessons */
  const index = topic.lessons.indexOf(lesson);
  if (index - 1 >= 0) newLesson.previousLesson = topic.lessons[index - 1];
  if (index + 1 < topic.lessons.length)
    newLesson.nextLesson = topic.lessons[index + 1];

  /** get completion */
  const translation =
    readFile<_Entry[]>(`../${full}/${language}/sentence_translations.json`) ||
    [];
  const percent = calcCompletion(translation.map(convert), language);
  completion[language]![topic.name]![lesson] = clamp(percent, 0, 1);

  /** add lesson to list */
  lessons[full] = newLesson;
}

/** calc totals */
for (const language of languageList) {
  completion[language]!.total = average(
    Object.values(completion[language]!)
      .map((topic) => Object.values(topic))
      .flat(),
  );
  for (const topic of topicList)
    completion[language]![topic]!.total = average(
      Object.values(completion[language]![topic]!),
    );
}

/** write files */
writeFile("src/data/languages.json", languageList);
writeFile("src/data/topics.json", ["total", ...topicList]);
writeFile("src/data/lessons.json", Object.values(lessons));
writeFile("src/data/completion.json", completion);

import charsPerSecData from "@/data/avg_char_per_sec.json";
import completionData from "@/data/completion.json";
import languages from "@/data/languages.json";
import lessons from "@/data/lessons.json";
import { _Entry, Completion, Entry } from "@/data/types";
import { filterFuncs } from "@/pages/Edit";

/** completion data */
export const completion = completionData as unknown as Completion;

/** flat/expanded lesson+languages */
export const flatLessons = lessons
  .map(({ lesson, topic, ...rest }) =>
    languages.map((language) => ({
      lesson,
      topic,
      language,
      completion: completion[language]?.[topic]?.[lesson] || 0,
      ...rest,
    })),
  )
  .flat();

/** convert "raw" format to format needed for app */
export function convert(entry: _Entry): Entry {
  return {
    reviews: entry.n_reviews || 0,
    upvoted: false,
    startingTranslation: entry.translatedText,
    currentTranslation: entry.translatedText,
    startingOriginal: entry.input,
    currentOriginal: entry.input,
    legacyTranslation: entry.from_community_srt,
  };
}

/** revert format needed for app back to "raw" format */
export function revert(entry: Entry): _Entry {
  const edited = filterFuncs.my(entry);
  return {
    translatedText: entry.currentTranslation,
    input: entry.currentOriginal,
    n_reviews: edited ? 1 : entry.reviews + Number(entry.upvoted),
  };
}

/** get chars per sec for language */
export function charsPerSec(language: string) {
  const data: Record<string, number> = charsPerSecData;
  const perSec =
    data[language] ||
    /** fallback to max avg */
    Math.max(...Object.values(charsPerSec));
  /** allow for some variance around avg */
  return perSec * 1.2;
}

/** get max length for entry translation text */
export function translationMax(
  { startingTranslation, startingOriginal, timeRange }: Entry,
  language: string,
) {
  const [start = 0, end = 0] = timeRange || [];
  /** for entries with time range, i.e. captions */
  if (start && end) return charsPerSec(language) * (end - start);
  /** for entries without a time range, i.e. title and description */ else
    return (
      startingTranslation.length * 1.5 ||
      startingOriginal.length * 2 ||
      Infinity
    );
}

/** get max length for entry original text */
export function originalMax({ startingOriginal }: Entry) {
  return startingOriginal.length * 1.2 || Infinity;
}

/** is entry complete */
export function isComplete(entry: Entry, language: string) {
  const goodLength =
    entry.currentTranslation.length < translationMax(entry, language) &&
    entry.currentOriginal.length < originalMax(entry);

  const reviewed = entry.reviews > 0 || filterFuncs.my(entry);

  return goodLength && reviewed;
}

/** completion % from list of entries */
export function calcCompletion(entries: Entry[], language: string) {
  return (
    entries.filter((entry) => isComplete(entry, language)).length /
    (entries.length || Infinity)
  );
}

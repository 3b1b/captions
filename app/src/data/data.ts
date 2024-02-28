import charsPerSecData from "@/data/avg_char_per_sec.json";
import completionData from "@/data/completion.json";
import languages from "@/data/languages.json";
import lessons from "@/data/lessons.json";
import { _Entry, Completion, Entry } from "@/data/types";

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
    startingOriginal: entry.input,
    currentOriginal: entry.input,
    startingTranslation: entry.translatedText,
    currentTranslation: entry.translatedText,
    model: entry.model || undefined,
    legacyTranslation: entry.from_community_srt,
    reviews: entry.n_reviews || 0,
    upvoted: false,
    start: entry.start,
    end: entry.end,
  };
}

/** revert format needed for app back to "raw" format */
export function revert(entry: Entry): _Entry {
  return {
    input: entry.currentOriginal,
    translatedText: entry.currentTranslation,
    ...(entry.model && { model: entry.model }),
    ...(entry.legacyTranslation && {
      from_community_srt: entry.legacyTranslation,
    }),
    n_reviews: isEdited(entry) ? 1 : entry.reviews + Number(entry.upvoted),
    start: entry.start,
    end: entry.end,
  };
}

/** has entry text been edited by user */
export function isEdited(entry: Entry) {
  return (
    entry.currentTranslation !== entry.startingTranslation ||
    entry.currentOriginal !== entry.startingOriginal
  );
}

/** get chars per sec for language */
export function charsPerSec(language: string) {
  const data: Record<string, number> = charsPerSecData;
  const perSec =
    data[language] ||
    /** fallback to max avg */
    Math.max(...Object.values(data));
  return perSec;
}

/** Estimate how many characters would cause an overflow of narration time */
export function maxCharsAllowed(
  language: string,
  start: number,
  end: number,
): number {
  const mult_const: number = 1.05;
  const time_buff: number = 1.0;
  return mult_const * (charsPerSec(language) * (end - start + time_buff));
}

/** get max length for entry translation text */
export function translationMax(
  { startingTranslation, start, end }: Entry,
  language: string,
) {
  /** for entries with time range, i.e. captions */
  if (start && end) return maxCharsAllowed(language, start, end);
  /** for entries without a time range, i.e. title and description */ else
    return startingTranslation.length * 1.5 || Infinity;
}

/** get max length for entry original text */
export function originalMax({ startingOriginal }: Entry) {
  return startingOriginal.length * 1.2 || Infinity;
}

/** is entry complete */
export function isComplete(entry: Entry, language: string) {
  const goodLength =
    entry.currentTranslation.length < translationMax(entry, language);

  const reviewed = entry.reviews > 0 || isEdited(entry) || entry.upvoted;

  return goodLength && reviewed;
}

/** completion % from list of entries */
export function calcCompletion(entries: Entry[], language: string) {
  return (
    entries.filter((entry) => isComplete(entry, language)).length /
    (entries.length || Infinity)
  );
}

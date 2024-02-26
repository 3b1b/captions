/** paths read from repo directory structure */
export type Path = {
  full: string;
  year: string;
  lesson: string;
  language: string;
};

/** lesson with meta, languages listed */
export type Lesson = {
  path: string;
  lesson: string;
  title: string;
  topic: string;
  previousLesson?: string;
  nextLesson?: string;
};

/** raw "topics.yaml" format (3b1b.com) */
export type _Topic = {
  name: string;
  lessons: string[];
};

/** raw title.json format */
export type _Title = {
  input: string;
};

/** raw sentence_timings.json format */
export type _Timings = [string, number, number][];

/** raw sentence_translations.json format */
export type _Entry = {
  input: string;
  translatedText: string;
  time_range?: [number, number];
  n_reviews?: number;
  from_community_srt?: string;
};

/** translation entry (title/description/entry) */
export type Entry = {
  /** number of reviews (upvotes/edits) */
  reviews: number;
  /** upvoted state */
  upvoted: boolean;
  /** starting translation state */
  startingTranslation: string;
  /** translation edit state */
  currentTranslation: string;
  /** starting original english state  */
  startingOriginal: string;
  /** original english edit state */
  currentOriginal: string;
  /** timestamp range */
  timeRange?: [number, number];
  /** old built-in youtube community translation */
  legacyTranslation?: string;
};

/** language/topic/lesson completion format */
export type Completion = {
  [language: string]: {
    [topic: string]: {
      [lesson: string]: number;
    } & { total?: number };
  } & { total?: number };
};

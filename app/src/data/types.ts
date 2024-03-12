/** paths read from repo directory structure */
export type Path = {
  path: string;
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
  model?: string;
  from_community_srt?: string;
  n_reviews: number;
  start: number;
  end: number;
};

/** translation entry (title/description/entry) */
export type Entry = {
  /** starting original english state  */
  startingOriginal: string;
  /** original english edit state */
  currentOriginal: string;
  /** starting translation state */
  startingTranslation: string;
  /** translation edit state */
  currentTranslation: string;
  /** translation model */
  model?: string;
  /** old built-in youtube community translation */
  legacyTranslation?: string;
  /** number of reviews (upvotes/edits) */
  reviews: number;
  /** upvoted state */
  upvoted: boolean;
  /** start time */
  start: number;
  /** end time */
  end: number;
};

/** language/topic/lesson completion format */
export type Completion = {
  [language: string]: {
    [topic: string]: {
      [lesson: string]: number;
    } & { total?: number };
  } & { total?: number };
};

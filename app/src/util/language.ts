/** is language right-to-left */
export function isRtl(language: string) {
  return ["arabic", "hebrew", "persian", "urdu"].includes(language);
}

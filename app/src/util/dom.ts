/** smoothly scroll element into view */
export function scrollIntoView(element?: Element | null) {
  element?.scrollIntoView({
    block: "center",
    behavior: "smooth",
  });
}

/** temporarily glow background */
export function glow(element?: Element | null) {
  element?.animate(
    [{ background: "var(--accent-pale)" }, { background: "transparent" }],
    { duration: 1000 },
  );
}

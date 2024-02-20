/** temporarily glow background */
export function glow(element: Element) {
  element.animate(
    [{ background: "var(--accent-pale)" }, { background: "transparent" }],
    { duration: 1000 },
  );
}

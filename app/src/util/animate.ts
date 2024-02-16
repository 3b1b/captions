/** temporarily glow background */
export function glow(element: Element) {
  element.animate(
    [
      { boxShadow: "inset 0 0 20px var(--accent)" },
      { boxShadow: "inset 0 0 20px transparent" },
    ],
    { duration: 1000 },
  );
}

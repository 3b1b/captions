export function glow(element: Element) {
  element.animate(
    [{ background: "var(--accent-light)" }, { background: "transparent" }],
    {
      duration: 1000,
    },
  );
}

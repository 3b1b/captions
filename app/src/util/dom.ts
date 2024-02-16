import { glow } from "@/util/animate";

/** smoothly scroll element into view */
export function scrollIntoView(element: Element) {
  element.scrollIntoView({
    block: "center",
    behavior: "smooth",
  });
  glow(element);
}

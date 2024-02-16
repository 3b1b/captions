import { glow } from "@/util/animate";

export function scrollIntoView(element: Element) {
  element.scrollIntoView({
    block: "center",
    behavior: "smooth",
  });
  glow(element);
}

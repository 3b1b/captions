import { useEffect } from "react";
import { useSnapshot } from "valtio";
import { playCaption, playerTime } from "@/components/Player";
import { captions, filter, filterFuncs } from "@/pages/Edit";
import Row from "@/pages/edit/Row";
import { scrollIntoView } from "@/util/dom";
import classes from "../Edit.module.css";

/** caption editor rows */
function Captions() {
  /** reactive state */
  const timeSnap = useSnapshot(playerTime);
  const filterSnap = useSnapshot(filter);
  const captionsSnap = useSnapshot(captions, { sync: true });

  /** when user seeks youtube player */
  useEffect(() => {
    /** don't scroll */
    if (preventScroll) {
      preventScroll = false;
      return;
    }

    /** go through caption rows */
    const rows = document.querySelectorAll(`[data-start][data-end]`);
    for (const element of rows) {
      /** get time range */
      const start = Number(element.getAttribute("data-start")) || 0;
      const end = Number(element.getAttribute("data-end")) || 0;

      /** find first row that falls in seeked time range */
      if (timeSnap.value > start && timeSnap.value < end) {
        scrollIntoView(element);
        return;
      }
    }
  }, [timeSnap.value]);

  return (
    <section data-full>
      <h2>Captions</h2>

      <div className={classes.rows}>
        {captionsSnap.value
          .filter(filterFuncs[filterSnap.value])
          .map((caption, index) => (
            <Row
              key={index}
              caption={caption}
              value={captionsSnap.value[index]!.currentEdit || ""}
              onChange={(value) => (captions.value[index]!.currentEdit = value)}
              onFocus={() => {
                preventScroll = true;
                /** seek video to associated time */
                playCaption(caption);
              }}
            />
          ))}
      </div>
    </section>
  );
}

export default Captions;

/** flag for if video seek was triggered by textbox focus instead of from user
 * directly seeking in video player, to prevent unnecessary scroll */
let preventScroll = false;

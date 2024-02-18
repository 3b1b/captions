import YouTube from "react-youtube";
import { proxy } from "valtio";
import type { YouTubePlayer } from "youtube-player/dist/types";
import { ReadonlyCaption } from "@/pages/Edit";
import classes from "./Player.module.css";

type Props = {
  /** youtube video id */
  video: string;
};

/** youtube video player */
function Player({ video }: Props) {
  return (
    <YouTube
      videoId={video}
      onReady={(event) => {
        /** update internal player object */
        player = event.target;
      }}
      onStateChange={(event) => {
        /** when user seeks and releases */
        if (event.data === 1) updatePlayerTime();
      }}
      className={classes.player}
      iframeClassName={classes.iframe}
    />
  );
}

export default Player;

/** internal player object */
let player: YouTubePlayer | null = null;

/** timer to pause playing at end of caption */
let pausetimer = 0;

export function playCaption(caption: ReadonlyCaption) {
  /** get time range */
  const { timeRange } = caption;
  if (!timeRange) return;
  const [start, end] = timeRange;

  /** play from start */
  player?.seekTo(start || 0, true);
  player?.playVideo();

  /** pause after end */
  window.clearTimeout(pausetimer);
  pausetimer = window.setTimeout(
    () => player?.pauseVideo(),
    (end - start) * 1000,
  );
}

/** current play time in seconds */
export const playerTime = proxy({ value: 0 });

/** update play time */
async function updatePlayerTime() {
  playerTime.value = (await player?.getCurrentTime()) || 0;
}

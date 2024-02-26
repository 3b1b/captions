import YouTube from "react-youtube";
import { atom } from "jotai";
import type { YouTubePlayer } from "youtube-player/dist/types";
import { setAtom } from "@/App";
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
      onStateChange={async (event) => {
        /** when user seeks and releases */
        if (event.data === 1) {
          setAtom(time, (await player?.getCurrentTime()) || 0);
          setAtom(playing, true);
        }
        /** when user pauses/stops */
        if (event.data === 0 || event.data === 2) setAtom(playing, false);
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
let pauseTimer = 0;

/** play video for certain time segment */
export function playSegment(start: number, end: number) {
  /** play from start */
  player?.seekTo(start || 0, true);
  player?.playVideo();
  setAtom(playing, true);

  /** pause after end */
  window.clearTimeout(pauseTimer);
  pauseTimer = window.setTimeout(stopVideo, (end - start) * 1000);
}

/** pause/stop video */
export function stopVideo() {
  player?.pauseVideo();
  setAtom(playing, false);
}

/** current play time in seconds */
export const time = atom(0);

/** playing state */
export const playing = atom(false);

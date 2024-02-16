import YouTube from "react-youtube";
import { proxy } from "valtio";
import type { YouTubePlayer } from "youtube-player/dist/types";
import classes from "./Player.module.css";

type Props = { video: string };

function Player({ video }: Props) {
  return (
    <YouTube
      videoId={video}
      onReady={(event) => (player = event.target)}
      onStateChange={(event) => {
        if (event.data === 1) updatePlayerTime();
      }}
      className={classes.player}
      iframeClassName={classes.iframe}
    />
  );
}

export default Player;

let player: YouTubePlayer | null = null;

let stopTimer = 0;

export function playSentence(start = 0, end = 0) {
  player?.seekTo(start || 0, true);
  player?.playVideo();
  window.clearTimeout(stopTimer);
  stopTimer = window.setTimeout(
    () => player?.pauseVideo(),
    (end - start) * 1000,
  );
}

export const playerTime = proxy({ value: 0 });

async function updatePlayerTime() {
  playerTime.value = (await player?.getCurrentTime()) || 0;
}

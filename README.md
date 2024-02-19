## 3Blue1Brown captions

This repository contains captions for videos on [3blue1brown](https://www.youtube.com/3blue1brown).
The files of the form year/video-id/language/sentence_translations.json are used to automatically create subtitles, and the goal is to use them to create automatic dubbing as well.
As a proof of concept for the aim here, on [this video](https://youtu.be/cy8r7WSuT1I), click the gear icon, and change the audio track to "Korean", or take a look a [this one](https://youtu.be/YtkIWDE36qU), and try the audio tracks in French, Greman, Hindi or Spanish.

Most of this repo was formed with a script that first used Whisper to transcribe video narration into English with punctuation and then used a translation API to translate that script sentence-by-sentence, recording the timings.
Machine translation is often far from perfect, so I'll only feel comfortable with the final results here if those translations have been looked over by a native speaker.

### How to help

We're figuring out the best way to incorporate community contributions.
If you'd like to help out, it might be best to hold off until a proper system is in place, and note your interest in this [Google form](https://forms.gle/AR8YQPL1USxhM5989), or to join [this discord](https://discord.gg/MSKzxDgTGE).

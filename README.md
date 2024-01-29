## 3Blue1Brown captions

This repository contains captions for videos on [3blue1brown](https://www.youtube.com/3blue1brown).
If you'd like to contribute to any translations or offer a correction to any existing subtitles, pull requests are welcome.

The best way to help is by making edits to the files titled "sentence_translations.json".
You can do this directly in the browser by navigating to the relevant file, for example [here is one](https://github.com/3b1b/captions/blob/main/2023/clt/hindi/sentence_translations.json) for translations of the Central Limit Theorem video into Hindi.
From there, click the pencil icon in the upper right corner to make changes, and those changes can be submitted as a pull request when you're done.

Most of this repo was formed using a script that first used Whisper to transcribe video narration into English with punctuation and then used Google's translation API to translate that script sentence-by-sentence, recording the timings.
These automatic translations could potentially benefit from a native speaker to look it over and ensure it's natural.

Subtitles can be generated automatically from those sentence_translations.json files, and the plan is also to use this data to create automatic dubbings, which is why corrections to those files are most helpful.
As a proof of concept for the aim here, on [this video](https://youtu.be/cy8r7WSuT1I), click the gear icon, and change the audio track to "Korean".
Once a pull request containing edits to one of these translation files has been merged, it will be used to generate new captions that will be uploaded to the relevant video on YouTube.

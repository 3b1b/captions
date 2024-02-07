## 3Blue1Brown captions

This repository contains captions for videos on [3blue1brown](https://www.youtube.com/3blue1brown).
The files of the form year/video-id/language/sentence_translations.json are used to automatically create subtitles, and the goal is to use them to create automatic dubbing as well.
As a proof of concept for the aim here, on [this video](https://youtu.be/cy8r7WSuT1I), click the gear icon, and change the audio track to "Korean".

Most of this repo was formed with a script that first used Whisper to transcribe video narration into English with punctuation and then used a translation API to translate that script sentence-by-sentence, recording the timings.
Machine translation is often far from perfect, so I'll only feel comfortable with the final results here if those translations have been looked over by a native speaker.

### How to help

I'm still figuring out the best way to incorporate community contributions.
If you'd like to help out, it might be best to hold off until a proper system is in place, and note your interest in this [Google form](https://forms.gle/AR8YQPL1USxhM5989).

If you're eager to start and don't mind an imperfect system, there is room to get started by making Pull requests on GitHub.

- Check the existing pull requests to see if anyone has already submitted edits to the translation you're interested in reviewing.
- You also can use [this discord](https://discord.gg/MSKzxDgTGE) for coordination and discussion.
- Navigate to a year/video-id/language that you are interested in reviewing.
- Click on the "sentence_translation.json" file
  - For example [here is one](https://github.com/3b1b/captions/blob/main/2023/clt/hindi/sentence_translations.json) for translations of the Central Limit Theorem video into Hindi.
  - If no such file is available, feel free to add an issue to this repository to request it.
- By clicking "blame", you can see if there have been other contributors to this file, with links to the relevant commits and pull requests.
- By clicking the pencil icon in the upper right, you can offer edits directly in the browser. Opening it in github.dev may offer a nicer experience there.
- You can then submit those edits as a pull request.
  - It's most helpful if the title of the pull request includes the language and video name.
- [Here](https://docs.google.com/spreadsheets/d/1S_1hMnre_Cu3NpabO0ZUDyVm9xyRB6FP1w1r-T1W-7s/edit?usp=sharing) is my extremely imperfect means of recording which files have undergone some form of review.

Once edits to one of the sentence_translations.json files are made, subtitles can be generated automatically, and the plan is also to use this data to create automatic dubbings.
We'll start those experiments with the files that have already received review from native speakers, get some feedback on how the results sound, and iterate from there.

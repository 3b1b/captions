## 3Blue1Brown captions

This repository contains translations for videos on [3blue1brown](https://www.youtube.com/3blue1brown).

These translations are used to create subtitles, and those that have undergone a full review will be used to make automatic dubs. As a proof of concept for auto-dubbing, take a look at [this video](https://youtu.be/cy8r7WSuT1I), click the gear icon, and change the audio track to "Korean", or take a look a [this one](https://youtu.be/YtkIWDE36qU), and try the audio tracks in French, Greman, Hindi or Spanish.

This repo was initially formed using Whisper to transcribe video with timings, and then a first pass for translations was made using either Google Translate or DeepL. Machine translation is often far from perfect, though, so I'll only feel comfortable with the final results here if those translations have been looked over by a native speaker.

We are currently running an early test for an interface to review translations. It remains rough around the edges, but if you'd like to help out, contributions and feedback on the system are both welcome.

### How to help

- Go to [translate.3blue1brown.com](https://translate.3blue1brown.com/).
- Navigate to a particular video and language you would like to edit.
- For each sentence, you can either edit the translation or if it looks good as is, click the thumbs up to indicate it's been reviewed.
    - If a sentence is highlighted in red, it's estimated to be too long to fit within the time constraint. If it's possible to abbreviate it, e.g. by removing unnecessary filler words, it will make the auto-dubbing much smoother.
    - If you see a "legacy translation" below a line, this comes from community contributions back in the days when YouTube allowed people to submit subtitles. The timings often don't align perfectly, but hopefully, they offer helpful suggestions.
- When you've finished with the edits you wanted to make, enter your name, and click submit.

#### What happens after submitting?

A pull request is created on this repository with your changes that will be reviewed. If you're unfamiliar with GitHub and pull requests, don't worry! You don't have to do anything more. If you _are_ familiar with pull requests, another very helpful way to contribute is to look over the ones here in your language and comment with either approval or suggestions.

Once your edits are reviewed and approved, a script will be run to turn it into a subtitle file and upload it to YouTube, giving you attribution in the description for your contribution.

If a video is considered completely reviewed, separate scripts will be run to create the automatic dubbing and upload it to YouTube. _Note, we're still iterating on this, so it may take a little time to work out the kinks._

A video is considered completely reviewed and ready for auto-dubbing if:
- Each translated sentence has been either edited or given a thumbs-up
- Each translated sentence fits within the time that the original English sentence occupies. 

### Principles

- **Bias to what's natural**. Don’t worry about translations being word-for-word reflections of the original. Instead, it’s best to follow the spirit of the original but ensure the result sounds natural and fluent. If an English idiom or turn of phrase doesn't make sense in a given language, don't hesitate to change things completely.
- **Briefer is better**. Because creating an auto-dubbing requires that translations can be spoken in a fixed time interval, to match the original video, the default translation length may often be too long. Feel free to cut out words and phrases that are not essential, or to rephrase them entirely in to capture the spirit of the original in a different way.
- **Informal > formal**. For languages with choices of formality in the second person, or similar grammatical constructs, it's better to stay informal. The feeling should be one of a personal and friendly conversation between 

If you run into problems, or if you want to request the creation of a translation file for a new language on a particular video, feel free to create an [issue on this repository](https://github.com/3b1b/captions/issues).

To discuss other nuances, and to coordinate with your language's community, you can join [this discord](https://discord.gg/MSKzxDgTGE).

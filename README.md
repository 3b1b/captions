## 3Blue1Brown captions

Translations for videos on [3blue1brown](https://www.youtube.com/3blue1brown) are organized here, both for use as subtitles, as well as some experiments with auto-dubbing (see below).
As a first pass, transcripts were translated using either DeepL or Google Translate, but the primary goal of this project is to allow viewers to review and correct these translations.

We are currently running an early test for an interface to review translations. It remains rough around the edges, but if you'd like to help out, contributions and feedback on the system are both welcome. Joint [this discord](https://discord.gg/MSKzxDgTGE) to stay in touch, and coordinate with your own language's community.

### How to help

- Go to [translate.3blue1brown.com](https://translate.3blue1brown.com/).
- Navigate to a particular video and language you would like to edit.
- For each sentence:
    - You can suggest changes by editing it in place.
    - If it sounds natural as-is, please click the thumbs up to indicate that someone fluent in the language approves of it.
    - If a sentence is highlighted in red, it's estimated that the auto-dubbing will be too long to fit within the time constraint. If it's possible to abbreviate it, e.g. by removing unnecessary filler words, it will make the auto-dubbing process much smoother.
    - If you see a "legacy translation" below a line, this comes from community contributions back in the days when YouTube allowed people to submit subtitles. The timings often don't align perfectly, but the hope is that if they are better than the machine translation, copy-pasting them into the appropriate time slots is a relatively quick process.
- The percentage complete indicates how many sentences have either been edited or approved with the thumbs-up and whose expected narration durations don't overflow the allotted time.
- When you've finished with the edits you wanted to make, enter your name (for attribution), and click submit.
- There may be some delay after you hit submit, and when the changes are reviewed and uploaded to YouTube.

### What happens after submitting?

A pull request is created on this repository with your changes that will be reviewed. If you're unfamiliar with GitHub and pull requests, don't worry! You don't have to do anything more. If you _are_ familiar with pull requests, another helpful way to contribute is to look over the ones in your language and comment with either approval or suggestions.

Once your edits are reviewed and approved, a script will be run to turn it into a subtitle file and upload it to YouTube, giving you attribution in the description for your contribution.

### Auto-dubbing

As a proof of concept for the aim here, take a look at [this video](https://youtu.be/cy8r7WSuT1I), click the gear icon, and change the audio track to "Korean", or take a look at [this one](https://youtu.be/kYB8IZa5AuE), and try the audio track in Spanish.

In the coming weeks, we'll be running more experiments for auto-dubbings like this on videos whose translations are considered completely reviewed, in the sense that:
- Each translated sentence has been either edited or given a thumbs-up
- All (or at least most) translated sentence fit within the original English sentence's time, since alternate audio tracks on YouTube must match the original video exactly.

### Principles

- **Bias to what's natural**. Don’t worry about translations being word-for-word reflections of the original. Instead, it’s best to follow the spirit of the original but ensure the result sounds natural and fluent. If an English idiom or turn of phrase doesn't make sense in a given language, don't hesitate to change things completely.
- **Briefer is better**. Because creating an auto-dubbing requires that translations can be spoken in a fixed time interval, to match the original video, the default translation length may often be too long. Feel free to cut out words and phrases that are not essential, or to rephrase them entirely in to capture the spirit of the original in a different way.
- **Informal > formal**. For languages with choices of formality in the second person, or similar grammatical constructs, it's better to stay informal. The feeling should be one of a personal and friendly conversation between 

If you run into problems, or if you want to request the creation of a translation file for a new language on a particular video, feel free to create an [issue on this repository](https://github.com/3b1b/captions/issues).

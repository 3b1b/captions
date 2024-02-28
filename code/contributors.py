import json
import pathlib
import subprocess

paths = pathlib.Path(__file__).parents[1].rglob("video_url.txt")

for path in paths:
    if path.is_file():
        folder = path.parent
        proc = subprocess.run(["git",
                        "shortlog", "--summary", "--numbered", "--", folder],
                       capture_output=True, check=True, shell=False)
        text = proc.stdout.decode("utf-8")
        print(folder)
        contributors = []
        for line in text.split('\n'):
            fields = line.split('\t')
            if len(fields) >= 2:
                contributors.append(fields[1])
        file = folder / "contributors.json"
        contribs_string = json.dumps({'contributors': contributors})
        print(contribs_string)
        file.write_text(contribs_string)

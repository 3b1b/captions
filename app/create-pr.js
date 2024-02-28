/** source for cloud func, not auto-deployed, copy/paste */

const functions = require("@google-cloud/functions-framework");
const { Octokit } = require("octokit");

const auth = process.env.GITHUB_API_KEY;
const owner = "3b1b";
const repo = "captions";

/** endpoint */
functions.http("create-pr", async (request, response) => {
  response.set("Access-Control-Allow-Origin", "*");
  response.set("Access-Control-Allow-Methods", "OPTIONS, POST");
  response.set("Access-Control-Allow-Headers", "Accept, Content-Type");

  if (request.method == "OPTIONS") return response.status(200).send();

  try {
    const pr = await createPr(request.body);
    return response.status(200).json(pr);
  } catch (error) {
    return response.status(400).send(error.message);
  }
});

/** create/update branch, file, pr */
async function createPr(params, debug = false) {
  /** auth with github */
  const octokit = new Octokit({ auth });

  /** get params */
  const { branch, title, body, files = [] } = params || {};

  /** check for missing params */
  const missing = [];
  if (!branch) missing.push("branch");
  if (!title) missing.push("title");
  if (!body) missing.push("body");
  if (!files.length) missing.push("files");
  if (missing.length) throw Error(`Insufficient ${missing.join(", ")}`);

  /** get main branch */
  let main;
  try {
    main = (
      await octokit.rest.git.getRef({
        owner,
        repo,
        ref: "heads/main",
      })
    ).data.object.sha;
  } catch (error) {
    if (debug) console.warn(error);
    throw Error(`Couldn't get main branch: ${error?.response?.data?.message}`);
  }

  /** create new branch */
  try {
    await octokit.rest.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branch}`,
      sha: main,
    });
  } catch (error) {
    if (debug) console.warn(error);
    throw Error(
      `Couldn't create new branch ${branch}: ${error?.response?.data?.message}`,
    );
  }

  /** update files */
  for (const [index, { path, content }] of Object.entries(files)) {
    if (!path || !content) throw Error(`File ${index} insufficient`);

    /** get existing file */
    let existing;
    try {
      existing = (
        await octokit.rest.repos.getContent({
          owner,
          repo,
          branch,
          path,
        })
      ).data.sha;
    } catch (error) {
      if (debug) console.warn(error);
      console.warn(
        `Couldn't get existing file ${path}: ${error?.response?.data?.message}`,
      );
    }

    /** create or update file */
    try {
      await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        branch,
        path,
        message: title,
        content: Buffer.from(
          content.endsWith("\n") ? content : content + "\n",
        ).toString("base64"),
        sha: existing,
      });
    } catch (error) {
      if (debug) console.warn(error);
      throw Error(
        `Couldn't create/update file ${path}: ${error?.response?.data?.message}`,
      );
    }
  }

  let pr;

  /** create pull request */
  try {
    pr = await octokit.rest.pulls.create({
      owner,
      repo,
      base: "main",
      head: branch,
      title,
      body,
    });
  } catch (error) {
    if (debug) console.warn(error);
    throw Error(
      `Couldn't create PR ${branch}: ${error?.response?.data?.message}`,
    );
  }

  /** add label */
  try {
    await octokit.rest.issues.addLabels({
      owner,
      repo,
      issue_number: pr.data.number,
      labels: ["app"],
    });
  } catch (error) {
    if (debug) console.warn(error);
    console.warn(
      `Couldn't add label to PR ${pr?.data?.number}: ${error?.response?.data?.message}`,
    );
  }

  return pr;
}

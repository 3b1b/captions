/** urls for this github repo */

export const repo = "3b1b/captions";
export const repoFull = `https://github.com/${repo}`;
export const repoRaw = `https://raw.githubusercontent.com/${repo}`;
export const website = "https://3blue1brown.com";
export const websiteRaw =
  "https://raw.githubusercontent.com/3b1b/3Blue1Brown.com";
export const cloudFuncBase =
  "https://us-central1-captionsapp-415616.cloudfunctions.net/captions";

/** generic request */
export async function request<T>(
  url: string,
  options: RequestInit = {},
  format: "json" | "text" = "json",
) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw Error(String(response.status));
    return (await (await fetch(url))[format]()) as T;
  } catch (error) {
    console.error(error);
  }
}

/** check for presence of branch */
export async function branchExists(name: string) {
  const url = `https://api.github.com/repos/${repo}/branches/${name}`;
  /** seemingly no credentials needed for just reading/checking */
  try {
    const response = await fetch(url);
    if (!response.ok) throw Error();
    return true;
  } catch (error) {
    return false;
  }
}

/** link to issue with url params */
export function issueLink(title: string, body: string | string[]) {
  const _title = window.encodeURIComponent(title);
  const _body = window.encodeURIComponent([body].flat().join(""));
  return `${repoFull}/issues/new?title=${_title}&body=${_body}&labels=app`;
}

type CreatePR = {
  branch: string;
  title: string;
  body: string;
  files: { path: string; content: unknown }[];
};

/** https://docs.github.com/en/rest/pulls/pulls?apiVersion=2022-11-28#create-a-pull-request */
type PR = {
  data: { html_url: string; number: number };
};

/** create pr */
export async function createPr(params: CreatePR) {
  /** prettify json file contents, match existing indentations */
  for (const file of params.files)
    file.content = JSON.stringify(file.content, null, 1);

  try {
    const url = `${cloudFuncBase}/create-pr`;
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");
    const response = await fetch(url, {
      headers,
      method: "POST",
      body: JSON.stringify(params),
    });

    if (!response.ok) return await response.text();
    else return (await response.json()) as PR;
  } catch (error) {
    console.error(error);
    return "Request or parsing error";
  }
}

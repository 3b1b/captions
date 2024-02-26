/** urls for this github repo */

export const repo = "3b1b/captions";
export const repoFull = `https://github.com/${repo}`;
export const repoRaw = `https://raw.githubusercontent.com/${repo}`;
export const website = "https://3blue1brown.com";
export const websiteRaw =
  "https://raw.githubusercontent.com/3b1b/3Blue1Brown.com";

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
  return true;
  const url = `https://api.github.com/repos/${repo}/branches/${name}`;
  /** seemingly no credentials needed for just reading/checking */
  return !request(url);
}

/** link to issue with url params */
export function issueLink(title: string, body: string | string[]) {
  const _title = window.encodeURIComponent(title);
  const _body = window.encodeURIComponent([body].flat().join(""));
  return `${repoFull}/issues/new?title=${_title}&body=${_body}&labels=app`;
}

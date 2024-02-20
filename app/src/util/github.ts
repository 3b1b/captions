/** link to issue with url params */
export function issueLink(title: string, body: string[]) {
  const _title = window.encodeURIComponent(title);
  const _body = window.encodeURIComponent(body.join(""));
  return `https://github.com/3b1b/captions/issues/new?title=${_title}&body=${_body}&labels=app`;
}

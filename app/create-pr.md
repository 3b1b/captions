Notes for setting up cloud function

1. Create GitHub fine-grained personal access token.
   1. Give it access to only this repo
   1. Give it read/write permissions for "Contents" and "Pull Requests"
1. Create Google Cloud Function
   1. Use minimum ram/cpu/etc. specs
   1. Name function "captions"
   1. Use latest Node.js version
   1. Copy/paste `create-pr.js` into `index.js
   1. Add `"octokit": "^3.0.0"` to `package.json` dependencies
   1. Deploy and make not of full url

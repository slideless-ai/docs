# Contributing to Slideless Documentation

## How to contribute

### Local development

1. Clone this repository
2. Install the Mintlify CLI: `npm i -g mint`
3. Create a branch for your changes
4. Make changes
5. Run `mint dev` and preview at `http://localhost:3000`
6. Run `mint broken-links` to check for broken links
7. Submit a pull request

## Writing guidelines

- **Optimized for agents** — documentation should be readable by both AI agents and humans
- **Use active voice**: "Run the command" not "The command should be run"
- **Address the reader directly**: Use "you" instead of "the user"
- **Keep sentences concise**: One idea per sentence
- **Lead with the goal**: Start instructions with what to accomplish
- **Use consistent terminology**: presentation, share token, share URL, API key — keep names stable across pages
- **Include examples**: Show curl commands with realistic flags and bodies
- **Use tables**: For reference data (request fields, scopes, errors, status codes)
- **No secrets**: Never include real API keys, internal URLs, or credentials

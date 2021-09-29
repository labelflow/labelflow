# Release Process

We use it [release-it](https://github.com/release-it/release-it) to handle our release.

It is automatically ran on the CI when a PR is merged into `main`.

You can run it manually at the root of the repository using `yarn release [ major | minor | patch ]` (by default, the CI only creates patch releases).

1. It update `@labelflow/web` version according to the kind of release you chose
2. It generates a changelog using [auto-changelog](https://github.com/cookpete/auto-changelog)
3. It updates the license to last for 2 years after the date of the merge
4. It commits all those changes
5. It creates a tag with the release version
6. It pushes the commit and the tag
7. It creates a GitHub release associated with the git tag (for this to work you need to provide an env var named: GITHUB_TOKEN)

If you want to add something to the process, the definition of the tasks is done in `typescript/web/.release-it.json` .

## Potential enhancements to plan

- Use another changelog generator (like [github-changelog-generator](https://github.com/github-changelog-generator/github-changelog-generator))
- Decide if the release should be `major`, `minor` or `patch` according to a Github label on the PR?

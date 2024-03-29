#!/usr/bin/env node
import { Octokit } from "@octokit/rest";
import semanticRelease from 'semantic-release';

const GH_USER = 'ybonnefond';
const GH_USER_EMAIL = 'ybonnefond@gmail.com';

const PR_COMMENT_TITLE = '## :rocket: Bump indicator\n\n';
function getPRComment(semanticReleaseResult) {
  if (!semanticReleaseResult) {
    return `Recommended bump for this PR : **\`NO\`** release
There are no relevant changes, so no new version is released.`;
  }
  const { nextRelease } = semanticReleaseResult;

  return `Recommended bump for this PR : **\`${nextRelease.type.toUpperCase()}\`** release
${nextRelease.notes}
`;
}

(async () => {
  const isPR = process.env.GITHUB_EVENT_NAME === 'pull_request';

  let environmentOverrides = {
    GITHUB_REF: process.env.GITHUB_REF.replace(/^\/?refs\/heads\//, ''),
  };
  if (isPR) {
    // Fix an issue on `env-ci`library with GH PR
    environmentOverrides['GITHUB_EVENT_NAME'] = 'push';
    environmentOverrides['GITHUB_REF'] = process.env.GITHUB_HEAD_REF;
  }

  try {
    const result = await semanticRelease(
      {
        // Shareable config
        extends: process.env.USE_LOCAL_EXTENDS
          ? './.releaserc.js'
          : '@bridge/semantic-release-config',
        branches: isPR ? process.env.GITHUB_HEAD_REF : 'master',
        dryRun: isPR,
        ci: !isPR,
      },
      {
        // Pass the variable `MY_ENV_VAR` to semantic-release without having to modify the local `process.env`
        env: {
          ...process.env,
          ...environmentOverrides,
          NPM_TOKEN: process.env.NPM_TOKEN,
          GIT_AUTHOR_NAME: GH_USER,
          GIT_AUTHOR_EMAIL: GH_USER_EMAIL,
          GIT_COMMITTER_NAME: GH_USER,
          GIT_COMMITTER_EMAIL: GH_USER_EMAIL,
        },
      },
    );

    if (isPR) {
      const { default: GH_EVENT } = await import(process.env.GITHUB_EVENT_PATH, {
        assert: {
          type: "json",
        },
      });

      const owner = GH_USER;
      const repo = GH_EVENT.repository.name;
      const issue_number = GH_EVENT.number;
      const body = PR_COMMENT_TITLE + getPRComment(result);

      const octokit = new Octokit({
        auth: process.env.ACTION_GH_TOKEN,
      });

      const comments = await octokit.issues.listComments({
        owner,
        repo,
        issue_number,
      });
      const bridgeReleaseIndicatorComment = comments.data.find(comment =>
        comment.body.startsWith(PR_COMMENT_TITLE),
      );

      if (bridgeReleaseIndicatorComment) {
        await octokit.issues.updateComment({
          owner,
          repo,
          body,
          comment_id: bridgeReleaseIndicatorComment.id,
        });
      } else {
        await octokit.issues.createComment({ owner, repo, issue_number, body });
      }
    }
  } catch (err) {
    console.error('The automated release failed with %O', err);
    process.exit(1);
  }
})();

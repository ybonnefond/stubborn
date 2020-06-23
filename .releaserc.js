'use strict';

// Build release options
let preset = null;
(async () => {
  preset = await require('conventional-changelog-angular');
})();
const commitOptions = {
  preset: 'angular',
  releaseRules: [
    // Import default rules
    ...require('@semantic-release/commit-analyzer/lib/default-release-rules'),
    { type: 'chore', scope: 'deps', release: 'patch' },
  ],
  parserOpts: {
    noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES', 'BREAKING'],
  },
};

let tagFormat = 'v${version}';
let releaseCommitMessage =
  'release: ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}';

// Export semantic-release configuration
const config = {
  branches: 'master',
  tagFormat,
  plugins: [
    ['@semantic-release/commit-analyzer', commitOptions],
    [
      '@semantic-release/release-notes-generator',
      {
        ...commitOptions,
        writerOpts: {
          transform: (commit, context) => {
            let customizeFunction = null;

            // Add a section on CHANGELOG
            if (commit.type === `chore` && commit.scope === `deps`) {
              customizeFunction = tCommit => {
                tCommit.type = `Automatic Dependencies Upgrade`;
                tCommit.scope = '';
                return tCommit;
              };
            }
            if (customizeFunction !== null) {
              // Set type an allowed ones
              const oldType = commit.type;
              commit.type = 'feat';
              // Handled all originals transforms
              commit = preset.writerOpts.transform(commit, context);
              commit.type = oldType;
              return customizeFunction(commit);
            }
            // Call original transform function
            return preset.writerOpts.transform(commit, context);
          },
          commitsSort: ['subject', 'scope'],
        },
      },
    ],
    ['@semantic-release/changelog', {}],
    ['@semantic-release/npm', {}],
    [
      '@semantic-release/git',
      {
        message: releaseCommitMessage,
        assets: [
          'CHANGELOG.md',
          'package.json',
          'package-lock.json',
          'npm-shrinkwrap.json',
        ],
      },
    ],
    [
      '@semantic-release/github',
      {
        assets: [{ path: '.github-assets/**/*' }],
      },
    ],
  ],
};

module.exports = config;

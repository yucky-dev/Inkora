#!/bin/bash
set -e

npm install

if [ -n "$GITHUB_PAT" ]; then
  REMOTE_URL="https://${GITHUB_PAT}@github.com/yucky-dev/Inkora.git"
  GIT_ASKPASS="" git -c credential.helper="" push "$REMOTE_URL" HEAD:main --force
  echo "Successfully pushed to GitHub."
else
  echo "GITHUB_PAT not set — skipping GitHub push."
fi

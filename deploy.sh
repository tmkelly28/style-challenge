#!/usr/bin/env bash

set -e

function cleanup_at_exit {
  # return to your master branch
  git checkout master
  
  # remove the deploy branch
  git branch -D deploy
}
trap cleanup_at_exit EXIT

# checks out a new branch called "deploy". Note that the name "deploy" here isn't magical,
# but it needs to match the name of the branch we specify when we push to our heroku remote.
git checkout -b deploy

# webpack will run in "production mode"
webpack -p

# "force" add the otherwise gitignored build files
git add -f public/bundle.js public/bundle.js.map

# create a commit, even if nothing changed
git commit --allow-empty -m 'Deploying'

# push your local "deploy" branch to the "master" branch on heroku
git push --force heroku deploy:master


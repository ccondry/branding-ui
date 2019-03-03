#!/bin/sh
# this file is meant to be run from cron to update the local git branch with the
# associated upstream branch, then build and install into /var/www/html

# fetch changes from origin
git fetch
# get the number of changes between local and remote (current branch)
CHANGES=$(git rev-list HEAD...@{u} --count)

if [ $CHANGES = "0" ]; then
  echo "git repo is current"
else
  echo "git repo is not current. updating..."
  git pull
  if [ $? -eq 0 ]; then
    echo "running npm install"
    npm i
    if [ $? -eq 0 ]; then
      echo "running npm run build..."
      npm run build
      if [ $? -eq 0 ]; then
        echo "npm build successful"
        #echo "removing old web files"
        #rm -rf /var/www/html/
        echo "copying new web files"
        cp -rf dist/* /var/www/toolbox/pcce/
      else
        echo "npm failed to run build script"
      fi
    else
      echo "failed npm install"
    fi
  else
    echo "failed to pull repo"
    echo "trying to remove package-lock.json and try on next iteration"
    rm package-lock.json
  fi
fi

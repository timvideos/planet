#! /bin/bash

set -e 
set -x

if [ ! -d /tmp/planet-website ]; then
    mkdir -p /tmp/planet-website
fi
cd /tmp/planet-website

# Tell ssh to use the given identity
cat > /tmp/planet-website/ssh <<'EOF'
#!/bin/sh
exec ssh -i ~/.ssh/timvideos-website "$@"
EOF
chmod a+x /tmp/planet-website/ssh
export GIT_SSH=/tmp/planet-website/ssh

if [ ! -d website-source ]; then
  git clone git@github.com:timvideos/planet.git website-source
  cd website-source
else
  cd website-source
fi

git pull
bundle install --path vendor/bundle

# Generate posts from planet.yml
bundle exec planet generate -e html

COMMIT_ID=$(git rev-parse HEAD)

# Run jekyll
bundle exec jekyll build --trace

cd ..

# Commit the generated website to gh-pages
####################################################################
if [ ! -d website ]; then
    git clone --branch gh-pages git@github.com:timvideos/planet.git website
    cd website
else
    cd website
    git pull
fi 

# Remove the old content
rm -rf *

# Get back the README.md file
git checkout README.md

# Copy the site into this directory
cp -R ../website-source/_site/* .

git status

# Make git match the content
git add -A .
git commit -m "Converted https://github.com/timvideos/planet/commit/$COMMIT_ID"

# Push the change
git push origin gh-pages
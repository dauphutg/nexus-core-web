#!/usr/bin/env bash
# Builds ./public for the Cloudflare Worker "nexus-site": ONLY what the public website needs.
# Private (never published): tools/, data/plans/, data/ea-zones.json, build files.
set -euo pipefail
rm -rf public && mkdir -p public
tar --exclude=./public --exclude=./.git --exclude=./tools --exclude=./data/plans --exclude=./data/ea-zones.json \
    --exclude=./build-public.sh --exclude=./wrangler.jsonc --exclude=./template.html --exclude=./CNAME \
    --exclude=./.nojekyll --exclude=./.gitignore --exclude='*.py' --exclude='__pycache__' \
    --exclude=./node_modules --exclude=./package.json --exclude=./package-lock.json \
    -cf - . | tar -xf - -C public
# Safety net: stop the deploy if anything private slipped through.
for p in public/tools public/data/plans public/data/ea-zones.json public/build-public.sh; do
  if [ -e "$p" ]; then echo "LEAK: $p would be published - aborting"; exit 1; fi
done
echo "public/ ready: $(find public -type f | wc -l) files"

#!/bin/bash
set -e

if [ -x `command -v yarn` ]; then
  CMD="yarn --frozen-lockfile"
else
  CMD="npm run"
fi

if [[ ! -d ./node_modules/ ]]; then
  $CMD install
else
  $CMD build
fi

rollup -c rollup.config.demo.js -w

#!/bin/sh
# shellcheck shell=dash

set -e

cd "$(dirname "$0")/../"

if [ -z "$1" ]; then
  echo "Usage: $0 svg_output_dir" >&2
  exit 1
fi

SVG_CONFIG=svgo.yml
SVG_SRC_DIR=node_modules/ionicons/src
SVG_OUTPUT_DIR="$1"
BUILD_DIR=build/

rm -rf "$SVG_OUTPUT_DIR"
mkdir -p "$SVG_OUTPUT_DIR"

./node_modules/.bin/svgo \
  --config="$SVG_CONFIG" \
  -f "$SVG_SRC_DIR" \
  -o "$BUILD_DIR" \
  -q

./bin/svg.js "$BUILD_DIR/*.svg" "$SVG_OUTPUT_DIR"

rm -rf "$BUILD_DIR"

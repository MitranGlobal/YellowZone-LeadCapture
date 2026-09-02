#!/usr/bin/env bash
#
# Removes files from earlier versions of this project.
#
# Needed if you unzipped a release over an older copy, or pulled a branch that
# still has them: unzipping adds and overwrites files but never deletes ones
# that were removed, and the leftovers still import things that no longer
# exist, which fails the build with TS2305 / TS2307.
#
# Works off a whitelist of what this release actually ships, so it stays
# correct no matter which older version you are coming from.
set -euo pipefail
cd "$(dirname "$0")"

COMPONENTS="CtaButton FinalCta Footer Hero MeasureSection Nav ScrollReveals \
SealMedallion StepsSection StickyCta TallyEmbed VimeoPlayer"

LIB="config content"

removed=0

drop() {
  echo "  removing stale file: $1"
  if git ls-files --error-unmatch "$1" >/dev/null 2>&1; then
    git rm -q -f "$1"          # tracked: must leave git too, or CI still builds it
  else
    rm -rf "$1"
  fi
  removed=$((removed + 1))
}

prune() {  # prune <dir> <extension> <whitelist>
  local dir="$1" ext="$2" keep="$3"
  [ -d "$dir" ] || return 0
  for path in "$dir"/*."$ext"; do
    [ -e "$path" ] || continue
    local name
    name="$(basename "$path" ".$ext")"
    case " $keep " in
      *" $name "*) ;;
      *) drop "$path" ;;
    esac
  done
}

prune components tsx "$COMPONENTS"
prune lib ts "$LIB"

# This release is fully static — there are no API routes and no extra type dirs.
[ -d app/api ] && drop app/api
[ -d types ]   && drop types

rm -rf .next

if [ "$removed" -eq 0 ]; then
  echo "No stale files found. Tree is clean."
else
  echo ""
  echo "Removed $removed stale path(s)."
  echo "If any were tracked by git, commit and push the deletions:"
  echo "  git commit -m 'Remove files cut in the Tally migration' && git push"
fi
echo "Now run: npm install && npm run build"

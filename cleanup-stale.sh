#!/usr/bin/env bash
#
# Removes component files from earlier versions of this project.
#
# Needed if you unzipped this release over an older copy: unzipping adds and
# overwrites files but never deletes ones that were removed, and the leftovers
# still import content exports that no longer exist, which fails the build.
#
# This works off a whitelist of the components this release actually ships, so
# it removes anything stale regardless of which older version you came from.
set -euo pipefail
cd "$(dirname "$0")"

KEEP="CtaButton FinalCta Footer Hero MeasureSection Nav ScrollReveals \
SealMedallion StepsSection StickyCta TallyEmbed WistiaPlayer"

removed=0
for file in components/*.tsx; do
  [ -e "$file" ] || continue
  name="$(basename "$file" .tsx)"
  case " $KEEP " in
    *" $name "*) ;;
    *)
      echo "removing stale component: $file"
      if git ls-files --error-unmatch "$file" >/dev/null 2>&1; then
        git rm -q -f "$file"        # tracked: remove from git too, or CI still builds it
      else
        rm -f "$file"
      fi
      removed=$((removed + 1))
      ;;
  esac
done

rm -rf .next

if [ "$removed" -eq 0 ]; then
  echo "No stale components found. Tree is clean."
else
  echo ""
  echo "Removed $removed stale component(s)."
  echo "If these were tracked by git, commit and push the deletions:"
  echo "  git commit -m 'Remove components cut in content trim' && git push"
fi
echo "Now run: npm run build"

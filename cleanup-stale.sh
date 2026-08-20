#!/usr/bin/env bash
# Removes component files that were deleted in the content trim.
# Only needed if you unzipped this release over an older copy of the project —
# unzipping adds and overwrites files, but never deletes ones that went away.
set -e
cd "$(dirname "$0")"
rm -f \
  components/FaqSection.tsx \
  components/FitSection.tsx \
  components/FrameworkSection.tsx \
  components/LedgerSection.tsx \
  components/PathSection.tsx \
  components/ProofSection.tsx \
  components/StandardSection.tsx
rm -rf .next
echo "Stale components removed. Run: npm run build"

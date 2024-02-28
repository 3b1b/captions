eslintArgs=""
prettierArgs="--check"

if [ "$FIX" ]; then
  eslintArgs="--fix"
  prettierArgs="--write"
fi

bun eslint . --ext .tsx,.ts $eslintArgs
bun prettier **/*.{tsx,ts,css,html,md,json,yaml} $prettierArgs --no-error-on-unmatched-pattern

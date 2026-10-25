# Scripts

## Python installation

To run the scripts, you once need to set up a local python virtual environment `scripts/.python/` with the requirements from `scripts/requirements.txt`:

```
cd client/scripts
python -m venv .python
source .python/bin/activate
pip install -r requirements.txt
```

You can then always activate this with `source scripts/.python/bin/activate` and disable
it with `deactivate`.

## Font Subsetting Script

This script creates a subset of the NotoColorEmoji font containing only the glyphs used by lean4monaco.

### Usage

```bash
npm run font:subset
```

This subsets the original font "NotoColorEmoji-Regular.ttf" and creates a subset font
only containing the glyphs specified in the script `scripts/subset-font.sh`.

### Adding New Glyphs

1. Add the glyphs to `subset` in `scripts/subset-font.sh`. Make sure not to include hidden variant-selectors when copy-pasting emojis.
2. Run `npm run font:subset`
3. Commit the updated `src/assets/fonts/NotoColorEmoji-Subset.woff2`

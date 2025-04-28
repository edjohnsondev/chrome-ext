# Becky's daily jokes!

## Installing Locally

1. **Download the ZIP**  
    - Click the green **Code** button → **Download ZIP**  
    - Unzip the archive to a folder on your machine  
2. Open Chrome and navigate to `chrome://extensions/`  
3. Enable **Developer mode** (toggle in the top-right)  
4. Click **Load unpacked**, then select the folder you just unzipped  
5. Open a new tab → your extension will render the clock, date, fact & joke  

## Extension Structure

- **icons/**  
    Contains PNGs in three sizes for Chrome (`16×16`, `48×48`, `128×128`).
- **assets/**  
    - **scss/**  
        - **abstracts/**: `_variables.scss`, `_mixins.scss`, etc.  
        - **base/**: resets, grid, typography (`_base.scss`, `_grid.scss`)  
        - **components/**: per‐component styles (`_search.scss`, `_clock.scss`, `_fact.scss`, …)  
        - `main.scss`: imports all partials  
    - **css/**  
        - `main.css`: compiled from `main.scss`  
- **js/**  
    - `clock.js`: flip-clock animation logic  
    - `main.js`: facts, jokes & gradient background  
- **index.html**  
    The new-tab override page  
- **manifest.json**  
    Chrome extension definition  

## Usage

### SCSS

- Define your color palette, radii, breakpoints in **abstracts/_variables.scss**.  
- Create responsive mixins in **abstracts/_mixins.scss**.  
- Write component styles in **components/** and import them in `main.scss`.  
- Compile with:  
    ```bash
    npm run build:css
    ```  
  or watch changes via:  
    ```bash
    npm run watch:css
    ```

### JavaScript

- **clock.js**  
    - Reads `data-start`/`data-end` on each `.js-clock` dial container  
    - Flips digits every second, cascades minute/hour ticks  
- **main.js**  
    - Fetches random fact from `uselessfacts.jsph.pl`  
    - Fetches dad joke from `icanhazdadjoke.com`  
    - Applies a random pastel gradient background  

## Build & Development

```bash
# Install Sass compiler (if not already)
npm install

# Build CSS once
npm run build:css

# Auto-compile on SCSS changes
npm run watch:css

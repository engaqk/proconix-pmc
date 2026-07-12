const fs = require('fs');
const path = require('path');

// 1. Read HTML file
const html = fs.readFileSync('pre-construction-checklist.html', 'utf8');

// 2. Extract CSS and Body content
const styleStart = html.indexOf('<style>') + 7;
const styleEnd = html.indexOf('</style>');
const rawCss = html.substring(styleStart, styleEnd);

const bodyStart = html.indexOf('<body>') + 6;
const bodyEnd = html.indexOf('</body>');
const rawBody = html.substring(bodyStart, bodyEnd);

// 3. Process CSS to scope it under .diag-page-container
const cssRules = rawCss.split('}');
const scopedCssRules = cssRules.map(rule => {
  const parts = rule.split('{');
  if (parts.length < 2) return rule;
  const selectors = parts[0].split(',');
  const scopedSelectors = selectors.map(sel => {
    const s = sel.trim();
    if (!s) return s;
    if (s.startsWith(':root')) {
      return `.diag-page-container`;
    }
    return `.diag-page-container ${s}`;
  });
  return scopedSelectors.join(', ') + ' {' + parts[1];
});
const scopedCss = scopedCssRules.join('}');

// 4. Process Body HTML to JSX
let jsxBody = rawBody
  .replace(/class=/g, 'className=')
  .replace(/crossorigin/g, 'crossOrigin')
  .replace(/&amp;/g, '&')
  .replace(/&copy;/g, '\u00A9')
  .replace(/<img([^>]+)>/g, (m, p) => {
    if (p.trim().endsWith('/')) return m;
    return `<img ${p.trim()} />`;
  })
  .replace(/<br>/g, '<br />')
  .replace(/<hr>/g, '<hr />');

// 5. Construct JSX return value
const newJsx = `  if (slug === 'pre-construction-checklist') {
    return (
      <div className="diag-page-container">
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: \`
${scopedCss}
        \` }} />
${jsxBody}
      </div>
    );
  }`;

// 6. Read and patch page.tsx
const pagePath = 'src/app/r/[slug]/page.tsx';
let pageContent = fs.readFileSync(pagePath, 'utf8');

const targetStart = pageContent.indexOf("if (slug === 'pre-construction-checklist') {");
if (targetStart === -1) {
  throw new Error("Target checklist start block not found in page.tsx");
}

// Find the end of this block
let braceCount = 0;
let targetEnd = -1;
for (let i = targetStart; i < pageContent.length; i++) {
  if (pageContent[i] === '{') braceCount++;
  if (pageContent[i] === '}') {
    braceCount--;
    if (braceCount === 0) {
      targetEnd = i + 1;
      break;
    }
  }
}

if (targetEnd === -1) {
  throw new Error("Target checklist end block not found in page.tsx");
}

const patchedPageContent = pageContent.substring(0, targetStart) + newJsx + pageContent.substring(targetEnd);
fs.writeFileSync(pagePath, patchedPageContent, 'utf8');
console.log("SUCCESSFULLY PATCHED page.tsx!");

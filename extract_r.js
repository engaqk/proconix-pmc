const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\hasan\\.gemini\\antigravity\\brain\\30ffe45b-cda3-4dbf-93f4-fc662bd83d90\\.system_generated\\logs\\transcript.jsonl';
const fileContent = fs.readFileSync(logPath, 'utf8');
const lines = fileContent.split('\n');

for (const line of lines) {
  if (!line.trim()) continue;
  try {
    const data = JSON.parse(line);
    if (data.source === 'USER_EXPLICIT' && data.type === 'USER_INPUT') {
      const content = data.content;
      const htmlStart = content.indexOf('<!DOCTYPE html>');
      const htmlEnd = content.indexOf('</html>') + 7;
      if (htmlStart !== -1 && htmlEnd !== -1) {
        const html = content.substring(htmlStart, htmlEnd);
        const targetPath = 'd:\\Ta\\ProconixPMC\\proconix-v2\\pre-construction-checklist.html';
        fs.writeFileSync(targetPath, html, 'utf8');
        console.log('SUCCESS: Written HTML to ' + targetPath);
        break;
      }
    }
  } catch (e) {
  }
}

const fs = require('fs');
const fileContent = fs.readFileSync('C:\\Users\\hasan\\.gemini\\antigravity\\brain\\30ffe45b-cda3-4dbf-93f4-fc662bd83d90\\.system_generated\\logs\\transcript.jsonl', 'utf8');
const lines = fileContent.split('\n');
const line62 = JSON.parse(lines[62]);
console.log('Line 62 Content length:', line62.content.length);
console.log('Line 62 Content:', line62.content);

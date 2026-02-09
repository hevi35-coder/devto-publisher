const fs = require('fs');
const path = require('path');

const QUEUE_PATH = path.join(__dirname, 'TOPIC_QUEUE.md');
const content = fs.readFileSync(QUEUE_PATH, 'utf8');

console.log('--- Content Start ---');
console.log(content.substring(0, 500));
console.log('--- Content End ---');

const regex = /\*   \*\*(?!.*\((?:Drafted|Published)\))(.*?)\*\*\s*\n\s+\*\s+\*Rationale\*:\s+(.*?)\s*\n\s+\*\s+\*MandaAct Angle\*:\s+(.*?)\s*\n/;
const match = content.match(regex);

if (match) {
    console.log('✅ Match found!');
    console.log('Title:', match[1]);
} else {
    console.log('❌ No match found.');
}

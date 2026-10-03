const fs = require('fs');
const path = require('path');
const { hourOperativeData } = require('./operative_data.js');

const filePath = path.join(__dirname, '..', 'docs', 'planetary_hours_guide.md');
let content = fs.readFileSync(filePath, 'utf8');

// For each hour key, find the section and append the Operative Works Breakdown before the trailing "---" or next heading
const hourKeys = Object.keys(hourOperativeData);

hourKeys.forEach(key => {
  const op = hourOperativeData[key];
  const block = 
`* **Operative Works Breakdown (Love, Binding, Cleansing, Protection):**
  - ❤️ **Love Work [${op.love.rating}]:** ${op.love.desc}
  - 🔒 **Binding Work [${op.binding.rating}]:** ${op.binding.desc}
  - 🌊 **Cleansing Work [${op.cleansing.rating}]:** ${op.cleansing.desc}
  - 🛡️ **Protection Work [${op.protection.rating}]:** ${op.protection.desc}\n`;

  // Search pattern for heading like "### N-01." or "### D-01."
  const prefix = `### ${key}.`;
  const idx = content.indexOf(prefix);
  if (idx !== -1) {
    // Find the next "---" after this index
    const nextDivider = content.indexOf('\n---', idx);
    if (nextDivider !== -1) {
      // Check if it already has Operative Works Breakdown
      const sub = content.substring(idx, nextDivider);
      if (!sub.includes('Operative Works Breakdown')) {
        content = content.substring(0, nextDivider) + '\n' + block + content.substring(nextDivider);
      }
    } else {
      // If it's the last hour, check for end of file
      const sub = content.substring(idx);
      if (!sub.includes('Operative Works Breakdown')) {
        content = content + '\n' + block;
      }
    }
  }
});

fs.writeFileSync(filePath, content, 'utf8');
console.log("Successfully updated docs/planetary_hours_guide.md with all 24-hour operative works breakdowns.");

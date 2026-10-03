const fs = require('fs');
const path = require('path');
const { occultPlanetarySpheres, generateHourOccultWorks } = require('./hour_occult_impacts.js');

const filePath = path.join(__dirname, '..', 'docs', 'planetary_hours_guide.md');
let content = fs.readFileSync(filePath, 'utf8');

// The 24 hours rulers mapping
const hoursRulers = {
  "N-01": "Mercury", "N-02": "Moon", "N-03": "Saturn", "N-04": "Jupiter",
  "N-05": "Mars", "N-06": "Sun", "N-07": "Venus", "N-08": "Mercury",
  "N-09": "Moon", "N-10": "Saturn", "N-11": "Jupiter", "N-12": "Mars",
  "D-01": "Sun", "D-02": "Venus", "D-03": "Mercury", "D-04": "Moon",
  "D-05": "Saturn", "D-06": "Jupiter", "D-07": "Mars", "D-08": "Sun",
  "D-09": "Venus", "D-10": "Mercury", "D-11": "Moon", "D-12": "Saturn"
};

Object.keys(hoursRulers).forEach(hourId => {
  const ruler = hoursRulers[hourId];
  const occ = occultPlanetarySpheres[ruler];
  const impacts = generateHourOccultWorks(ruler, hourId);

  let occultBlock = `* **Exhaustive Occult Intelligence & 14-Work Operative Matrix:**\n`;
  occultBlock += `  - **Occult Theurgy Sphere:** *${occ.archangel}* (Archangel) • *${occ.intelligence}* (Intel.) & *${occ.spirit}* (Spirit) • *${occ.ruhaniyya}* (Arabic Ruhaniyya) • **Wafq:** *${occ.wafq}* • **Fumigation:** *${occ.incense}*\n`;
  occultBlock += `  - **Pillar I (Jalb / Attraction & Sovereignty):**\n`;
  occultBlock += `    - ❤️ Love Work [${impacts.love.badge} - ${impacts.love.rating}]: ${impacts.love.advice}\n`;
  occultBlock += `    - 💰 Wealth Work [${impacts.wealth.badge} - ${impacts.wealth.rating}]: ${impacts.wealth.advice}\n`;
  occultBlock += `    - 👑 Sovereignty Work [${impacts.sovereignty.badge} - ${impacts.sovereignty.rating}]: ${impacts.sovereignty.advice}\n`;
  occultBlock += `  - **Pillar II (Tahsin / Armor, Purifying & Healing):**\n`;
  occultBlock += `    - 🛡️ Protection Work [${impacts.protection.badge} - ${impacts.protection.rating}]: ${impacts.protection.advice}\n`;
  occultBlock += `    - 🌊 Cleansing Work [${impacts.cleansing.badge} - ${impacts.cleansing.rating}]: ${impacts.cleansing.advice}\n`;
  occultBlock += `    - 🩺 Healing Work [${impacts.healing.badge} - ${impacts.healing.rating}]: ${impacts.healing.advice}\n`;
  occultBlock += `    - 🌫️ Invisibility Work [${impacts.invisibility.badge} - ${impacts.invisibility.rating}]: ${impacts.invisibility.advice}\n`;
  occultBlock += `  - **Pillar III ('Aqd / Binding & Stasis):**\n`;
  occultBlock += `    - 🔒 Binding Work [${impacts.binding.badge} - ${impacts.binding.rating}]: ${impacts.binding.advice}\n`;
  occultBlock += `    - 🕊️ Pacification Work [${impacts.pacification.badge} - ${impacts.pacification.rating}]: ${impacts.pacification.advice}\n`;
  occultBlock += `  - **Pillar IV (Tafriq / Severance & Martial War):**\n`;
  occultBlock += `    - ✂️ Severance Work [${impacts.severance.badge} - ${impacts.severance.rating}]: ${impacts.severance.advice}\n`;
  occultBlock += `    - ⚔️ War Work [${impacts.war.badge} - ${impacts.war.rating}]: ${impacts.war.advice}\n`;
  occultBlock += `    - 🎭 Discord Work [${impacts.discord.badge} - ${impacts.discord.rating}]: ${impacts.discord.advice}\n`;
  occultBlock += `  - **Pillar V (Kashf / Gnosis & Oracles):**\n`;
  occultBlock += `    - 👁️ Knowledge Work [${impacts.knowledge.badge} - ${impacts.knowledge.rating}]: ${impacts.knowledge.advice}\n`;
  occultBlock += `    - 🌙 Dreams Work [${impacts.dreams.badge} - ${impacts.dreams.rating}]: ${impacts.dreams.advice}\n`;

  // Search for old section starting with "* **Operative Works Breakdown" in this hour
  const prefix = `### ${hourId}.`;
  const idxPrefix = content.indexOf(prefix);
  if (idxPrefix !== -1) {
    const nextDivider = content.indexOf('\n---', idxPrefix);
    const endBoundary = nextDivider !== -1 ? nextDivider : content.length;
    const hourSection = content.substring(idxPrefix, endBoundary);

    const oldBlockMarker = `* **Operative Works Breakdown`;
    const idxOldBlock = hourSection.indexOf(oldBlockMarker);
    if (idxOldBlock !== -1) {
      // Replace old block with new exhaustive block
      const before = hourSection.substring(0, idxOldBlock);
      const updatedSection = before + occultBlock;
      content = content.substring(0, idxPrefix) + updatedSection + content.substring(endBoundary);
    } else {
      content = content.substring(0, endBoundary) + '\n' + occultBlock + content.substring(endBoundary);
    }
  }
});

fs.writeFileSync(filePath, content, 'utf8');
console.log("Successfully updated docs/planetary_hours_guide.md with exhaustive 14-occult-type matrix for all 24 hours!");

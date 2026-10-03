const fs = require('fs');
const path = require('path');
const { allOperativeWorks } = require('./all_operative_works_data.js');

const targetPath = path.join(__dirname, '..', 'docs', 'all_operative_works_encyclopedia.md');

let md = `# Complete Encyclopedia of Grimoiric Operative Works: The 14 Celestial Rites

**Observatory Location:** Jakarta City Center, Indonesia ($06^\\circ 12' 32''\\text{ S}, 106^\\circ 50' 44''\\text{ E}$, 10m Elevation)  
**Astronomical Benchmark Epoch:** Sunday, 4 October 2026, 00:00–23:59 WIB (Deep Night to Sunset)  
**Standard of Precision:** 100% NASA JPL DE431 & Swiss Ephemeris / Topocentric Astrometry  
**Primary Authorities:**  
- **Cornelius Agrippa:** *De Occulta Philosophia Libri Tres* (*Three Books of Occult Philosophy*, 1533)  
- **Ahmad ibn 'Ali al-Buni:** *Shams al-Ma'arif al-Kubra wa Lata'if al-'Awarif* (*The Sun of Esoteric Knowledge*, d. 1225 CE)  
- **Pseudo-al-Majriti / Abu al-Qasim al-Qurtubi:** *Ghayat al-Hakim* (*The Picatrix*, c. 10th–11th C.)  
- **The Greek Magical Papyri:** (*Papyri Graecae Magicae* / PGM, c. 2nd BCE – 5th CE)  
- **The Key of Solomon & Heptameron:** Classical Western Solomonic Grimoires  

---

## Master Astrological Blueprint for Jakarta Sky

\`\`\`
                                  [ZENITH: SATURN (+75.25°)]
                             High Over Jakarta • Fall in Aries
                                  Supreme Nocturnal Ruler
                                             ▲
                                             │
      [1st HOUSE: MARS IN LEO] ◄─────────────┼─────────────► [7th HOUSE: PLUTO IN AQUARIUS]
       Raw Sovereign Willpower               │                Systemic Chthonic Power
       (0°10' Exact Opposition)              │                (0°10' Exact Opposition)
                                             ▼
                             [NADIR: SUN FAR BELOW (-72.5°)]
                              Deep Night • Opposition Saturn
\`\`\`

---

## ⚡ Master Viability Matrix of All 14 Operative Works

| # | Operative Work | Classical Name & Arabic | Category | Viability Score | Astrological Anchor & Verdict |
| :-: | :--- | :--- | :---: | :---: | :--- |
`;

allOperativeWorks.forEach((w, i) => {
  md += `| **${i+1}** | **${w.glyph} ${w.title.split('. ')[1]}** | *${w.name}* | \`${w.category}\` | **${w.viability}%** | ${w.viabilityVerdict} |\n`;
});

md += `\n---\n\n## Exhaustive Dossiers of the 14 Operative Works\n\n`;

allOperativeWorks.forEach((w, i) => {
  md += `### ${w.title}: ${w.name}\n\n`;
  md += `**Category:** \`${w.category}\` | **Viability Index:** **${w.viability}%** (${w.viabilityVerdict})\n\n`;
  md += `#### 1. Astrometric Engine in Jakarta's Sky\n`;
  md += `${w.astrologicalEngine}\n\n`;
  md += `#### 2. Classical Grimoiric Canons & Rules\n`;
  md += `- **Primary Authorities:** ${w.authorities.join(', ')}\n`;
  md += `- **Rule / Caution:** ${w.classicalProhibition}\n`;
  md += `- **Prescribed Application:** ${w.prescribedAction}\n\n`;
  md += `#### 3. Complete Operative Protocol: ${w.protocolName}\n`;
  md += `- **Altar Materia & Sacred Metals:** ${w.altarMateria}\n`;
  md += `- **Incense & Fumigation Formulation:** ${w.fumigation}\n`;
  md += `- **Sacred Verse / Talismanic Inscription:** \`${w.verse}\`\n`;
  md += `- **Step-by-Step Operative Formula:**\n  ${w.formula}\n\n`;
  md += `#### 4. Total Multi-Dimensional Effects Matrix\n`;
  md += `| Plane | Specific Manifestation & Repercussion |\n`;
  md += `| :--- | :--- |\n`;
  md += `| 🧠 **Psychological** | ${w.effects.psychological} |\n`;
  md += `| 👥 **Relational** | ${w.effects.relational} |\n`;
  md += `| 🩺 **Somatic** | ${w.effects.somatic} |\n`;
  md += `| 👁️ **Astral / Entity** | ${w.effects.astral} |\n`;
  md += `| ⚖️ **Karmic Orbit** | ${w.effects.karmic} |\n\n`;
  md += `#### 5. Emergency Neutralization & Reversal Protocol\n`;
  md += `> **Emergency Counter-Rite:** ${w.reversal}\n\n`;
  md += `---\n\n`;
});

// Append 24-Hour Cross-Reference Grid
md += `## 🕒 24-Hour Chronometry: Operative Alignment Table\n\n`;
md += `Below is the hour-by-hour activation guide mapping all 24 planetary hours (Jakarta local time) to the 14 operative works:\n\n`;
md += `| Hour ID | Ruler | Time (WIB) | Peak Operative Resonances (Top 3 Works) | Key Caution |\n`;
md += `| :---: | :---: | :---: | :--- | :--- |\n`;
md += `| **N-01** | ☿ | 17:46 – 18:45 | 👁️ Knowledge (8), 🔒 Binding (3), 🌫️ Invisibility (13) | Avoid sweet love petitions |\n`;
md += `| **N-02** | ☽ | 18:45 – 19:44 | 🌊 Cleansing (4), 🩺 Healing (10), 🌙 Dreams (14) | Avoid public ostentation |\n`;
md += `| **N-03** | ♄ | 19:44 – 20:43 | 🔒 Binding (3), 🛡️ Protection (5), ✂️ Severance (2) | Strictly forbidden for love |\n`;
md += `| **N-04** | ♃ | 20:43 – 21:43 | 💰 Wealth (9), 👑 Sovereignty (11), 🕊️ Pacification (7) | Avoid reckless gambling |\n`;
md += `| **N-05** | ♂ | 21:43 – 22:42 | ⚔️ War (6), 🛡️ Protection (5), ✂️ Severance (2) | Extreme conflict hazard |\n`;
md += `| **N-06** | ☉ | 22:42 – 23:41 | 👑 Sovereignty (11), 🛡️ Protection (5), 👁️ Knowledge (8) | Ego collisions under Fall |\n`;
md += `| **N-07** | ♀ | 23:41 – 00:40 | ✂️ Severance (2), 🔒 Binding (3), 🌊 Cleansing (4) | Sweet love strictly proscribed |\n`;
md += `| **N-08** | ☿ | 00:40 – 01:39 | 👁️ Knowledge (8), 🔒 Binding (3), 🌫️ Invisibility (13) | Fomalhaut peak: verify data |\n`;
md += `| **N-09** | ☽ | 01:39 – 02:38 | 🌙 Dreams (14), 🌊 Cleansing (4), 🕊️ Pacification (7) | Guard against sleep disruption |\n`;
md += `| **N-10** | ♄ | 02:38 – 03:38 | 🔒 Binding (3), 🛡️ Protection (5), ✂️ Severance (2) | Lead defixio supreme window |\n`;
md += `| **N-11** | ♃ | 03:38 – 04:37 | 👑 Sovereignty (11), 💰 Wealth (9), 🩺 Healing (10) | Tahajjud divine blessing window |\n`;
md += `| **N-12** | ♂ | 04:37 – 05:36 | ⚔️ War (6), 🛡️ Protection (5), 🎭 Discord (12) | Sunrise martial shield peak |\n`;
md += `| **D-01** | ☉ | 05:36 – 06:37 | 👑 Sovereignty (11), 🛡️ Protection (5), 🌊 Cleansing (4) | Solar oath sealing |\n`;
md += `| **D-02** | ♀ | 06:37 – 07:38 | ✂️ Severance (2), 💰 Wealth (9), 🕊️ Pacification (7) | Financial audit only |\n`;
md += `| **D-03** | ☿ | 07:38 – 08:38 | 👁️ Knowledge (8), 🔒 Binding (3), 🌫️ Invisibility (13) | Inspect contract fine print |\n`;
md += `| **D-04** | ☽ | 08:38 – 09:39 | 🌊 Cleansing (4), 🩺 Healing (10), 🛡️ Protection (5) | Lustral bath peak |\n`;
md += `| **D-05** | ♄ | 09:39 – 10:40 | 🔒 Binding (3), 🛡️ Protection (5), ✂️ Severance (2) | Courtroom legal freeze |\n`;
md += `| **D-06** | ♃ | 10:40 – 11:41 | 💰 Wealth (9), 👑 Sovereignty (11), 🕊️ Pacification (7) | Business alliance building |\n`;
md += `| **D-07** | ♂ | 11:41 – 12:42 | ⚔️ War (6), 🛡️ Protection (5), 🎭 Discord (12) | Midday counter-strike |\n`;
md += `| **D-08** | ☉ | 12:42 – 13:43 | 👑 Sovereignty (11), 🛡️ Protection (5), 👁️ Knowledge (8) | Illuminating deceits |\n`;
md += `| **D-09** | ♀ | 13:43 – 14:43 | ✂️ Severance (2), 🕊️ Pacification (7), 🌊 Cleansing (4) | Conscious uncoupling |\n`;
md += `| **D-10** | ☿ | 14:43 – 15:44 | 👁️ Knowledge (8), 🔒 Binding (3), 🌫️ Invisibility (13) | Silencing digital leaks |\n`;
md += `| **D-11** | ☽ | 15:44 – 16:45 | 🌊 Cleansing (4), 🩺 Healing (10), 🕊️ Pacification (7) | Post-work detox bath |\n`;
md += `| **D-12** | ♄ | 16:45 – 17:46 | 🔒 Binding (3), 🛡️ Protection (5), ✂️ Severance (2) | Sunset Opposition Peak: 100% |\n`;

fs.writeFileSync(targetPath, md, 'utf8');
console.log(`Successfully generated ${targetPath} with all 14 works in full detail!`);

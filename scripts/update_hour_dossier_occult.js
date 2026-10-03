const fs = require('fs');
const path = require('path');
const { occultPlanetarySpheres, generateHourOccultWorks } = require('./hour_occult_impacts.js');

const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Target the former 4-box operative row: lines 308-406
const startTarget = `<!-- ==================== REAL-TIME 4 OPERATIVE WORKS IMPACT ROW ==================== -->`;
const endTarget = `        </div>
      </div>

    </div>
  </section>`;

const idxStart = html.indexOf(startTarget);
const idxEnd = html.indexOf(endTarget);

if (idxStart === -1 || idxEnd === -1) {
  console.error("Could not find operative impact row markers in index.html");
  process.exit(1);
}

// Generate the 14 cards for N-08 (Mercury, default active hour)
const defaultRuler = "Mercury";
const defaultOccult = occultPlanetarySpheres[defaultRuler];
const defaultImpacts = generateHourOccultWorks(defaultRuler, "N-08");

const workKeys = Object.keys(defaultImpacts);
let defaultCardsHTML = '';

workKeys.forEach(k => {
  const item = defaultImpacts[k];
  defaultCardsHTML += `
              <!-- OCCULT WORK CARD: ${item.id.toUpperCase()} -->
              <div id="hour-op-${item.id}" class="hour-occult-card p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/90 flex flex-col justify-between hover:border-slate-600 transition-all duration-200" data-cat="${item.category}">
                <div>
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="font-bold text-slate-200 flex items-center gap-1.5 text-xs">
                      <span>${item.glyph}</span> <span id="hour-op-title-${item.id}">${item.name}</span>
                    </span>
                    <span id="hour-op-badge-${item.id}" class="px-2 py-0.5 rounded text-[10px] font-bold font-mono" style="background-color: ${item.badgeColor}22; color: ${item.badgeColor}; border: 1px solid ${item.badgeColor}55;">
                      ${item.badge} (${item.rating})
                    </span>
                  </div>

                  <div class="space-y-1 mt-2 text-[11px] font-mono">
                    <div class="text-slate-400">
                      <span class="text-amber-400/90 font-semibold">Astrometric Anchor:</span> <span id="hour-op-mech-${item.id}" class="text-slate-300 font-sans">${item.mechanics}</span>
                    </div>
                    <div class="text-slate-400 mt-1">
                      <span class="text-emerald-400/90 font-semibold">Occult Directive:</span> <span id="hour-op-adv-${item.id}" class="text-slate-200 font-sans">${item.advice}</span>
                    </div>
                  </div>
                </div>

                <div class="mt-3 pt-2 border-t border-slate-800/70 text-[10px] text-slate-500 flex items-center justify-between font-mono">
                  <span id="hour-op-cat-${item.id}" class="px-1.5 py-0.2 rounded bg-slate-950 text-slate-400 border border-slate-800">${item.category}</span>
                  <a href="#work-card-${item.id}" class="text-amber-400 hover:text-white font-bold transition flex items-center gap-1">
                    <span>Full Protocol</span> <span>→</span>
                  </a>
                </div>
              </div>`;
});

// Build the complete new REAL-TIME 14-OCCULT-TYPE OPERATIVE IMPACT PANEL HTML
const newOccultPanelHTML = `<!-- ==================== REAL-TIME EXHAUSTIVE 14-OCCULT-TYPE OPERATIVE WORKS IMPACT MATRIX ==================== -->
          <div class="mt-6 pt-6 border-t border-slate-800">
            
            <!-- Section Header & Occult Mode Banner -->
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-amber-400 text-lg font-bold">⚡</span>
                  <h4 class="text-sm sm:text-base font-bold font-cinzel text-white tracking-wide">
                    REAL-TIME OPERATIVE WORKS IMPACT MATRIX (ALL 14 OCCULT TYPES)
                  </h4>
                </div>
                <p class="text-xs text-slate-400 font-mono mt-0.5">
                  Detailed Astrological & Grimoiric Repercussions for this Specific Planetary Hour across Agrippa, Shams al-Ma'arif, Picatrix & PGM
                </p>
              </div>

              <div class="flex items-center gap-2 text-xs font-mono">
                <a href="#operativeWorksConsole" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition flex items-center gap-1.5">
                  <span>📜</span> <span>14-Work Master Console</span> <span class="text-xs">↓</span>
                </a>
              </div>
            </div>

            <!-- Occult Planetary Sphere & Theurgy Intelligence Banner -->
            <div class="p-4 rounded-2xl bg-slate-950/90 border border-slate-800/80 mb-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
              <div class="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span class="text-slate-500 block text-[10px] uppercase font-bold">SPHERE & ARCHANGEL</span>
                <span id="hourOccultArchangel" class="text-sky-300 font-bold">${defaultOccult.archangel}</span>
                <span id="hourOccultSphere" class="text-slate-400 block text-[11px]">${defaultOccult.planet}</span>
              </div>

              <div class="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span class="text-slate-500 block text-[10px] uppercase font-bold">AGRIPPAN SPIRIT & INTEL.</span>
                <span id="hourOccultAgrippa" class="text-amber-300 font-bold">${defaultOccult.intelligence} & ${defaultOccult.spirit}</span>
                <span id="hourOccultWafq" class="text-slate-400 block text-[11px]">${defaultOccult.wafq}</span>
              </div>

              <div class="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span class="text-slate-500 block text-[10px] uppercase font-bold">ARABIC RUHANIYYA (SHAMS)</span>
                <span id="hourOccultRuhaniyya" class="text-teal-300 font-bold">${defaultOccult.ruhaniyya}</span>
                <span id="hourOccultMetal" class="text-slate-400 block text-[11px]">Metal: ${defaultOccult.metal}</span>
              </div>

              <div class="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span class="text-slate-500 block text-[10px] uppercase font-bold">SACRED RESINS & INCENSE</span>
                <span id="hourOccultIncense" class="text-emerald-300 font-bold truncate block">${defaultOccult.incense}</span>
                <span id="hourOccultMode" class="text-slate-400 block text-[11px] truncate">${defaultOccult.chthonicMode}</span>
              </div>
            </div>

            <!-- Occult Pillar Filter Lens for this Hour -->
            <div class="flex flex-wrap items-center gap-1.5 mb-4 text-xs font-mono" id="hourOccultFilters">
              <span class="text-slate-400 mr-1 uppercase text-[10px] font-bold">Occult Pillar Filter:</span>
              <button onclick="filterHourOccultCards('all')" class="hour-occult-btn active px-2.5 py-1 rounded-lg border border-sky-500 bg-sky-950 text-sky-200 font-bold" data-cat="all">All 14 Occult Types</button>
              <button onclick="filterHourOccultCards('Jalb')" class="hour-occult-btn px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white" data-cat="Jalb">Jalb: Attraction & Elevation (3)</button>
              <button onclick="filterHourOccultCards('Tahsin')" class="hour-occult-btn px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white" data-cat="Tahsin">Tahsin: Armor & Healing (4)</button>
              <button onclick="filterHourOccultCards('Aqd')" class="hour-occult-btn px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white" data-cat="Aqd">'Aqd: Binding & Stasis (2)</button>
              <button onclick="filterHourOccultCards('Tafriq')" class="hour-occult-btn px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white" data-cat="Tafriq">Tafriq: Severance & War (3)</button>
              <button onclick="filterHourOccultCards('Kashf')" class="hour-occult-btn px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white" data-cat="Kashf">Kashf: Gnosis & Oracles (2)</button>
            </div>

            <!-- Complete 14-Card Occult Grid for Selected Hour -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 text-xs" id="hourOccultGrid">
              ${defaultCardsHTML}
            </div>

          </div>`;

html = html.substring(0, idxStart) + newOccultPanelHTML + '\n\n' + html.substring(idxEnd);
console.log("Replaced 4-card operative row with EXHAUSTIVE 14-OCCULT-TYPE PANEL in index.html!");

// 2. INJECT SCRIPT UPDATES INTO index.html JAVASCRIPT
// Inject occultPlanetarySpheres and generateHourOccultWorks into client JS
const jsInjectMarker = `// Live Clock Engine`;
const idxJsInject = html.indexOf(jsInjectMarker);

if (idxJsInject === -1) {
  console.error("Could not find jsInjectMarker in index.html");
  process.exit(1);
}

const clientOccultModule = `// ==================== MASTER OCCULT PLANETARY METADATA & 14-WORK GENERATOR ====================
    const occultPlanetarySpheres = ${JSON.stringify(occultPlanetarySpheres, null, 4)};

    ${generateHourOccultWorks.toString()}

    let currentHourOccultFilter = 'all';

    function filterHourOccultCards(cat) {
      currentHourOccultFilter = cat;
      document.querySelectorAll('#hourOccultFilters .hour-occult-btn').forEach(btn => {
        if (btn.dataset.cat === cat) {
          btn.className = "hour-occult-btn active px-2.5 py-1 rounded-lg border border-sky-500 bg-sky-950 text-sky-200 font-bold";
        } else {
          btn.className = "hour-occult-btn px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white";
        }
      });

      const cards = document.querySelectorAll('#hourOccultGrid .hour-occult-card');
      cards.forEach(c => {
        if (cat === 'all' || c.dataset.cat === cat) {
          c.style.display = 'flex';
        } else {
          c.style.display = 'none';
        }
      });
    }

    `;

html = html.substring(0, idxJsInject) + clientOccultModule + html.substring(idxJsInject);
console.log("Injected occult theurgy metadata and generator into client JavaScript.");

// 3. UPDATE selectHour() TO UPDATE ALL 14 OCCULT CARDS DYNAMICALLY
// Find selectHour
const selectHourTarget = `// Update Column 4: Grimoiric & Domain
      document.getElementById('hourPrescribed').textContent = data.prescribed;
      document.getElementById('hourAvoid').textContent = data.avoid;
      document.getElementById('hourDomainPeak').textContent = data.domainPeak;`;

const idxSelectHour = html.indexOf(selectHourTarget);

if (idxSelectHour === -1) {
  console.error("Could not find selectHourTarget in index.html");
  process.exit(1);
}

// Find closing of selectHour before const card = document.getElementById('hourDetailDossier');
const selectHourEndTarget = `// Visual flash
      const card = document.getElementById('hourDetailDossier');`;

const idxSelectHourEnd = html.indexOf(selectHourEndTarget, idxSelectHour);

const newSelectHourBody = `// Update Column 4: Grimoiric & Domain
      document.getElementById('hourPrescribed').textContent = data.prescribed;
      document.getElementById('hourAvoid').textContent = data.avoid;
      document.getElementById('hourDomainPeak').textContent = data.domainPeak;

      // Update Theurgy Banner for this hour
      const occSphere = occultPlanetarySpheres[data.ruler] || occultPlanetarySpheres["Mercury"];
      if (document.getElementById('hourOccultArchangel')) {
        document.getElementById('hourOccultArchangel').textContent = occSphere.archangel;
        document.getElementById('hourOccultSphere').textContent = occSphere.planet;
        document.getElementById('hourOccultAgrippa').textContent = \`\${occSphere.intelligence} & \${occSphere.spirit}\`;
        document.getElementById('hourOccultWafq').textContent = occSphere.wafq;
        document.getElementById('hourOccultRuhaniyya').textContent = occSphere.ruhaniyya;
        document.getElementById('hourOccultMetal').textContent = \`Metal: \${occSphere.metal}\`;
        document.getElementById('hourOccultIncense').textContent = occSphere.incense;
        document.getElementById('hourOccultMode').textContent = occSphere.chthonicMode;
      }

      // Update All 14 Occult Types for this hour
      const hourImpacts = generateHourOccultWorks(data.ruler, data.id);
      Object.keys(hourImpacts).forEach(k => {
        const item = hourImpacts[k];
        const badgeEl = document.getElementById(\`hour-op-badge-\${item.id}\`);
        const mechEl = document.getElementById(\`hour-op-mech-\${item.id}\`);
        const advEl = document.getElementById(\`hour-op-adv-\${item.id}\`);
        
        if (badgeEl) {
          badgeEl.textContent = \`\${item.badge} (\${item.rating})\`;
          badgeEl.style.backgroundColor = \`\${item.badgeColor}22\`;
          badgeEl.style.color = item.badgeColor;
          badgeEl.style.border = \`1px solid \${item.badgeColor}55\`;
        }
        if (mechEl) mechEl.textContent = item.mechanics;
        if (advEl) advEl.textContent = item.advice;
      });

      `;

html = html.substring(0, idxSelectHour) + newSelectHourBody + html.substring(idxSelectHourEnd);
console.log("Updated selectHour() to dynamically update all 14 occult type cards and theurgy banner.");

fs.writeFileSync(indexPath, html, 'utf8');
console.log("Successfully wrote all updates to index.html!");

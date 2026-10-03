const fs = require('fs');
const path = require('path');
const { allOperativeWorks } = require('./all_operative_works_data.js');

const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Build the complete HTML for all 14 work cards
let cardsHTML = '';

allOperativeWorks.forEach((w, index) => {
  cardsHTML += `
        <!-- WORK CARD ${index + 1}: ${w.id.toUpperCase()} -->
        <div id="work-card-${w.id}" class="work-full-card bg-slate-950/90 border border-slate-800 rounded-3xl p-6 sm:p-7 glow-card flex flex-col gap-5 transition-all duration-300" data-category="${w.category}">
          
          <!-- Card Header -->
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div class="flex items-center gap-3.5">
              <span class="text-3xl sm:text-4xl p-2.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center">${w.glyph}</span>
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <h3 class="text-lg sm:text-xl font-bold font-cinzel text-white">${w.title}</h3>
                  <span class="text-xs font-mono text-amber-400 font-semibold">${w.name}</span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-sky-300 border border-slate-700">${w.category}</span>
                </div>
                <p class="text-xs font-mono mt-1 font-semibold" style="color: ${w.gaugeColor}">${w.viabilityVerdict}</p>
              </div>
            </div>

            <!-- Viability Gauge -->
            <div class="flex flex-col items-end gap-1.5 font-mono text-xs">
              <span class="text-slate-400 text-[10px] uppercase tracking-wider">ASTRONOMICAL VIABILITY</span>
              <div class="w-44 bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
                <div class="h-full rounded-full transition-all duration-700" style="width: ${w.viability}%; background-color: ${w.gaugeColor};"></div>
              </div>
              <span class="text-slate-200 font-bold">${w.viability}% Potency</span>
            </div>
          </div>

          <!-- Astrometric Engine & Classical Rules Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <span class="text-amber-400 font-bold block mb-1.5 uppercase tracking-wider text-[10px]">Astrometric Engine in Jakarta Sky:</span>
              <p class="text-slate-300 leading-relaxed font-sans text-xs">${w.astrologicalEngine}</p>
            </div>
            <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <span class="text-rose-400 font-bold block mb-1.5 uppercase tracking-wider text-[10px]">Classical Grimoiric Rule & Caution:</span>
              <p class="text-slate-300 leading-relaxed font-sans text-xs">${w.classicalProhibition}</p>
            </div>
          </div>

          <!-- Protocol Box -->
          <div class="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col gap-4 text-xs">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-3 gap-2">
              <span class="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <span class="text-amber-400">📜</span> ${w.protocolName}
              </span>
              <span class="text-[10px] text-slate-400 font-mono">Authorities: ${w.authorities[0]}</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div class="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span class="text-slate-400 block text-[10px] font-bold uppercase mb-1">ALTAR MATERIA & METALS</span>
                <p class="text-slate-200 font-sans">${w.altarMateria}</p>
              </div>
              <div class="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span class="text-slate-400 block text-[10px] font-bold uppercase mb-1">INCENSE & FUMIGATION</span>
                <p class="text-slate-200 font-sans">${w.fumigation}</p>
              </div>
              <div class="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span class="text-slate-400 block text-[10px] font-bold uppercase mb-1">PRESCRIBED APPLICATION</span>
                <p class="text-emerald-400 font-semibold font-sans">${w.prescribedAction}</p>
              </div>
            </div>

            <!-- Sacred Formula & Inscription -->
            <div class="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-col gap-1.5">
              <span class="text-[10px] font-bold text-amber-400 uppercase tracking-wider">SACRED VERSE / TALISMANIC INSCRIPTION:</span>
              <p class="font-mono text-xs text-amber-200 font-semibold">${w.verse}</p>
              <p class="text-xs text-slate-300 leading-relaxed font-sans mt-0.5">${w.formula}</p>
            </div>
          </div>

          <!-- Total 5-Dimensional Effects Grid -->
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2.5 font-mono">
              TOTAL MULTI-DIMENSIONAL EFFECTS MATRIX:
            </span>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 text-xs">
              <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span class="text-amber-400 block font-bold mb-1 text-[11px]">🧠 Psychological</span>
                <p class="text-slate-300 text-[11px] leading-relaxed font-sans">${w.effects.psychological}</p>
              </div>
              <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span class="text-sky-400 block font-bold mb-1 text-[11px]">👥 Relational</span>
                <p class="text-slate-300 text-[11px] leading-relaxed font-sans">${w.effects.relational}</p>
              </div>
              <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span class="text-emerald-400 block font-bold mb-1 text-[11px]">🩺 Somatic</span>
                <p class="text-slate-300 text-[11px] leading-relaxed font-sans">${w.effects.somatic}</p>
              </div>
              <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span class="text-purple-400 block font-bold mb-1 text-[11px]">👁️ Astral / Entity</span>
                <p class="text-slate-300 text-[11px] leading-relaxed font-sans">${w.effects.astral}</p>
              </div>
              <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span class="text-rose-400 block font-bold mb-1 text-[11px]">⚖️ Karmic Orbit</span>
                <p class="text-slate-300 text-[11px] leading-relaxed font-sans">${w.effects.karmic}</p>
              </div>
            </div>
          </div>

          <!-- Emergency Neutralization / Reversal Bar -->
          <div class="p-3 rounded-xl bg-rose-950/20 border border-rose-900/60 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <span class="text-rose-400 font-bold text-sm">⚠️</span>
              <span class="text-rose-200"><strong class="text-rose-300 font-semibold">Emergency Neutralization / Reversal:</strong> ${w.reversal}</span>
            </div>
            <a href="docs/all_operative_works_encyclopedia.md#${w.id}" class="text-rose-300 hover:text-white font-mono text-[11px] underline whitespace-nowrap">View in Encyclopedia →</a>
          </div>

        </div>`;
});

// Build quick jump chips bar for all 14 works
let quickJumpChipsHTML = '';
allOperativeWorks.forEach(w => {
  quickJumpChipsHTML += `
        <button onclick="scrollToWork('${w.id}')" class="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-950 hover:border-amber-500/60 text-slate-200 text-xs font-mono transition flex items-center gap-1.5 shadow-sm">
          <span>${w.glyph}</span> <span class="font-bold">${w.title.split('. ')[1]}</span>
          <span class="text-[10px] text-slate-400">(${w.viability}%)</span>
        </button>`;
});

// Build Tab 5 Operative Pre-rendered list for the right column tab
let tabListHTML = '';
allOperativeWorks.forEach(w => {
  tabListHTML += `
              <div class="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition flex items-center justify-between gap-2" onclick="scrollToWork('${w.id}')">
                <div class="flex items-center gap-2">
                  <span class="text-base">${w.glyph}</span>
                  <div>
                    <span class="font-bold text-slate-200 block text-xs font-cinzel">${w.title}</span>
                    <span class="text-[10px] text-slate-400 font-mono">${w.category} • ${w.viabilityVerdict.split('—')[0]}</span>
                  </div>
                </div>
                <div class="text-right">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold font-mono" style="background-color: ${w.gaugeColor}22; color: ${w.gaugeColor}; border: 1px solid ${w.gaugeColor}55;">
                    ${w.viability}%
                  </span>
                </div>
              </div>`;
});

// Assemble the complete Master Operative Grimoiric Works Section HTML
let fullSectionHTML = `  <!-- ==================== MASTER OPERATIVE GRIMOIRIC WORKS FULL DOSSIER (ALL 14 WORKS SHOWN) ==================== -->
  <section id="operativeWorksConsole" class="max-w-7xl mx-auto px-4 sm:px-6 py-10 border-t border-slate-800/80">
    <div class="flex flex-col gap-8">
      
      <!-- Section Header -->
      <div class="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl glow-card">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div class="flex items-center gap-2.5">
              <span class="text-3xl text-amber-400 font-bold pulse-glow">✦</span>
              <h2 class="text-2xl sm:text-3xl font-bold font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-sky-200">
                ALL 14 GRIMOIRIC OPERATIVE WORKS — EXHAUSTIVE MASTER DOSSIERS
              </h2>
            </div>
            <p class="text-xs sm:text-sm text-slate-400 mt-1 font-mono">
              Complete Astrometric & Grimoiric Protocols for Jakarta: Every single work displayed in verbatim detail under 100% NASA JPL / Swiss Ephemeris astrometry.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2.5">
            <a href="docs/all_operative_works_encyclopedia.md" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition text-xs font-mono font-bold flex items-center gap-2">
              <span>📖</span> <span>14-Work Encyclopedia (.md)</span>
            </a>
          </div>
        </div>

        <!-- Quick Jump Direct Links to All 14 Works -->
        <div class="mt-5">
          <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block mb-2">QUICK JUMP DIRECTORY (CLICK TO SCROLL TO ANY WORK):</span>
          <div class="flex flex-wrap gap-2">
            ${quickJumpChipsHTML}
          </div>
        </div>

        <!-- Category Filter Pills -->
        <div class="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs font-mono" id="opCategoryFilters">
          <span class="text-slate-400 mr-1 uppercase text-[10px] font-bold">Filter By Teleology:</span>
          <button onclick="filterOperativeWorks('all')" class="op-cat-btn active px-3 py-1 rounded-lg border border-sky-500 bg-sky-950 text-sky-200 font-bold" data-cat="all">Show All 14 Works</button>
          <button onclick="filterOperativeWorks('Jalb')" class="op-cat-btn px-3 py-1 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white" data-cat="Jalb">Attraction / Jalb (3)</button>
          <button onclick="filterOperativeWorks('Tahsin')" class="op-cat-btn px-3 py-1 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white" data-cat="Tahsin">Protection & Armor / Tahsin (4)</button>
          <button onclick="filterOperativeWorks('Aqd')" class="op-cat-btn px-3 py-1 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white" data-cat="Aqd">Binding & Stasis / 'Aqd (2)</button>
          <button onclick="filterOperativeWorks('Tafriq')" class="op-cat-btn px-3 py-1 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white" data-cat="Tafriq">Severance & War / Tafriq (3)</button>
          <button onclick="filterOperativeWorks('Kashf')" class="op-cat-btn px-3 py-1 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white" data-cat="Kashf">Revelation & Gnosis / Kashf (2)</button>
        </div>
      </div>

      <!-- Container holding ALL 14 FULL WORKS CARDS -->
      <div class="flex flex-col gap-6" id="allOperativeWorksContainer">
        ${cardsHTML}
      </div>

    </div>
  </section>`;

// Replace operativeWorksConsole section in index.html
const sectionStartTarget = `<section id="operativeWorksConsole"`;
const sectionEndTarget = `  <!-- Footer -->`;

const idxSecStart = html.indexOf(sectionStartTarget);
const idxSecEnd = html.indexOf(sectionEndTarget);

if (idxSecStart === -1 || idxSecEnd === -1) {
  console.error("Could not find section target in index.html");
  process.exit(1);
}

html = html.substring(0, idxSecStart) + fullSectionHTML + '\n\n' + html.substring(idxSecEnd);
console.log("Successfully replaced operativeWorksConsole with ALL 14 PRE-RENDERED WORK CARDS in HTML!");

// Update tabOperativeList in right column tab
const tabOpListTarget = `<div class="space-y-2 max-h-[460px] overflow-y-auto pr-1" id="tabOperativeList">`;
const idxTabList = html.indexOf(tabOpListTarget);

if (idxTabList !== -1) {
  const closeDiv = `</div>\n\n            <div class="mt-4 text-center">`;
  const idxCloseDiv = html.indexOf(closeDiv, idxTabList);
  if (idxCloseDiv !== -1) {
    html = html.substring(0, idxTabList + tabOpListTarget.length) + '\n' + tabListHTML + '\n            ' + html.substring(idxCloseDiv);
    console.log("Successfully pre-rendered all 14 works inside tab-operative in right column!");
  }
}

// Update script with scrollToWork() and filterOperativeWorks()
const scriptFind = `function filterOperativeWorks(cat) {`;
const idxScriptFind = html.indexOf(scriptFind);

if (idxScriptFind !== -1) {
  const scriptEndFind = `let chimeEnabled = false;`;
  const idxScriptEnd = html.indexOf(scriptEndFind, idxScriptFind);
  
  if (idxScriptEnd !== -1) {
    const newFilterScript = `function scrollToWork(workId) {
      const card = document.getElementById(\`work-card-\${workId}\`);
      if (!card) return;
      
      // If currently filtered out, reset filter to 'all'
      filterOperativeWorks('all');
      
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card.classList.add('ring-4', 'ring-amber-400');
      setTimeout(() => card.classList.remove('ring-4', 'ring-amber-400'), 1500);
    }

    function filterOperativeWorks(cat) {
      document.querySelectorAll('#opCategoryFilters .op-cat-btn').forEach(btn => {
        if (btn.dataset.cat === cat) {
          btn.className = "op-cat-btn active px-3 py-1 rounded-lg border border-sky-500 bg-sky-950 text-sky-200 font-bold";
        } else {
          btn.className = "op-cat-btn px-3 py-1 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white";
        }
      });

      const cards = document.querySelectorAll('#allOperativeWorksContainer .work-full-card');
      cards.forEach(c => {
        if (cat === 'all' || c.dataset.category === cat) {
          c.style.display = 'flex';
        } else {
          c.style.display = 'none';
        }
      });
    }

    `;

    html = html.substring(0, idxScriptFind) + newFilterScript + html.substring(idxScriptEnd);
    console.log("Successfully updated JavaScript filter and scrollToWork functions in index.html!");
  }
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log("Finished writing index.html with all 14 detailed cards directly pre-rendered!");

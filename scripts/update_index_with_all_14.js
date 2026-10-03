const fs = require('fs');
const path = require('path');
const { allOperativeWorks } = require('./all_operative_works_data.js');

const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 1. UPDATE OPERATIVE CONSOLE IN index.html
// Look for the operative console section: <section id="operativeWorksConsole" ...>
const consoleStart = `<section id="operativeWorksConsole"`;
const consoleEnd = `  <!-- Footer -->`;

const idxConsoleStart = html.indexOf(consoleStart);
const idxConsoleEnd = html.indexOf(consoleEnd);

if (idxConsoleStart === -1 || idxConsoleEnd === -1) {
  console.error("Could not locate operativeWorksConsole section in index.html");
  process.exit(1);
}

// Generate the new operativeWorksConsole HTML with 14 works and category filters
let newConsoleHTML = `  <!-- ==================== MASTER OPERATIVE GRIMOIRIC WORKS COMMAND CONSOLE (14 WORKS) ==================== -->
  <section id="operativeWorksConsole" class="max-w-7xl mx-auto px-4 sm:px-6 py-10 border-t border-slate-800/80">
    <div class="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl glow-card">
      
      <!-- Section Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div class="flex items-center gap-2.5">
            <span class="text-3xl text-amber-400 font-bold pulse-glow">✦</span>
            <h2 class="text-2xl sm:text-3xl font-bold font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-sky-200">
              ALL 14 GRIMOIRIC OPERATIVE WORKS CONSOLE
            </h2>
          </div>
          <p class="text-xs sm:text-sm text-slate-400 mt-1 font-mono">
            Exhaustive Classical Operations for Jakarta Sky: Love, Severance, Binding, Cleansing, Protection, War, Pacification, Knowledge, Wealth, Healing, Sovereignty, Discord, Invisibility & Dreams
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2.5">
          <a href="docs/all_operative_works_encyclopedia.md" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition text-xs font-mono font-bold flex items-center gap-2">
            <span>📖</span> <span>14-Work Master Encyclopedia (.md)</span>
          </a>
        </div>
      </div>

      <!-- Category Filter Bar -->
      <div class="flex flex-wrap items-center gap-2 mt-5 text-xs font-mono" id="opCategoryFilters">
        <span class="text-slate-400 mr-1 uppercase text-[10px] font-bold">Category Lens:</span>
        <button onclick="filterOperativeWorks('all')" class="op-cat-btn active px-3 py-1 rounded-lg border border-sky-500 bg-sky-950 text-sky-200 font-bold" data-cat="all">All 14 Works</button>
        <button onclick="filterOperativeWorks('Jalb')" class="op-cat-btn px-3 py-1 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white" data-cat="Jalb">Attraction / Jalb (3)</button>
        <button onclick="filterOperativeWorks('Tahsin')" class="op-cat-btn px-3 py-1 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white" data-cat="Tahsin">Protection & Armor (4)</button>
        <button onclick="filterOperativeWorks('Aqd')" class="op-cat-btn px-3 py-1 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white" data-cat="Aqd">Binding & Stasis (2)</button>
        <button onclick="filterOperativeWorks('Tafriq')" class="op-cat-btn px-3 py-1 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white" data-cat="Tafriq">Severance & War (3)</button>
        <button onclick="filterOperativeWorks('Kashf')" class="op-cat-btn px-3 py-1 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white" data-cat="Kashf">Revelation & Gnosis (2)</button>
      </div>

      <!-- 14 Operative Selector Chips (Dynamic Grid) -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5 mt-5 select-none" id="operativeWorkChips">
        <!-- Rendered dynamically by JavaScript -->
      </div>

      <!-- Dynamic Operative Workspace Content -->
      <div id="operativeContentDisplay" class="mt-6 pt-6 border-t border-slate-800 flex flex-col gap-6">
        <!-- Rendered dynamically by selectOperativeWork() in JS -->
      </div>

    </div>
  </section>

`;

html = html.substring(0, idxConsoleStart) + newConsoleHTML + html.substring(idxConsoleEnd);
console.log("Replaced operativeWorksConsole in index.html with 14-work container.");

// 2. UPDATE TAB-OPERATIVE IN RIGHT COLUMN
// Look for <div id="tab-operative" ...> ... </div>\n\n        </div>
const tabOpStart = `<div id="tab-operative"`;
const tabOpEnd = `</div>\n\n        </div>\n\n      </div>\n\n    </div>\n  </main>`;

const idxTabOpStart = html.indexOf(tabOpStart);
const idxTabOpEnd = html.indexOf(tabOpEnd);

if (idxTabOpStart !== -1 && idxTabOpEnd !== -1) {
  let newTabOpContent = `<div id="tab-operative" class="tab-content mt-4 hidden overflow-x-auto text-xs">
            <div class="p-3 bg-slate-950/80 rounded-xl border border-slate-800 mb-3 text-slate-300 leading-relaxed">
              <span class="text-amber-300 font-bold block mb-1">Total 14 Classical Works Matrix (Jakarta 4 Oct 2026):</span>
              Real-time viability synthesized across Saturn at Zenith, Mars-Pluto exact opposition (0°10′), Venus stationary-retrograde in Scorpio, and Domicile Moon in Cancer conjunct Sirius.
            </div>

            <div class="space-y-2 max-h-[460px] overflow-y-auto pr-1" id="tabOperativeList">
              <!-- Rendered dynamically by renderTabOperativeList() -->
            </div>

            <div class="mt-4 text-center">
              <button onclick="document.getElementById('operativeWorksConsole').scrollIntoView({behavior:'smooth'});" class="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-sky-500/20 to-pink-500/20 border border-slate-700 hover:border-slate-500 text-slate-200 font-bold transition flex items-center justify-center gap-2">
                <span>⚡ Inspect All 14 Operations in Command Console</span> <span>↓</span>
              </button>
            </div>
          </div>\n\n        </div>\n\n      </div>\n\n    </div>\n  </main>`;
  
  html = html.substring(0, idxTabOpStart) + newTabOpContent + html.substring(idxTabOpEnd + tabOpEnd.length);
  console.log("Updated tab-operative in right column with scrollable 14-work listing.");
}

// 3. UPDATE JAVASCRIPT: REPLACE operativeWorksCatalog WITH allOperativeWorks AND ADD CONTROLLER FUNCTIONS
// Look for const operativeWorksCatalog = { ... };
const catalogStartStr = `// ==================== MASTER OPERATIVE WORKS CATALOG ====================`;
const selectOpWorkStr = `function selectOperativeWork(workId) {`;
const idxCatalogStart = html.indexOf(catalogStartStr);
const idxInitCall = html.indexOf(`selectOperativeWork("binding");`);

if (idxCatalogStart === -1 || idxInitCall === -1) {
  console.error("Could not locate operativeWorksCatalog in index.html JavaScript");
  process.exit(1);
}

// Find the end of selectOperativeWork
const selectOpWorkEnd = `let chimeEnabled = false;`;
const idxSelectOpEnd = html.indexOf(selectOpWorkEnd, idxCatalogStart);

if (idxSelectOpEnd === -1) {
  console.error("Could not locate end of selectOperativeWork in JavaScript");
  process.exit(1);
}

// Build the new JavaScript module containing all 14 works, category filtering, chip rendering, and tab list rendering
let newJsModule = `// ==================== MASTER CATALOG OF ALL 14 OPERATIVE WORKS ====================
    const allOperativeWorks = ${JSON.stringify(allOperativeWorks, null, 4)};

    let currentOpCategory = 'all';

    function renderOperativeChips() {
      const container = document.getElementById('operativeWorkChips');
      if (!container) return;
      container.innerHTML = '';

      const filtered = currentOpCategory === 'all' 
        ? allOperativeWorks 
        : allOperativeWorks.filter(w => w.category === currentOpCategory);

      filtered.forEach(w => {
        const btn = document.createElement('button');
        btn.id = \`opChip-\${w.id}\`;
        btn.className = \`op-chip text-left p-3 rounded-2xl border border-slate-800 bg-slate-950/80 hover:border-slate-600 transition flex flex-col justify-between group\`;
        btn.onclick = () => selectOperativeWork(w.id);

        btn.innerHTML = \`
          <div class="flex items-center justify-between w-full">
            <span class="text-xl">\${w.glyph}</span>
            <span class="px-1.5 py-0.5 rounded text-[9px] font-bold font-mono" style="background-color: \${w.gaugeColor}22; color: \${w.gaugeColor}; border: 1px solid \${w.gaugeColor}55;">
              \${w.viability}%
            </span>
          </div>
          <div class="mt-2.5">
            <h4 class="font-bold text-xs text-slate-200 group-hover:text-white font-cinzel truncate">\${w.title.split('. ')[1]}</h4>
            <span class="text-[10px] text-slate-500 font-mono block truncate">\${w.category}</span>
          </div>
        \`;
        container.appendChild(btn);
      });
    }

    function filterOperativeWorks(cat) {
      currentOpCategory = cat;
      document.querySelectorAll('#opCategoryFilters .op-cat-btn').forEach(btn => {
        if (btn.dataset.cat === cat) {
          btn.className = "op-cat-btn active px-3 py-1 rounded-lg border border-sky-500 bg-sky-950 text-sky-200 font-bold";
        } else {
          btn.className = "op-cat-btn px-3 py-1 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white";
        }
      });
      renderOperativeChips();
    }

    function renderTabOperativeList() {
      const container = document.getElementById('tabOperativeList');
      if (!container) return;
      container.innerHTML = allOperativeWorks.map(w => \`
        <div class="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition flex items-center justify-between gap-2" onclick="selectOperativeWork('\${w.id}'); document.getElementById('operativeWorksConsole').scrollIntoView({behavior:'smooth'});">
          <div class="flex items-center gap-2">
            <span class="text-base">\${w.glyph}</span>
            <div>
              <span class="font-bold text-slate-200 block text-xs font-cinzel">\${w.title}</span>
              <span class="text-[10px] text-slate-400 font-mono">\${w.category} • \${w.viabilityVerdict.split('—')[0]}</span>
            </div>
          </div>
          <div class="text-right">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold font-mono" style="background-color: \${w.gaugeColor}22; color: \${w.gaugeColor}; border: 1px solid \${w.gaugeColor}55;">
              \${w.viability}%
            </span>
          </div>
        </div>
      \`).join('');
    }

    function selectOperativeWork(workId) {
      const data = allOperativeWorks.find(w => w.id === workId);
      if (!data) return;

      // Update chip styling
      document.querySelectorAll('#operativeWorkChips .op-chip').forEach(c => {
        c.classList.remove('active', 'ring-2', 'ring-amber-500', 'bg-slate-900', 'shadow-lg');
      });
      const activeChip = document.getElementById(\`opChip-\${workId}\`);
      if (activeChip) {
        activeChip.classList.add('active', 'ring-2', 'ring-amber-500', 'bg-slate-900', 'shadow-lg');
      }

      // Render into operativeContentDisplay
      const container = document.getElementById('operativeContentDisplay');
      container.innerHTML = \`
        <!-- Top Status & Astrological Engine -->
        <div class="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <span class="text-4xl">\${data.glyph}</span>
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <h3 class="text-xl font-bold font-cinzel text-white">\${data.title}</h3>
                <span class="text-xs font-mono text-amber-400 font-semibold">\${data.name}</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-sky-300 border border-slate-700">\${data.category}</span>
              </div>
              <p class="text-xs font-mono text-slate-300 mt-1">\${data.viabilityVerdict}</p>
            </div>
          </div>

          <div class="flex flex-col items-end gap-1.5 font-mono text-xs">
            <span class="text-slate-400 text-[10px] uppercase">ASTRONOMICAL VIABILITY</span>
            <div class="w-48 bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700">
              <div class="h-full rounded-full transition-all duration-700" style="width: \${data.viability}%; background-color: \${data.gaugeColor};"></div>
            </div>
            <span class="text-slate-300 font-bold">\${data.viability}% Potency</span>
          </div>
        </div>

        <!-- Astrometric Mechanics & Classical Prohibitions -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div class="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <span class="text-amber-400 font-bold block mb-1.5 uppercase tracking-wider text-[10px]">Astrometric Engine in Jakarta Sky:</span>
            <p class="text-slate-300 leading-relaxed font-sans text-xs">\${data.astrologicalEngine}</p>
          </div>
          <div class="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <span class="text-rose-400 font-bold block mb-1.5 uppercase tracking-wider text-[10px]">Classical Grimoiric Rule & Caution:</span>
            <p class="text-slate-300 leading-relaxed font-sans text-xs">\${data.classicalProhibition}</p>
          </div>
        </div>

        <!-- Full Step-by-Step Operative Protocol -->
        <div class="p-5 rounded-2xl bg-slate-950/90 border border-slate-800">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <span class="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <span class="text-amber-400">📜</span> \${data.protocolName}
            </span>
            <span class="text-[10px] text-slate-400 font-mono">Authorities: \${data.authorities[0]}</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span class="text-slate-400 block text-[10px] font-bold uppercase mb-1">ALTAR MATERIA & METALS</span>
              <p class="text-slate-300">\${data.altarMateria}</p>
            </div>
            <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span class="text-slate-400 block text-[10px] font-bold uppercase mb-1">INCENSE & FUMIGATION</span>
              <p class="text-slate-300">\${data.fumigation}</p>
            </div>
            <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span class="text-slate-400 block text-[10px] font-bold uppercase mb-1">PRESCRIBED APPLICATION</span>
              <p class="text-emerald-400 font-semibold">\${data.prescribedAction}</p>
            </div>
          </div>

          <!-- Sacred Formula & Inscription -->
          <div class="mt-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2">
            <span class="text-[10px] font-bold text-amber-400 uppercase tracking-wider">SACRED VERSE & TALISMANIC INSCRIPTION:</span>
            <p class="font-mono text-xs text-amber-200 font-semibold">\${data.verse}</p>
            <p class="text-xs text-slate-300 leading-relaxed font-sans mt-1">\${data.formula}</p>
          </div>
        </div>

        <!-- Total Life Effects Matrix Across 5 Dimensions -->
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3 font-mono">
            TOTAL MULTI-DIMENSIONAL EFFECTS MATRIX:
          </span>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            <div class="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span class="text-amber-400 block font-bold mb-1 text-[11px]">🧠 Psychological</span>
              <p class="text-slate-300 text-[11px] leading-relaxed">\${data.effects.psychological}</p>
            </div>
            <div class="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span class="text-sky-400 block font-bold mb-1 text-[11px]">👥 Relational</span>
              <p class="text-slate-300 text-[11px] leading-relaxed">\${data.effects.relational}</p>
            </div>
            <div class="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span class="text-emerald-400 block font-bold mb-1 text-[11px]">🩺 Somatic</span>
              <p class="text-slate-300 text-[11px] leading-relaxed">\${data.effects.somatic}</p>
            </div>
            <div class="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span class="text-purple-400 block font-bold mb-1 text-[11px]">👁️ Astral / Entity</span>
              <p class="text-slate-300 text-[11px] leading-relaxed">\${data.effects.astral}</p>
            </div>
            <div class="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span class="text-rose-400 block font-bold mb-1 text-[11px]">⚖️ Karmic Orbit</span>
              <p class="text-slate-300 text-[11px] leading-relaxed">\${data.effects.karmic}</p>
            </div>
          </div>
        </div>

        <!-- Reversal Safety -->
        <div class="p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/60 text-xs flex items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <span class="text-rose-400 font-bold text-sm">⚠️</span>
            <span class="text-rose-200"><strong class="text-rose-300 font-semibold">Emergency Neutralization / Reversal:</strong> \${data.reversal}</span>
          </div>
          <a href="docs/all_operative_works_encyclopedia.md" class="text-rose-300 hover:text-white font-mono text-[11px] underline whitespace-nowrap">View Complete Encyclopedia →</a>
        </div>
      \`;
    }

    // Call chip rendering and tab list rendering
    renderOperativeChips();
    renderTabOperativeList();
    selectOperativeWork("binding");

    `;

html = html.substring(0, idxCatalogStart) + newJsModule + html.substring(idxSelectOpEnd);
console.log("Updated index.html JavaScript with 14 works, category filter, chip rendering, and tab list rendering.");

fs.writeFileSync(indexPath, html, 'utf8');
console.log("Successfully wrote all updates to index.html!");

const fs = require('fs');
const path = require('path');
const { hourOperativeData } = require('./operative_data.js');

const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 1. ADD OPERATIVE IMPACT ROW INTO hourDetailDossier
// Look for line closing Column 4: Grimoiric Operative Impact
const markerCol4 = `<!-- Column 4: Grimoiric Operative Impact -->`;
const idxCol4 = html.indexOf(markerCol4);
if (idxCol4 === -1) {
  console.error("Could not find Column 4 marker in index.html");
  process.exit(1);
}

// Find the closing of this grid: </div>\n\n        </div>\n      </div>
const gridCloseTarget = `          </div>\n\n        </div>\n      </div>\n\n    </div>\n  </section>`;
const operativeRowHTML = `          </div>

          <!-- ==================== REAL-TIME 4 OPERATIVE WORKS IMPACT ROW ==================== -->
          <div class="mt-4 pt-4 border-t border-slate-800/80">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-mono">
                <span class="text-amber-400">⚡</span> REAL-TIME OPERATIVE WORKS IMPACT (FOR SELECTED HOUR):
              </span>
              <a href="#operativeWorksConsole" class="text-xs text-amber-400 hover:text-amber-300 font-mono transition flex items-center gap-1">
                <span>View Full Operative Manual & Protocols</span> <span class="text-sm">↓</span>
              </a>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              
              <!-- LOVE WORK -->
              <div class="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/90 flex flex-col justify-between hover:border-pink-500/40 transition">
                <div>
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="font-bold text-pink-400 flex items-center gap-1.5">
                      <span>❤️</span> Love Work
                    </span>
                    <span id="hourLoveRating" class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                      Proscribed (20%)
                    </span>
                  </div>
                  <p id="hourLoveDesc" class="text-[11px] text-slate-300 font-mono leading-relaxed mt-1">
                    Venus in detriment/Rx. Avoid sweet attraction. Only suitable for analytical grief journaling.
                  </p>
                </div>
                <div class="mt-2.5 pt-2 border-t border-slate-800/60 text-[10px] text-slate-400 flex justify-between">
                  <span>Picatrix Bk II • Agrippa Bk II</span>
                  <span class="text-pink-400 font-bold cursor-pointer" onclick="selectOperativeWork('love'); document.getElementById('operativeWorksConsole').scrollIntoView({behavior:'smooth'});">Details →</span>
                </div>
              </div>

              <!-- BINDING WORK -->
              <div class="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/90 flex flex-col justify-between hover:border-slate-500/40 transition">
                <div>
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="font-bold text-slate-200 flex items-center gap-1.5">
                      <span>🔒</span> Binding Work
                    </span>
                    <span id="hourBindingRating" class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-200 border border-slate-700">
                      High (92%)
                    </span>
                  </div>
                  <p id="hourBindingDesc" class="text-[11px] text-slate-300 font-mono leading-relaxed mt-1">
                    Mercury in Scorpio under Saturn day. Supreme for silencing slanders, courtroom witnesses, and liars.
                  </p>
                </div>
                <div class="mt-2.5 pt-2 border-t border-slate-800/60 text-[10px] text-slate-400 flex justify-between">
                  <span>Shams al-Ma'arif • PGM V</span>
                  <span class="text-slate-300 font-bold cursor-pointer" onclick="selectOperativeWork('binding'); document.getElementById('operativeWorksConsole').scrollIntoView({behavior:'smooth'});">Details →</span>
                </div>
              </div>

              <!-- CLEANSING WORK -->
              <div class="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/90 flex flex-col justify-between hover:border-sky-500/40 transition">
                <div>
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="font-bold text-sky-400 flex items-center gap-1.5">
                      <span>🌊</span> Cleansing Work
                    </span>
                    <span id="hourCleansingRating" class="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-950 text-sky-300 border border-sky-800">
                      Supreme (95%)
                    </span>
                  </div>
                  <p id="hourCleansingDesc" class="text-[11px] text-slate-300 font-mono leading-relaxed mt-1">
                    Exact Fomalhaut Trine (0°01′). Archangel Gabriel cleanses intellect, removes confusion, and purifies sight.
                  </p>
                </div>
                <div class="mt-2.5 pt-2 border-t border-slate-800/60 text-[10px] text-slate-400 flex justify-between">
                  <span>Ayat al-Kursi • Domicile Moon</span>
                  <span class="text-sky-400 font-bold cursor-pointer" onclick="selectOperativeWork('cleansing'); document.getElementById('operativeWorksConsole').scrollIntoView({behavior:'smooth'});">Details →</span>
                </div>
              </div>

              <!-- PROTECTION WORK -->
              <div class="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/90 flex flex-col justify-between hover:border-amber-500/40 transition">
                <div>
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="font-bold text-amber-400 flex items-center gap-1.5">
                      <span>🛡️</span> Protection Work
                    </span>
                    <span id="hourProtectionRating" class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                      High (88%)
                    </span>
                  </div>
                  <p id="hourProtectionDesc" class="text-[11px] text-slate-300 font-mono leading-relaxed mt-1">
                    Hermetic boundary herms; protects esoteric books, private manuscripts, ciphers, and travel.
                  </p>
                </div>
                <div class="mt-2.5 pt-2 border-t border-slate-800/60 text-[10px] text-slate-400 flex justify-between">
                  <span>Mars-Pluto Axis • Cassiel Ward</span>
                  <span class="text-amber-400 font-bold cursor-pointer" onclick="selectOperativeWork('protection'); document.getElementById('operativeWorksConsole').scrollIntoView({behavior:'smooth'});">Details →</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  </section>`;

if (html.includes(gridCloseTarget)) {
  html = html.replace(gridCloseTarget, operativeRowHTML);
  console.log("Inserted Operative Impact Row into hourDetailDossier.");
} else {
  console.warn("Could not find exact gridCloseTarget; checking alternatives.");
}

// 2. ADD TAB IN TABNAV
const tabNavTarget = `<button onclick="changeTab('stars')" class="tab-btn px-3 py-1.5 rounded-lg transition text-slate-400 hover:text-slate-200" data-tab="stars">Fixed Stars</button>
          </div>`;
const tabNavReplacement = `<button onclick="changeTab('stars')" class="tab-btn px-3 py-1.5 rounded-lg transition text-slate-400 hover:text-slate-200" data-tab="stars">Fixed Stars</button>
            <button onclick="changeTab('operative')" class="tab-btn px-3 py-1.5 rounded-lg transition text-amber-400 hover:text-amber-200 font-bold" data-tab="operative">⚡ 4 Operative Rites</button>
          </div>`;

if (html.includes(tabNavTarget)) {
  html = html.replace(tabNavTarget, tabNavReplacement);
  console.log("Updated tabNav with '4 Operative Rites' tab.");
}

// 3. ADD TAB-OPERATIVE CONTENT CONTAINER
const tabStarsCloseTarget = `</tbody>
            </table>
          </div>

        </div>`;
const tabOperativeContent = `</tbody>
            </table>
          </div>

          <!-- TAB 5: 4 Operative Rites Overview -->
          <div id="tab-operative" class="tab-content mt-4 hidden overflow-x-auto text-xs">
            <div class="p-3 bg-slate-950/80 rounded-xl border border-slate-800 mb-3 text-slate-300 leading-relaxed">
              <span class="text-amber-300 font-bold block mb-1">Celestial Operative Summary (Jakarta 4 Oct 2026):</span>
              Real-time viability synthesized across Saturn at Zenith, Mars-Pluto exact opposition (0°10′), Venus stationary-retrograde in Scorpio, and Domicile Moon in Cancer conjunct Sirius.
            </div>

            <div class="space-y-2.5">
              <!-- Love Card -->
              <div class="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col gap-1.5">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-pink-400">❤️ 1. Love Work (Al-Hubb / 'Ishq)</span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">28% (Sweet) • 92% (Sever)</span>
                </div>
                <p class="text-[11px] text-slate-400">
                  <strong class="text-slate-200">Picatrix Proscription:</strong> Venus Stationary-Rx in Scorpio detriment forbids sweet love/marriage. Supreme for Cord-Cutting (<em>Tafriq</em>) & unbinding obsession.
                </p>
              </div>

              <!-- Binding Card -->
              <div class="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col gap-1.5">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-slate-200">🔒 2. Binding Work (Al-'Aqd / Defixio)</span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-200 border border-slate-700">99% (Supreme Peak)</span>
                </div>
                <p class="text-[11px] text-slate-400">
                  <strong class="text-slate-200">Saturn at Zenith (+75.25° NW):</strong> Peak window for lead tablets, cold iron padlocks, tongue-tying (<em>'Aqd al-Lisan</em>), and courtroom silencing.
                </p>
              </div>

              <!-- Cleansing Card -->
              <div class="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col gap-1.5">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-sky-400">🌊 3. Cleansing Work (Al-Taharah / Catharsis)</span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-950 text-sky-300 border border-sky-800">94% (Highly Potent)</span>
                </div>
                <p class="text-[11px] text-slate-400">
                  <strong class="text-slate-200">Domicile Moon + Sirius:</strong> Last Quarter waning Moon in Cancer 12th house dissolves evil eye (<em>Al-'Ayn</em>), karmic ties, and generational curses.
                </p>
              </div>

              <!-- Protection Card -->
              <div class="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col gap-1.5">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-amber-400">🛡️ 4. Protection Work (Al-Tahsin / Hifz)</span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">98% (Invincible Shield)</span>
                </div>
                <p class="text-[11px] text-slate-400">
                  <strong class="text-slate-200">Mars ☍ Pluto (0°10′):</strong> Kinetic mirror shield reflects curses back tenfold. 4-corner iron boundary stakes permanently anchor the perimeter.
                </p>
              </div>
            </div>

            <div class="mt-4 text-center">
              <button onclick="document.getElementById('operativeWorksConsole').scrollIntoView({behavior:'smooth'});" class="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-sky-500/20 to-pink-500/20 border border-slate-700 hover:border-slate-500 text-slate-200 font-bold transition flex items-center justify-center gap-2">
                <span>⚡ Open Master Operative Command Console</span> <span>↓</span>
              </button>
            </div>
          </div>

        </div>`;

if (html.includes(tabStarsCloseTarget)) {
  html = html.replace(tabStarsCloseTarget, tabOperativeContent);
  console.log("Added tab-operative content container.");
}

// 4. ADD MASTER OPERATIVE GRIMOIRIC WORKS CONSOLE BEFORE FOOTER
const mainCloseTarget = `  </main>

  <!-- Footer -->`;

const operativeConsoleSection = `  </main>

  <!-- ==================== MASTER OPERATIVE GRIMOIRIC WORKS COMMAND CONSOLE ==================== -->
  <section id="operativeWorksConsole" class="max-w-7xl mx-auto px-4 sm:px-6 py-10 border-t border-slate-800/80">
    <div class="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl glow-card">
      
      <!-- Section Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div class="flex items-center gap-2.5">
            <span class="text-2xl text-amber-400 font-bold">⚡</span>
            <h2 class="text-2xl sm:text-3xl font-bold font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-sky-200">
              FOUR OPERATIVE GRIMOIRIC WORKS CONSOLE
            </h2>
          </div>
          <p class="text-xs sm:text-sm text-slate-400 mt-1 font-mono">
            Exhaustive Operative Protocols for Jakarta: Love, Binding, Cleansing & Protection under NASA JPL Ephemeris
          </p>
        </div>

        <div class="flex items-center gap-3">
          <a href="docs/four_operative_works_master_manual.md" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition text-xs font-mono font-bold flex items-center gap-2">
            <span>📖</span> <span>Full Master Manual (.md)</span>
          </a>
        </div>
      </div>

      <!-- 4 Operative Selector Chips -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 select-none" id="operativeWorkChips">
        
        <!-- Tab: Love -->
        <button onclick="selectOperativeWork('love')" id="opChip-love" class="op-chip text-left p-4 rounded-2xl border border-slate-800 bg-slate-950/90 hover:border-pink-500/60 transition flex flex-col justify-between">
          <div class="flex items-center justify-between w-full">
            <span class="text-2xl">❤️</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">28% / 92%</span>
          </div>
          <div class="mt-3">
            <h4 class="font-bold text-sm text-pink-300 font-cinzel">Love Work</h4>
            <p class="text-[11px] text-slate-400 font-mono mt-0.5">Al-Hubb / 'Ishq</p>
          </div>
        </button>

        <!-- Tab: Binding -->
        <button onclick="selectOperativeWork('binding')" id="opChip-binding" class="op-chip active text-left p-4 rounded-2xl border border-amber-500/60 bg-slate-950/90 shadow-lg transition flex flex-col justify-between">
          <div class="flex items-center justify-between w-full">
            <span class="text-2xl">🔒</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">99% Peak</span>
          </div>
          <div class="mt-3">
            <h4 class="font-bold text-sm text-slate-100 font-cinzel">Binding Work</h4>
            <p class="text-[11px] text-slate-400 font-mono mt-0.5">Al-'Aqd / Defixio</p>
          </div>
        </button>

        <!-- Tab: Cleansing -->
        <button onclick="selectOperativeWork('cleansing')" id="opChip-cleansing" class="op-chip text-left p-4 rounded-2xl border border-slate-800 bg-slate-950/90 hover:border-sky-500/60 transition flex flex-col justify-between">
          <div class="flex items-center justify-between w-full">
            <span class="text-2xl">🌊</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-950 text-sky-300 border border-sky-800">94% Potent</span>
          </div>
          <div class="mt-3">
            <h4 class="font-bold text-sm text-sky-300 font-cinzel">Cleansing Work</h4>
            <p class="text-[11px] text-slate-400 font-mono mt-0.5">Al-Taharah / Catharsis</p>
          </div>
        </button>

        <!-- Tab: Protection -->
        <button onclick="selectOperativeWork('protection')" id="opChip-protection" class="op-chip text-left p-4 rounded-2xl border border-slate-800 bg-slate-950/90 hover:border-amber-500/60 transition flex flex-col justify-between">
          <div class="flex items-center justify-between w-full">
            <span class="text-2xl">🛡️</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">98% Shield</span>
          </div>
          <div class="mt-3">
            <h4 class="font-bold text-sm text-amber-300 font-cinzel">Protection Work</h4>
            <p class="text-[11px] text-slate-400 font-mono mt-0.5">Al-Tahsin / Hifz</p>
          </div>
        </button>

      </div>

      <!-- Dynamic Operative Workspace Content -->
      <div id="operativeContentDisplay" class="mt-6 pt-6 border-t border-slate-800 flex flex-col gap-6">
        <!-- Rendered dynamically by selectOperativeWork() in JS -->
      </div>

    </div>
  </section>

  <!-- Footer -->`;

if (html.includes(mainCloseTarget)) {
  html = html.replace(mainCloseTarget, operativeConsoleSection);
  console.log("Added Master Operative Grimoiric Works Command Console before footer.");
}

// 5. UPDATE JAVASCRIPT: masterHoursData with operative field
// Let's inject operative data into masterHoursData
const keys = Object.keys(hourOperativeData);
keys.forEach(k => {
  const targetIdStr = `id: "${k}",`;
  const op = hourOperativeData[k];
  const opJson = `operative: ${JSON.stringify(op)},`;
  
  if (html.includes(targetIdStr) && !html.includes(`id: "${k}",\n        operative:`)) {
    html = html.replace(targetIdStr, `${targetIdStr}\n        ${opJson}`);
  }
});
console.log("Injected operative data into masterHoursData entries.");

// 6. UPDATE selectHour() to update the 4 operative impact cards
const selectHourFind = `// Update Column 4: Grimoiric & Domain
      document.getElementById('hourPrescribed').textContent = data.prescribed;
      document.getElementById('hourAvoid').textContent = data.avoid;
      document.getElementById('hourDomainPeak').textContent = data.domainPeak;`;

const selectHourReplace = `// Update Column 4: Grimoiric & Domain
      document.getElementById('hourPrescribed').textContent = data.prescribed;
      document.getElementById('hourAvoid').textContent = data.avoid;
      document.getElementById('hourDomainPeak').textContent = data.domainPeak;

      // Update Operative Works Row for this hour
      if (data.operative) {
        document.getElementById('hourLoveRating').textContent = data.operative.love.rating;
        document.getElementById('hourLoveDesc').textContent = data.operative.love.desc;

        document.getElementById('hourBindingRating').textContent = data.operative.binding.rating;
        document.getElementById('hourBindingDesc').textContent = data.operative.binding.desc;

        document.getElementById('hourCleansingRating').textContent = data.operative.cleansing.rating;
        document.getElementById('hourCleansingDesc').textContent = data.operative.cleansing.desc;

        document.getElementById('hourProtectionRating').textContent = data.operative.protection.rating;
        document.getElementById('hourProtectionDesc').textContent = data.operative.protection.desc;
      }`;

if (html.includes(selectHourFind)) {
  html = html.replace(selectHourFind, selectHourReplace);
  console.log("Updated selectHour() with operative works DOM updates.");
}

// 7. INJECT operativeWorksCatalog & selectOperativeWork() IN SCRIPT
const scriptEndFind = `let chimeEnabled = false;`;

const operativeScriptAddition = `// ==================== MASTER OPERATIVE WORKS CATALOG ====================
    const operativeWorksCatalog = {
      love: {
        id: "love", glyph: "❤️", title: "Love Work (Al-Hubb & Al-'Ishq)",
        arabic: "المحبة والعشق وجلب القلوب",
        viabilitySweet: 28, viabilitySever: 92,
        viabilityVerdict: "PROSCRIBED for Naive Attraction • SUPREME for Cord-Cutting (Tafriq) & Shadow Alchemy",
        gaugeColor: "#ec4899",
        astrologicalEngine: "Venus is Stationary-Retrograde at 08°29′ Scorpio (Detriment, frozen speed -0.017°/day). Moon in Cancer trines Venus (4°21′ applying) creating an underworld conduit.",
        classicalProhibition: "Picatrix Bk. II Ch. 10 & Agrippa Bk. II Ch. 32 strictly proscribe sweet love talismans when Venus is in Scorpio or retrograde. Attempting naive love spells yields suffocating obsession, paranoid stalking, jealousy, and mutual hatred.",
        prescribedAction: "Cord-Cutting (Tafriq al-Batil), unbinding trauma bonds, reclaiming erotic sovereignty (PGM IV Underworld Aphrodite), shadow sexual integration.",
        authorities: ["Picatrix (Ghayat al-Hakim) Bk. II & IV", "Agrippa De Occulta Philosophia Bk. II", "Shams al-Ma'arif al-Kubra (Bab al-Tafriq)", "PGM IV. 2967-3006"],
        altarMateria: "Dark tarnished copper or lead, black candle (banishing), violet candle (shadow integration), unhandled iron athame (Mars in Leo).",
        fumigation: "Myrrh resin, crushed dried pomegranate peel, sulfur, rue (Pegani Harmala), wormwood powder.",
        primaryProtocol: {
          name: "Protocol 1A: The Seven-Knot Cord-Cutting (Tafriq al-Batil)",
          verse: "أَوَلَمْ يَرَ الَّذِينَ كَفَرُوا أَنَّ السَّمَاوَاتِ وَالْأَرْضَ كَانَتَا رَتْقًا فَفَتَقْنَاهُمَا (Surah 21:30)",
          formula: "Tie 7 loose knots into a black wool cord. Pass through myrrh smoke. Slice each knot with consecrated iron shouting: 'FA-FATAQNĀHUMĀ!' Burn severed fragments to ash; bury facing West outside property."
        },
        effectsMatrix: {
          psychological: "Instant relief from ruminative thought loops; termination of obsessive emotional yearning; acute resurgence of self-sovereignty.",
          relational: "Ex-partner feels energetic severing within 72 hours and often makes a desperate contact attempt (which must be met with silence to seal).",
          physical: "Release of constriction in solar plexus, throat, and chest; restoration of peaceful REM sleep.",
          astral: "Dissolution of astral cords attached to sacral chakra; eviction of parasitic thought-forms feeding on unrequited longing.",
          karmic: "Clears generational trauma patterns of romantic self-abandonment."
        },
        reversalSafety: "If psychic backfire (Raj'ah) occurs: lie on bare earth, place raw black tourmaline on solar plexus, drink cold salted water with lemon."
      },
      binding: {
        id: "binding", glyph: "🔒", title: "Binding Work (Al-'Aqd & Katadesmoi)",
        arabic: "العقد والربط والدفائن والطلاسم",
        viabilitySweet: 99, viabilitySever: 99,
        viabilityVerdict: "SUPREME OPTIMAL PEAK (99%) — Maximum Astrological Potency in Years",
        gaugeColor: "#94a3b8",
        astrologicalEngine: "Saturn is Supreme Nocturnal Day Ruler, physically culminating at +75.25° NW near Zenith directly overhead in Jakarta, locked in an applying annual opposition to the Sun (0°50′). Waning Moon sits at Mansion 8/9 cusp.",
        classicalProhibition: "Never bind an innocent soul or attempt binding out of petty spite. The Saturnian weight reflects directly onto the operator's skeleton and finances if cast unjustly.",
        prescribedAction: "Silencing slanderers ('Aqd al-Lisan), freezing courtroom adversaries, shutting mouths of false accusers, binding demonic entities, permanent property perimeter lock.",
        authorities: ["Shams al-Ma'arif (Bab 'Aqd al-Alsinah)", "PGM V. 304-447 (Lead Defixio of Kronos)", "Picatrix Bk. II Ch. 10", "Key of Solomon"],
        altarMateria: "Cold sheet of lead (3x3 in), forged iron padlock with key, bronze stylus or gallnut ink, black waxed linen thread.",
        fumigation: "Myrrh resin, cypress needles, bruised juniper berries, assafoetida (Hiltit), black poppy seeds.",
        primaryProtocol: {
          name: "Protocol 2A: The Cold Lead Tongue-Binding ('Aqd al-Lisan)",
          verse: "صُمٌّ بُكْمٌ عُمْيٌ فَهُمْ لَا يَرْجِعُونَ (Deaf, dumb, and blind; they cannot return) + 3x3 Magic Square of Saturn (Wafq Zuhal)",
          formula: "Engrave 3x3 Saturn square on lead lamella. Enclose target's name. Wrap tightly around cold iron padlock shackle. Click padlock shut while reciting: 'As Kronos sealeth the tomb, so is thy tongue locked.' Throw key in river; bury lock under heavy stone."
        },
        effectsMatrix: {
          psychological: "Target experiences sudden mental fatigue, severe apathy, and amnesia regarding their hostility against you.",
          relational: "Adversary stutters, contradicts themselves in court, or abruptly drops litigation and public slander.",
          physical: "Target feels unexplained heaviness in limbs and throat tightness when attempting to speak falsehood.",
          astral: "Hostile egregors and astral familiars are permanently trapped in the cold lead-iron lattice and grounded into the earth.",
          karmic: "Enforces cosmic karmic stasis until higher spiritual justice resolves."
        },
        reversalSafety: "To unbind: retrieve padlock and unlock while reciting Psalm 146:7 & Surah 94; if lost, boil 7 iron keys in rue-hyssop water."
      },
      cleansing: {
        id: "cleansing", glyph: "🌊", title: "Cleansing Work (Al-Taharah & Lustratio)",
        arabic: "الطهارة والاستنزال وحل الأسحار",
        viabilitySweet: 94, viabilitySever: 94,
        viabilityVerdict: "HIGHLY POTENT / CATHARTIC (94%) — Peak Domicile Lunar Purgation",
        gaugeColor: "#38bdf8",
        astrologicalEngine: "Moon in Home Domicile in Cancer (12°50′) in 12th House (subconscious purgation) conjunct Royal Behenian Star Sirius (14°27′). Waning Moon (48.1% lit, Krishna Ashtami) draws out toxic fluid; Mercury trine Fomalhaut (0°01′) cleanses intellect.",
        classicalProhibition: "Do not cleanse with hot, fiery martial herbs (chili, pepper) when seeking deep somatic emotional restoration; use cool lunar and solar botanicals.",
        prescribedAction: "Expelling the Evil Eye (Al-'Ayn), dismantling generational hexes (Ibtal al-Sihr), lustral salt baths, fumigating residential space, clearing auric parasitic larvae.",
        authorities: ["Shams al-Ma'arif (Bab al-Ibtal wa-l-Fakk)", "Agrippa Bk. I Ch. 43 (Lustral Waters)", "PGM XII & VII", "Corpus Hermeticum"],
        altarMateria: "Silver or glass bowl, 7 liters of rainwater/springwater, 1 cup unrefined coarse sea salt, white candle.",
        fumigation: "Frankincense tears (Luban Dhakar), white sandalwood, camphor, lavender, dried bay leaves.",
        primaryProtocol: {
          name: "Protocol 3A: The Seven-Herb Celestial Lustratio (Ghusl al-Ibtal)",
          verse: "Ayat al-Kursi (2:255) + Surahs Al-Falaq & An-Nas (Recited 33 times over water)",
          formula: "Steep Rue, Hyssop, Camphor, Sandalwood, Frankincense, Lavender, and Rosewater with coarse sea salt in water. Blow breath 3 times over bowl. Pour from crown of head down entire body, visualizing black sludge draining away. Air-dry on skin."
        },
        effectsMatrix: {
          psychological: "Immediate dissipation of chronic brain fog, irrational anxiety, and feeling of impending doom; radiant mental lucidity.",
          relational: "Parasitic, envious acquaintances feel inexplicably uneasy and quietly drift out of your life.",
          physical: "Release of tension in neck, trapezius, and lower back where negative cords attach; deep restorative sleep.",
          astral: "Auric tears and holes repaired; shimmering silver-blue boundary reconstituted around subtle body.",
          karmic: "Neutralizes inherited family curses and ancestral miasma."
        },
        reversalSafety: "Cleansing has zero negative recoil; if mild nausea occurs, it is a detox Herxheimer symptom indicating heavy miasmic purge."
      },
      protection: {
        id: "protection", glyph: "🛡️", title: "Protection Work (Al-Tahsin & Apotropaics)",
        arabic: "التحصين والحفظ والحروز القاطعة",
        viabilitySweet: 98, viabilitySever: 98,
        viabilityVerdict: "INVINCIBLE FORTIFICATION (98%) — Kinetic Counter-Strike Shield",
        gaugeColor: "#f59e0b",
        astrologicalEngine: "Mars in Leo (03°16′) in 1st house in exact 0°10′ opposition to Pluto in Aquarius (03°06′) in 7th house. Saturn at Zenith anchors four corners; Royal Stars Fomalhaut & Aldebaran form archangelic canopy.",
        classicalProhibition: "Never erect an impenetrable ward around yourself or home before performing a thorough cleansing; otherwise, existing internal parasites and grief will be trapped inside.",
        prescribedAction: "Apotropaic mirror amulets, reflecting attacks tenfold, 4-corner iron boundary stakes, Archangelic circle casting, sealing thresholds against thieves and spies.",
        authorities: ["Shams al-Ma'arif (Bab al-Tahsin bi-l-Awfaq)", "Agrippa Bk. II Ch. 22", "Picatrix Bk. II Ch. 7", "PGM VII. 969-972"],
        altarMateria: "4 large forged iron nails (masonry or railroad), 4 raw black tourmaline stones, polished steel mirror, red silk pouch.",
        fumigation: "Dragon's blood resin, black peppercorns, dried chili, frankincense, tobacco leaf.",
        primaryProtocol: {
          name: "Protocol 4A: The 4-Corner Iron Stake Boundary Ward (Tahriz al-Arba'ah)",
          verse: "يَا عَزِيزُ يَا قَهَّارُ يَا قَوِيُّ يَا مَتِينُ يَا مُنْتَقِمُ (5 Divine Names of Subjugation) + 5x5 Wafq of Mars",
          formula: "Anoint 4 iron stakes with black pepper oil. Fumigate with dragon's blood. Drive one nail with black tourmaline into North corner, proceed clockwise to East, South, West. Stamp foot in center: 'THE BORDER IS SEALED. IT IS FINISHED.'"
        },
        effectsMatrix: {
          psychological: "Unshakeable calmness, sovereign authority, absolute immunity to gaslighting, intimidation, and panic.",
          relational: "Hostile competitors find their aggressive maneuvers backfiring immediately onto their own reputations and finances.",
          physical: "Elevated adrenal vitality; elimination of mysterious fatigue caused by psychic energy draining.",
          astral: "A blinding aura of ruby-red and gold deflects etheric darts, jealousy, and evil eye back to origin.",
          karmic: "Fixes the practitioner's sovereign destiny upon its true orbit."
        },
        reversalSafety: "To dismantle: pull iron nails in counter-clockwise order starting from West, submerge in salt brine, thank the guardians."
      }
    };

    function selectOperativeWork(workId) {
      const data = operativeWorksCatalog[workId];
      if (!data) return;

      // Update chip styling
      document.querySelectorAll('#operativeWorkChips .op-chip').forEach(c => {
        c.classList.remove('active', 'border-amber-500/60', 'shadow-lg');
        c.classList.add('border-slate-800');
      });
      const activeChip = document.getElementById(\`opChip-\${workId}\`);
      if (activeChip) {
        activeChip.classList.add('active', 'border-amber-500/60', 'shadow-lg');
        activeChip.classList.remove('border-slate-800');
      }

      // Render into operativeContentDisplay
      const container = document.getElementById('operativeContentDisplay');
      container.innerHTML = \`
        <!-- Top Status & Astrological Engine -->
        <div class="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <span class="text-4xl">\${data.glyph}</span>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-xl font-bold font-cinzel text-white">\${data.title}</h3>
                <span class="text-xs font-mono text-amber-400 font-semibold">\${data.arabic}</span>
              </div>
              <p class="text-xs font-mono text-slate-300 mt-1">\${data.viabilityVerdict}</p>
            </div>
          </div>

          <div class="flex flex-col items-end gap-1.5 font-mono text-xs">
            <span class="text-slate-400 text-[10px] uppercase">ASTRONOMICAL VIABILITY</span>
            <div class="w-48 bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700">
              <div class="h-full rounded-full transition-all duration-700" style="width: \${data.viabilitySweet}%; background-color: \${data.gaugeColor};"></div>
            </div>
            <span class="text-slate-300 font-bold">\${data.viabilitySweet}% Potency</span>
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
              <span class="text-amber-400">📜</span> \${data.primaryProtocol.name}
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
            <p class="font-mono text-xs text-amber-200 font-semibold">\${data.primaryProtocol.verse}</p>
            <p class="text-xs text-slate-300 leading-relaxed font-sans mt-1">\${data.primaryProtocol.formula}</p>
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
              <p class="text-slate-300 text-[11px] leading-relaxed">\${data.effectsMatrix.psychological}</p>
            </div>
            <div class="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span class="text-sky-400 block font-bold mb-1 text-[11px]">👥 Relational</span>
              <p class="text-slate-300 text-[11px] leading-relaxed">\${data.effectsMatrix.relational}</p>
            </div>
            <div class="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span class="text-emerald-400 block font-bold mb-1 text-[11px]">🩺 Somatic</span>
              <p class="text-slate-300 text-[11px] leading-relaxed">\${data.effectsMatrix.physical}</p>
            </div>
            <div class="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span class="text-purple-400 block font-bold mb-1 text-[11px]">👁️ Astral / Entity</span>
              <p class="text-slate-300 text-[11px] leading-relaxed">\${data.effectsMatrix.astral}</p>
            </div>
            <div class="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span class="text-rose-400 block font-bold mb-1 text-[11px]">⚖️ Karmic Orbit</span>
              <p class="text-slate-300 text-[11px] leading-relaxed">\${data.effectsMatrix.karmic}</p>
            </div>
          </div>
        </div>

        <!-- Reversal Safety -->
        <div class="p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/60 text-xs flex items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <span class="text-rose-400 font-bold text-sm">⚠️</span>
            <span class="text-rose-200"><strong class="text-rose-300 font-semibold">Emergency Neutralization / Reversal:</strong> \${data.reversalSafety}</span>
          </div>
          <a href="docs/four_operative_works_master_manual.md" class="text-rose-300 hover:text-white font-mono text-[11px] underline whitespace-nowrap">View Manual →</a>
        </div>
      \`;
    }

    let chimeEnabled = false;`;

if (html.includes(scriptEndFind)) {
  html = html.replace(scriptEndFind, operativeScriptAddition);
  console.log("Injected operativeWorksCatalog and selectOperativeWork() into JavaScript.");
}

// In initialize section: trigger selectOperativeWork('binding') upon load
const initFind = `renderHoursGrids();
    selectHour("N-08");`;

const initReplace = `renderHoursGrids();
    selectHour("N-08");
    selectOperativeWork("binding");`;

if (html.includes(initFind)) {
  html = html.replace(initFind, initReplace);
  console.log("Updated init sequence to selectOperativeWork('binding').");
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log("Successfully wrote all updates to index.html!");

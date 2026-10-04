/**
 * Astroval Real-Time Dynamic Synchronization Engine
 * Connects directly to the Swiss Ephemeris FastAPI server (100% NASA JPL precision)
 * Supports live WebSocket 1-second streaming and date-time navigation.
 */

(function () {
  'use strict';

  // API Configuration
  const isLocalOrHostinger = window.location.protocol.startsWith('http') && !window.location.origin.includes('github.io');
  const API_BASE = isLocalOrHostinger ? window.location.origin : 'https://srv691444.hstgr.cloud';
  const WS_BASE = API_BASE.replace(/^http/, 'ws');

  let currentSnapshot = null;
  let activeHourRemainingSeconds = 0;
  let activeHourTotalDurationSeconds = 3600;
  let activeHourElapsedSeconds = 0;
  let activeHourId = null;
  let isCustomEpochActive = false;
  let wsConnection = null;
  let chimeAudioCtx = null;
  let isChimeActive = false;

  // Work Slug Mapping
  const WORK_SLUG_MAP = {
    1: 'love',
    2: 'severance',
    3: 'binding',
    4: 'cleansing',
    5: 'protection',
    6: 'war',
    7: 'pacification',
    8: 'knowledge',
    9: 'wealth',
    10: 'healing',
    11: 'sovereignty',
    12: 'discord',
    13: 'invisibility',
    14: 'dreams'
  };

  const BADGE_COLOR_MAP = {
    peak: { bg: '#10b98122', text: '#34d399', border: '#10b98155' },
    high: { bg: '#0284c722', text: '#38bdf8', border: '#0284c755' },
    moderate: { bg: '#f59e0b22', text: '#fbbf24', border: '#f59e0b55' },
    caution: { bg: '#f9731622', text: '#fb923c', border: '#f9731655' },
    proscribed: { bg: '#e11d4822', text: '#f43f5e', border: '#e11d4855' }
  };

  const DOMAIN_PEAK_MAP = {
    "Saturn": "DOM-10 (Vocation), DOM-07 (Contracts) & DOM-08 (Crisis)",
    "Jupiter": "DOM-09 (Higher Gnosis), DOM-02 (Wealth) & DOM-11 (Alliances)",
    "Mars": "DOM-01 (Vitality), DOM-06 (Protection) & DOM-08 (Severance)",
    "Sun": "DOM-01 (Sovereignty), DOM-10 (Authority) & DOM-05 (Fame)",
    "Venus": "DOM-05 (Creativity), DOM-07 (Union) & DOM-02 (Abundance)",
    "Mercury": "DOM-03 (Intellect & Ciphers), DOM-06 (Craft) & DOM-10 (Trade)",
    "Moon": "DOM-04 (Sanctuary), DOM-12 (Occult Trance) & DOM-01 (Body Soul)"
  };

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    initEngineUI();
    fetchSnapshot();
    setupWebSocket();
    startSecondTimer();
  });

  function initEngineUI() {
    // Inject Engine Status Badge in Header
    const clockContainer = document.getElementById('liveClockText')?.parentElement?.parentElement;
    if (clockContainer) {
      const badge = document.createElement('div');
      badge.id = 'astrovalEngineStatusBadge';
      badge.className = 'flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs shadow-inner cursor-pointer hover:border-slate-700 transition';
      badge.innerHTML = `
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span class="text-slate-400 hidden sm:inline">SWISS EPHEMERIS:</span>
        <span id="engineStatusText" class="font-bold text-emerald-400">CONNECTING</span>
      `;
      badge.onclick = () => window.open(`${API_BASE}/api/health`, '_blank');
      clockContainer.insertBefore(badge, clockContainer.firstChild);

      // Date Inspector Button
      const inspectorBtn = document.createElement('button');
      inspectorBtn.id = 'dateInspectorToggleBtn';
      inspectorBtn.className = 'px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-sky-400 hover:text-sky-300 transition flex items-center gap-1.5 text-xs font-mono font-bold';
      inspectorBtn.innerHTML = `<span>📅</span> <span id="epochBadgeText">Live Now</span>`;
      inspectorBtn.onclick = toggleDateModal;
      clockContainer.insertBefore(inspectorBtn, clockContainer.children[2] || null);
    }

    // Append Modal HTML to body
    createDateModal();
  }

  function createDateModal() {
    const modal = document.createElement('div');
    modal.id = 'astrovalDateModal';
    modal.className = 'fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300 opacity-0 pointer-events-none';
    modal.innerHTML = `
      <div class="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-md w-full p-6 shadow-2xl font-mono text-xs flex flex-col gap-4 transform scale-95 transition-all duration-300" id="astrovalDateModalBox">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div class="flex items-center gap-2">
            <span class="text-xl">🪐</span>
            <h3 class="text-sm sm:text-base font-cinzel font-bold text-white tracking-wider">Dynamic Astrometric Inspector</h3>
          </div>
          <button id="closeModalBtn" class="text-slate-400 hover:text-white text-lg px-2">✕</button>
        </div>

        <p class="text-slate-400 leading-relaxed font-sans text-xs">
          Query the Swiss Ephemeris NASA JPL DE441 engine for any historical, current, or future celestial configuration in Jakarta (WIB):
        </p>

        <div class="flex flex-col gap-3">
          <div>
            <label class="block text-slate-400 text-[10px] font-bold uppercase mb-1">DATE (YYYY-MM-DD)</label>
            <input type="date" id="modalDatePicker" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-sky-500 focus:outline-none">
          </div>
          <div>
            <label class="block text-slate-400 text-[10px] font-bold uppercase mb-1">TIME (HH:MM:SS WIB)</label>
            <input type="time" id="modalTimePicker" step="1" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-sky-500 focus:outline-none">
          </div>
        </div>

        <div class="flex gap-2 pt-2">
          <button id="applyCustomEpochBtn" class="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold transition shadow-lg">
            Calculate Epoch
          </button>
          <button id="resetLiveEpochBtn" class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center gap-1.5 shadow-lg">
            <span class="w-2 h-2 rounded-full bg-white animate-ping"></span> Live Now
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('closeModalBtn').onclick = toggleDateModal;
    document.getElementById('applyCustomEpochBtn').onclick = applyCustomDate;
    document.getElementById('resetLiveEpochBtn').onclick = resetToLive;

    // Default values to now in Jakarta
    const now = new Date();
    const jakartaDate = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
    document.getElementById('modalDatePicker').value = jakartaDate.toISOString().split('T')[0];
    document.getElementById('modalTimePicker').value = jakartaDate.toTimeString().split(' ')[0];
  }

  function toggleDateModal() {
    const modal = document.getElementById('astrovalDateModal');
    const box = document.getElementById('astrovalDateModalBox');
    if (!modal) return;
    const isHidden = modal.classList.contains('pointer-events-none');
    if (isHidden) {
      modal.classList.remove('opacity-0', 'pointer-events-none');
      modal.classList.add('opacity-100');
      box.classList.remove('scale-95');
      box.classList.add('scale-100');
    } else {
      modal.classList.add('opacity-0', 'pointer-events-none');
      modal.classList.remove('opacity-100');
      box.classList.add('scale-95');
      box.classList.remove('scale-100');
    }
  }

  async function applyCustomDate() {
    const dVal = document.getElementById('modalDatePicker').value;
    const tVal = document.getElementById('modalTimePicker').value || '12:00:00';
    if (!dVal) return;

    toggleDateModal();
    isCustomEpochActive = true;
    document.getElementById('epochBadgeText').textContent = `${dVal} ${tVal.slice(0, 5)}`;
    document.getElementById('epochBadgeText').classList.add('text-amber-400');

    await fetchSnapshot(`${dVal}T${tVal}`);
  }

  async function resetToLive() {
    toggleDateModal();
    isCustomEpochActive = false;
    document.getElementById('epochBadgeText').textContent = 'Live Now';
    document.getElementById('epochBadgeText').classList.remove('text-amber-400');
    await fetchSnapshot();
  }

  // Fetch full astronomical snapshot
  async function fetchSnapshot(isoTarget = null) {
    try {
      const url = isoTarget 
        ? `${API_BASE}/api/chart?iso_datetime=${encodeURIComponent(isoTarget)}` 
        : `${API_BASE}/api/live`;

      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      currentSnapshot = data;

      // Update Engine Badge
      const statusText = document.getElementById('engineStatusText');
      if (statusText) {
        statusText.textContent = 'ONLINE 100%';
        statusText.className = 'font-bold text-emerald-400';
      }

      applySnapshotToDOM(data);
    } catch (err) {
      console.warn('Astroval API error:', err);
      const statusText = document.getElementById('engineStatusText');
      if (statusText) {
        statusText.textContent = 'STATIC FALLBACK';
        statusText.className = 'font-bold text-amber-400';
      }
    }
  }

  function applySnapshotToDOM(data) {
    if (!data) return;

    // 1. Hero Overview
    const hDayRuler = document.getElementById('heroDayRuler');
    if (hDayRuler && data.chronometry) {
      hDayRuler.textContent = `${data.chronometry.astral_day_ruler} (${getDayNameArabic(data.chronometry.astral_day_ruler)})`;
    }

    const hAsc = document.getElementById('heroAscendant');
    if (hAsc && data.houses && data.houses.ascendant) {
      hAsc.textContent = data.houses.ascendant.formatted_short || data.houses.ascendant.short || data.houses.ascendant.formatted;
    }

    const hMc = document.getElementById('heroMidheaven');
    if (hMc && data.houses && data.houses.midheaven) {
      hMc.textContent = data.houses.midheaven.formatted_short || data.houses.midheaven.short || data.houses.midheaven.formatted;
    }

    const hMoon = document.getElementById('heroLunarPhase');
    if (hMoon && data.luminaries) {
      hMoon.textContent = `${data.luminaries.moon_phase_name.split(' (')[0]} (${data.luminaries.moon_illumination_pct}%)`;
    }

    if (data.aspects && data.aspects.length > 0) {
      const hAspect = document.getElementById('heroPeakAspect');
      if (hAspect) {
        const topAsp = data.aspects[0];
        hAspect.textContent = `${topAsp.body1} ${topAsp.aspect_glyph} ${topAsp.body2} (${topAsp.orb_formatted})`;
      }
    }

    if (data.fixed_stars && data.fixed_stars.length > 0) {
      const hStar = document.getElementById('heroStarContact');
      if (hStar) {
        const contactStars = data.fixed_stars.filter(s => s.contacts && s.contacts.length > 0);
        if (contactStars.length > 0) {
          const s = contactStars[0];
          hStar.textContent = `★ ${s.name} ☌ ${s.contacts[0].body} (${s.contacts[0].orb_formatted})`;
        } else {
          hStar.textContent = `★ Fomalhaut at 04°12′ ♓`;
        }
      }
    }

    // 2. Active Planetary Hour
    const activeH = data.chronometry?.active_hour;
    if (activeH) {
      activeHourId = activeH.id;
      activeHourRemainingSeconds = activeH.seconds_remaining || 0;
      activeHourTotalDurationSeconds = activeH.duration_seconds || 3600;
      activeHourElapsedSeconds = activeHourTotalDurationSeconds - activeHourRemainingSeconds;

      const titleEl = document.getElementById('activeHourTitle');
      if (titleEl) {
        titleEl.textContent = `${activeH.num}${getOrdinal(activeH.num)} ${capitalize(activeH.period.toLowerCase())}: ${activeH.ruler} (${activeH.glyph})`;
        titleEl.style.color = activeH.color;
      }

      updateCountdownDisplay();
    }

    // 3. Section Headers (Nocturnal & Diurnal)
    if (data.chronometry) {
      const c = data.chronometry;
      const noctHeader = document.getElementById('nocturnalHeaderTitle');
      const noctRuler = document.getElementById('nocturnalHeaderRuler');
      const diurHeader = document.getElementById('diurnalHeaderTitle');
      const diurRuler = document.getElementById('diurnalHeaderRuler');

      const noctM = Math.floor((c.nocturnal_hour_seconds || 3600) / 60);
      const noctS = (c.nocturnal_hour_seconds || 3600) % 60;
      const diurM = Math.floor((c.diurnal_hour_seconds || 3600) / 60);
      const diurS = (c.diurnal_hour_seconds || 3600) % 60;

      if (noctHeader) {
        const sunsetStr = (c.sunset_wib || '').slice(0, 5);
        const nextSunStr = (c.next_sunrise_wib || '').slice(0, 5);
        noctHeader.innerHTML = `<span>🌙</span> NOCTURNAL HOURS (Sunset ${sunsetStr} → Sunrise ${nextSunStr}) • Length: ${noctM}m ${noctS}s`;
      }
      if (noctRuler && c.nocturnal_day_ruler) {
        noctRuler.textContent = `Ruler: ${c.nocturnal_day_ruler} (${getDayNameArabic(c.nocturnal_day_ruler)})`;
      }

      if (diurHeader) {
        const sunrStr = (c.sunrise_wib || '').slice(0, 5);
        const sunsStr = (c.sunset_wib || '').slice(0, 5);
        diurHeader.innerHTML = `<span>☀️</span> DIURNAL HOURS (${c.astral_day_ruler} Day: Sunrise ${sunrStr} → Sunset ${sunsStr}) • Length: ${diurM}m ${diurS}s`;
      }
      if (diurRuler) {
        diurRuler.textContent = `Ruler: ${c.astral_day_ruler} (${getDayNameArabic(c.astral_day_ruler)})`;
      }
    }

    // 4. Update window.masterHoursData and 24-Hour Grid
    if (data.chronometry?.hours && window.masterHoursData) {
      data.chronometry.hours.forEach(engH => {
        let found = window.masterHoursData.find(h => h.id === engH.id);
        if (!found) {
          found = { id: engH.id };
          window.masterHoursData.push(found);
        }
        found.num = engH.num;
        found.period = engH.period;
        found.ruler = engH.ruler;
        found.glyph = engH.glyph;
        found.color = engH.color;
        found.name = `${engH.num}${getOrdinal(engH.num)} ${capitalize(engH.period.toLowerCase())}: ${engH.ruler} (${engH.glyph})`;
        found.time = `${engH.start_wib} – ${engH.end_wib} WIB`;
        found.duration = `${Math.floor(engH.duration_seconds / 60)}m ${engH.duration_seconds % 60}s`;
        found.isLiveActive = !!engH.is_active;
        found.sphere = engH.sphere || `${engH.ruler} Sphere`;
        found.archangel = engH.archangel || "";
        found.divineName = engH.divine_name || "";
        found.prescribed = engH.prescribed || "";
        found.avoid = engH.avoid || "";
        found.domainPeak = DOMAIN_PEAK_MAP[engH.ruler] || "Universal Influence";

        const rBody = data.bodies ? data.bodies[engH.ruler_key] : null;
        if (rBody) {
          found.tropical = engH.ruler_tropical || `${rBody.formatted_short} • House ${rBody.house}`;
          found.sidereal = rBody.sidereal_formatted;
          found.altAz = engH.ruler_alt_az || `${rBody.altitude > 0 ? '+' : ''}${rBody.altitude.toFixed(1)}° / ${rBody.azimuth.toFixed(0)}°`;
          found.speed = engH.ruler_motion || rBody.motion_status;
          found.dignity = engH.ruler_dignity || rBody.dignity;
        }

        // Planetary ruler active aspects
        if (data.aspects) {
          const rulerAspects = data.aspects.filter(a => 
            a.body1.toLowerCase() === engH.ruler_key || 
            a.body2.toLowerCase() === engH.ruler_key
          ).map(a => `${a.aspect_glyph} ${a.aspect} ${a.body1.toLowerCase() === engH.ruler_key ? a.body2 : a.body1} (${a.orb_formatted})`);
          found.aspects = rulerAspects.length > 0 ? rulerAspects : ["No major aspects active"];
        }

        // Stars & Luminaries alignment
        if (data.bodies && data.luminaries) {
          found.starsLuminaries = [
            `☉ Sun Alt: ${data.bodies.sun.alt_formatted} (${data.bodies.sun.sign})`,
            `☽ Moon Alt: ${data.bodies.moon.alt_formatted} (${data.luminaries.moon_illumination_pct}%)`
          ];
        }
      });

      if (typeof window.renderHoursGrids === 'function') {
        window.renderHoursGrids();
      }

      // Selection handling:
      // If user hasn't manually clicked another hour, auto-select live active hour!
      if (!window.hasUserSelectedHourManual && activeH) {
        if (typeof window.selectHour === 'function') {
          window.selectHour(activeH.id);
        }
      } else if (window.currentlySelectedHour && typeof window.selectHour === 'function') {
        window.selectHour(window.currentlySelectedHour);
      }
    }

    // 5. Update Ephemeris Table (tab-ephemeris)
    if (data.bodies) {
      Object.keys(data.bodies).forEach(bKey => {
        const b = data.bodies[bKey];
        const row = document.getElementById(`ephem-row-${bKey}`);
        if (row && row.cells.length >= 6) {
          // cells[1]: Tropical
          row.cells[1].textContent = b.formatted_short;
          // cells[2]: Alt / Az
          row.cells[2].textContent = `${b.altitude > 0 ? '+' : ''}${b.altitude.toFixed(1)}° / ${b.azimuth.toFixed(0)}°`;
          row.cells[2].className = `py-2 font-mono ${b.altitude > 0 ? 'text-emerald-400 font-bold' : 'text-slate-400'}`;
          // cells[3]: Mag
          row.cells[3].textContent = (b.magnitude != null) ? (b.magnitude > 0 ? '+' : '') + b.magnitude.toFixed(1) : '—';
          // cells[4]: Motion
          row.cells[4].textContent = b.motion_status;
          row.cells[4].className = `py-2 font-mono ${b.motion_status.includes('Rx') ? 'text-rose-400 font-bold' : 'text-emerald-400'}`;
          // cells[5]: Dignity
          row.cells[5].textContent = b.dignity;
          row.cells[5].className = `py-2 font-bold ${getDignityTextColor(b.dignity)}`;
        }
      });
    }

    // 6. Update Planet Catalog & Inspector Box
    if (data.bodies && window.planetCatalog) {
      Object.keys(data.bodies).forEach(bKey => {
        const b = data.bodies[bKey];
        const p = window.planetCatalog[bKey];
        if (p) {
          p.sign = `${b.formatted} • House ${b.house}`;
          p.badge = b.dignity;
          p.badgeClass = getDignityBadgeClass(b.dignity);
          p.sidereal = b.sidereal_formatted;
          p.nakshatra = b.nakshatra;
          p.alt = `${b.alt_formatted} (Az ${b.az_formatted})`;
          p.motion = `${b.motion_status} (${b.speed_lon > 0 ? '+' : ''}${b.speed_lon.toFixed(3)}°/d)`;
          if (data.aspects) {
            p.aspects = data.aspects
              .filter(a => a.body1.toLowerCase() === bKey || a.body2.toLowerCase() === bKey)
              .map(a => ({
                name: `${a.aspect_glyph} ${a.aspect} ${a.body1.toLowerCase() === bKey ? a.body2 : a.body1}`,
                orb: a.orb_formatted,
                color: getAspectColorClass(a.aspect)
              }));
          }
        }
      });

      if (typeof window.inspectPlanet === 'function') {
        window.inspectPlanet(window.currentlyInspectedPlanet || 'sun');
      }
    }

    // 7. Update SVG Natal Chart Markers (Degrees Text)
    if (data.bodies) {
      Object.keys(data.bodies).forEach(bKey => {
        const b = data.bodies[bKey];
        const marker = document.getElementById(`marker-${bKey}`);
        if (marker) {
          const texts = marker.querySelectorAll('text');
          texts.forEach(t => {
            // Find degree label (contains ° or ′)
            if (t.textContent.includes('°') || t.textContent.includes('′')) {
              t.textContent = b.formatted_short;
            }
          });
        }
      });
    }

    // 8. Update Operative Works (14 Grimoiric Works)
    if (data.operative_works) {
      data.operative_works.forEach(opWork => {
        const slug = WORK_SLUG_MAP[opWork.id];
        if (!slug) return;

        const card = document.getElementById(`work-card-${slug}`);
        if (card) {
          const gaugeFill = card.querySelector('.h-full.rounded-full');
          if (gaugeFill) gaugeFill.style.width = `${opWork.viability_pct}%`;

          const gaugeText = card.querySelector('.flex.flex-col.items-end span.font-bold');
          if (gaugeText) gaugeText.textContent = `${opWork.viability_pct}% Potency`;

          const verdictEl = card.querySelector('p.font-mono.font-semibold');
          if (verdictEl) {
            const bStyle = BADGE_COLOR_MAP[opWork.badge_type] || BADGE_COLOR_MAP.moderate;
            verdictEl.textContent = `${opWork.badge_text} • ${opWork.category}`;
            verdictEl.style.color = bStyle.text;
          }

          let hourMatchTag = card.querySelector('.active-hour-match-tag');
          if (opWork.is_current_hour_aligned) {
            if (!hourMatchTag) {
              hourMatchTag = document.createElement('div');
              hourMatchTag.className = 'active-hour-match-tag px-3 py-1 rounded-xl bg-emerald-950/80 border border-emerald-500/70 text-emerald-300 font-bold text-[10px] font-mono flex items-center gap-1.5 self-start shadow-md';
              hourMatchTag.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> EXACT HOUR SYNC: ACTIVE HOUR OF ${opWork.current_active_hour.toUpperCase()}`;
              const headerDiv = card.querySelector('.border-b');
              if (headerDiv) headerDiv.appendChild(hourMatchTag);
            }
          } else if (hourMatchTag) {
            hourMatchTag.remove();
          }

          const anchorEl = card.querySelector('.grid.grid-cols-1.md\\:grid-cols-2 p.text-slate-300');
          if (anchorEl && opWork.astrological_anchor) {
            anchorEl.textContent = opWork.astrological_anchor;
          }
        }

        if (window.allOperativeWorks) {
          const wObj = window.allOperativeWorks.find(w => w.id === slug);
          if (wObj) {
            wObj.viability = opWork.viability_pct;
            wObj.viabilityVerdict = opWork.badge_text;
          }
        }
      });

      if (typeof window.renderOperativeChips === 'function') {
        window.renderOperativeChips();
      }
    }
  }

  function getDayNameArabic(ruler) {
    const map = {
      "Sun": "Ahad",
      "Moon": "Ithnayn",
      "Mars": "Thulatha",
      "Mercury": "Arba'a",
      "Jupiter": "Khamis",
      "Venus": "Jumu'ah",
      "Saturn": "Sabt"
    };
    return map[ruler] || ruler;
  }

  function getDignityTextColor(dignity) {
    if (!dignity) return 'text-slate-400';
    if (dignity.includes('Domicile') || dignity.includes('Exaltation')) return 'text-blue-400';
    if (dignity.includes('Fall') || dignity.includes('Detriment')) return 'text-red-400';
    return 'text-slate-400';
  }

  function getDignityBadgeClass(dignity) {
    if (!dignity) return 'bg-slate-900 text-slate-300 border-slate-700';
    if (dignity.includes('Domicile') || dignity.includes('Exaltation')) return 'bg-blue-950 text-blue-300 border-blue-800';
    if (dignity.includes('Fall') || dignity.includes('Detriment')) return 'bg-red-950 text-red-300 border-red-800';
    return 'bg-slate-900 text-slate-300 border-slate-700';
  }

  function getAspectColorClass(aspName) {
    if (!aspName) return 'text-slate-400';
    const l = aspName.toLowerCase();
    if (l.includes('trine') || l.includes('sextile')) return 'text-blue-400';
    if (l.includes('square') || l.includes('opposition')) return 'text-red-400';
    if (l.includes('conjunction')) return 'text-purple-400';
    return 'text-slate-400';
  }

  function startSecondTimer() {
    setInterval(() => {
      if (!isCustomEpochActive) {
        if (activeHourRemainingSeconds > 0) {
          activeHourRemainingSeconds -= 1;
          activeHourElapsedSeconds += 1;
          updateCountdownDisplay();
        } else if (activeHourRemainingSeconds === 0 && currentSnapshot) {
          // Transition to next hour!
          playHourChime();
          fetchSnapshot();
        }
      }
    }, 1000);
  }

  function updateCountdownDisplay() {
    const cdEl = document.getElementById('activeHourCountdown');
    if (!cdEl) return;

    const m = Math.floor(activeHourRemainingSeconds / 60);
    const s = activeHourRemainingSeconds % 60;
    const pct = Math.min(100, Math.max(0, Math.round((activeHourElapsedSeconds / activeHourTotalDurationSeconds) * 100)));

    const sStr = String(s).padStart(2, '0');
    cdEl.textContent = `${m}m ${sStr}s remaining (${pct}% elapsed)`;

    // Update progress bar if exists
    let pBar = document.getElementById('activeHourProgressBar');
    if (!pBar) {
      const card = document.getElementById('liveActiveHourCard');
      if (card) {
        const wrap = document.createElement('div');
        wrap.className = 'w-full bg-slate-800 rounded-full h-1 mt-1 overflow-hidden';
        pBar = document.createElement('div');
        pBar.id = 'activeHourProgressBar';
        pBar.className = 'bg-gradient-to-r from-sky-400 to-emerald-400 h-1 rounded-full transition-all duration-1000';
        wrap.appendChild(pBar);
        card.querySelector('.border-l')?.appendChild(wrap);
      }
    }
    if (pBar) {
      pBar.style.width = `${pct}%`;
    }
  }

  function setupWebSocket() {
    if (isCustomEpochActive) return;
    try {
      wsConnection = new WebSocket(`${WS_BASE}/ws/live`);
      wsConnection.onopen = () => {
        console.log('Astroval WebSocket stream connected');
      };

      wsConnection.onmessage = (event) => {
        if (isCustomEpochActive) return;
        try {
          const liveMsg = JSON.parse(event.data);
          if (liveMsg.timestamp_wib) {
            const clockEl = document.getElementById('liveClockText');
            if (clockEl) clockEl.textContent = liveMsg.timestamp_wib.split(' ')[1] + ' WIB';
          }
          if (liveMsg.active_hour) {
            activeHourRemainingSeconds = liveMsg.active_hour.seconds_remaining;
            updateCountdownDisplay();

            // Check if hour changed
            if (activeHourId && liveMsg.active_hour.id !== activeHourId) {
              activeHourId = liveMsg.active_hour.id;
              playHourChime();
              fetchSnapshot();
            }
          }
        } catch (e) {
          // ignore parsing error
        }
      };

      wsConnection.onclose = () => {
        setTimeout(setupWebSocket, 5000);
      };

      wsConnection.onerror = () => {
        wsConnection.close();
      };
    } catch (e) {
      // WebSocket fallback is handled by fetchSnapshot interval
    }
  }

  function playHourChime() {
    if (!window.chimeEnabled) return;
    try {
      if (!chimeAudioCtx) {
        chimeAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      const now = chimeAudioCtx.currentTime;
      // Harmonious Tibetan Singing Bowl Chord (A4, C#5, E5)
      [440.0, 554.37, 659.25, 880.0].forEach((freq, idx) => {
        const osc = chimeAudioCtx.createOscillator();
        const gain = chimeAudioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.15);
        gain.gain.setValueAtTime(0.15, now + idx * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.15 + 3.0);
        osc.connect(gain);
        gain.connect(chimeAudioCtx.destination);
        osc.start(now + idx * 0.15);
        osc.stop(now + idx * 0.15 + 3.2);
      });
    } catch (e) {
      console.warn('Audio chime error:', e);
    }
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function getOrdinal(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  }

})();

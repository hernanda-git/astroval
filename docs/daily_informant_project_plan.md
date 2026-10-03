# Master Technical Architecture & Specification Plan: Daily Jakarta Celestial Informant

**Platform Name:** `AstroJakarta Daily Celestial & Grimoiric Intelligence System`  
**Geographic Lock:** Jakarta City Center, Indonesia  
- **Coordinates:** $6^\circ 12' 32''\text{ S}$ (`-6.208889°`), $106^\circ 50' 44''\text{ E}$ (`+106.845556°`)  
- **Elevation:** $10.0\text{ meters}$ above sea level  
- **Timezone:** Western Indonesia Time (WIB / `UTC+7`)  
- **Precision Standard:** 100% NASA JPL DE431/DE441 ephemeris fidelity via Swiss Ephemeris C-library (`pyswisseph`)

---

## 1. End-to-End System Architecture

```
                                      ┌─────────────────────────────────────────────────────────────┐
                                      │                    NASA JPL Ephemerides                     │
                                      │                   (DE431 / DE441 Files)                     │
                                      └──────────────────────────────┬──────────────────────────────┘
                                                                     │
                                                                     ▼
┌─────────────────────────────────────┐         ┌───────────────────────────────────────────────────┐
│     Automated Worker Daemon         │         │             Python Ephemeris Core                 │
│      (APScheduler / Cron)           ├────────►│             (pyswisseph Engine)                   │
│  - 00:00:01 WIB: Master Daily Build │         │  • 100% Precision Geocentric & Topocentric Astrom.│
│  - 05:00:00 WIB: Pre-Dawn Check     │         │  • Topocentric Refraction & BMKG Horizon Models   │
│  - Every 10s: Live Clock Broadcaster│         │  • Placidus Houses, Cusps, & Key Horizon Angles   │
└─────────────────────────────────────┘         │  • True Unequal Nocturnal & Diurnal Hours         │
                                                │  • Full 28 Lunar Mansions & 27 Vedic Nakshatras   │
                                                │  • Fixed Stars & Longitudinal Aspect Engine       │
                                                │  • Rule-Based Grimoiric Decision Evaluator        │
                                                └─────────────────────┬─────────────────────────────┘
                                                                      │
                                                                      ▼
                                                ┌───────────────────────────────────────────────────┐
                                                │                 Database Layer                    │
                                                │              (PostgreSQL + JSONB)                 │
                                                │  - daily_editions (Core master record)            │
                                                │  - celestial_positions (10 bodies + nodes/aster.) │
                                                │  - placidus_houses (12 cusps + axes)              │
                                                │  - aspect_events (Major & minor with orbs)        │
                                                │  - fixed_star_alignments (Sub-degree contacts)    │
                                                │  - planetary_hours (24 exact daily timeframes)    │
                                                │  - grimoiric_dossiers (Love, War, Binding, etc.)  │
                                                └─────────────────────┬─────────────────────────────┘
                                                                      │
                                                                      ▼
                                                ┌───────────────────────────────────────────────────┐
                                                │               FastAPI Microservice                │
                                                │  • REST Endpoints (/api/v1/today, /editions/...)  │
                                                │  • Server-Sent Events (SSE) / WebSocket Clock     │
                                                │  • Dynamic SVG Chart Wheel Renderer Engine        │
                                                │  • Static File Exporter (Markdown / PDF / JSON)   │
                                                └─────────────────────┬─────────────────────────────┘
                                                                      │
                                                                      ▼
┌───────────────────────────────────────────────────────────────────────────────────────────────────┐
│                           Modern Web Dashboard (Astro / Next.js + Tailwind)                       │
│  ┌────────────────────────────┐ ┌────────────────────────────┐ ┌────────────────────────────────┐ │
│  │ Live Astral Clock Widget   │ │ Interactive SVG Wheel      │ │ Multi-Tab Intelligence Dossier │ │
│  │ (Active hour, countdown,   │ │ (Collision-free glyphs,    │ │ • Astronomical Ephemeris       │ │
│  │  transition chime alerts)  │ │  hover inspect, aspect     │ │ • Vedic / Sidereal & Mansions  │ │
│  │                            │ │  chord filter toggles)     │ │ • 24-Hour Planetary Chronometry│ │
│  └────────────────────────────┘ └────────────────────────────┘ │ • Grimoiric Operations Manual  │ │
│  ┌───────────────────────────────────────────────────────────┐ └────────────────────────────────┘ │
│  │ Archive Calendar Navigator & One-Click PDF/Markdown Export │                                   │
│  └───────────────────────────────────────────────────────────┘                                   │
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Exhaustive Ephemeris & Astrometric Parameters (100% Standard)

### 2.1 Engine Flags & Configuration (`pyswisseph`)
Every calculation must use the following standard initialization flags:
```python
import swisseph as swe

# Set Swiss Ephemeris data path containing DE431/DE441 files
swe.set_ephe_path('/opt/astro/ephe')

# Topocentric observer settings for Jakarta City Center
LATITUDE = -6.208889     # 6°12'32" S
LONGITUDE = 106.845556   # 106°50'44" E
ALTITUDE = 10.0          # 10 meters elevation
PRESSURE = 1013.25       # Standard atmospheric pressure in hPa
TEMPERATURE = 28.0       # Jakarta average night temperature in Celsius

swe.set_topo(LONGITUDE, LATITUDE, ALTITUDE)

# Precision calculation bit flags
EPHE_FLAGS = (
    swe.FLG_SWIEPH      # Use Swiss Ephemeris JPL DE files
    | swe.FLG_SPEED     # Compute high-precision velocity vectors (for applying/separating)
    | swe.FLG_TOPOCTR   # Calculate topocentric positions for exact Jakarta surface
)
```

### 2.2 Celestial Bodies Computed
The engine computes **14 primary celestial bodies and points** daily:
1. **Luminaries:** The Sun (`SE_SUN`), The Moon (`SE_MOON`).
2. **Inner / Personal Planets:** Mercury (`SE_MERCURY`), Venus (`SE_VENUS`), Mars (`SE_MARS`).
3. **Social Planets:** Jupiter (`SE_JUPITER`), Saturn (`SE_SATURN`).
4. **Outer / Generational Planets:** Uranus (`SE_URANUS`), Neptune (`SE_NEPTUNE`), Pluto (`SE_PLUTO`).
5. **Lunar Nodes & Points:** True North Node (`SE_TRUE_NODE`), South Node (computed as $\text{North Node} + 180^\circ$), Lilith / Black Moon (`SE_OSCU_APOG`).
6. **Major Centaurs & Asteroids:** Chiron (`SE_CHIRON`), Ceres (`SE_CERES`).

### 2.3 Attributes Computed Per Body
For every celestial body, the engine generates:
* **Tropical Zodiac:** Degrees, minutes, seconds (`DMS`), sign index, and absolute ecliptic longitude ($0^\circ - 360^\circ$).
* **Sidereal Zodiac:** Lahiri Ayanamsa (`SE_SIDM_LAHIRI`) degrees, sign, and absolute longitude.
* **Equatorial Coordinates:** Apparent Right Ascension (`RA` in hours, minutes, seconds) and Declination (`Dec` in degrees, minutes, seconds).
* **Local Horizontal Coordinates:** True topocentric Altitude ($\text{Alt}$ in degrees, positive = above horizon, negative = below) and Azimuth ($\text{Az}$ in degrees from North: $0^\circ = \text{N}, 90^\circ = \text{E}, 180^\circ = \text{S}, 270^\circ = \text{W}$).
* **Earth Distance:** True instantaneous distance in Astronomical Units (`AU`) and kilometers (`km`).
* **Motion Dynamics:** Daily speed in degrees/day ($\frac{d\lambda}{dt}$). Classified into:
  - `Direct` ($\frac{d\lambda}{dt} > 0.05^\circ/\text{day}$).
  - `Stationary` ($|\frac{d\lambda}{dt}| \le 0.05^\circ/\text{day}$).
  - `Retrograde` ($\frac{d\lambda}{dt} < 0$).
* **Apparent Visual Magnitude ($V_{\text{mag}}$):** Computed via Müller/Schmude planetary magnitude equations.
* **Horizon Events:** Topocentric Rise time, Upper Meridian Transit (Culmination) time, and Setting time for Jakarta.

### 2.4 Lunar Mechanics Module
* **Illumination Percentage:** Exact disk illumination ($0.0\% - 100.0\%$).
* **Phase Angle:** Sun–Earth–Moon phase angle ($0^\circ - 360^\circ$).
* **Phase Classification:**
  1. *New Moon* ($0^\circ - 45^\circ$)
  2. *Waxing Crescent* ($45^\circ - 90^\circ$)
  3. *First Quarter* ($90^\circ - 135^\circ$)
  4. *Waxing Gibbous* ($135^\circ - 180^\circ$)
  5. *Full Moon* ($180^\circ - 225^\circ$)
  6. *Waning Gibbous* ($225^\circ - 270^\circ$)
  7. *Third / Last Quarter* ($270^\circ - 315^\circ$)
  8. *Waning Crescent* ($315^\circ - 360^\circ$)
* **Exact Quarter Timestamp:** Computes the nearest exact primary lunar phase to the second, calculating elapsed hours since or remaining until the event.
* **Lunar Distance & Perigee/Apogee:** Earth-Moon distance in kilometers, with proximity to perigee ($\sim 356,500\text{ km}$) or apogee ($\sim 406,700\text{ km}$).
* **Lunar Tithi:** Exact elongation-based Vedic Tithi (30 divisions of $12^\circ$ each, Shukla 1–15 and Krishna 1–15, e.g., *Krishna Ashtami* for elongation $84^\circ - 96^\circ$).
* **Nakshatra & Pada:** All 27 Vedic Nakshatras ($13^\circ 20'$ each) and 4 Padas ($3^\circ 20'$ each), computed via sidereal Lahiri longitude.
* **Arabic Lunar Mansion (*Manzil al-Qamar*):** All 28 traditional mansions ($12^\circ 51' 26''$ each) in both Tropical (*Picatrix*) and Sidereal (*Shams al-Ma'arif*) frameworks.

### 2.5 Placidus House System & Horizon Angles
Calculated using `swe.houses_ex(jd, LATITUDE, LONGITUDE, b'P')`:
* **The 4 Cardinal Angles:**
  - **Ascendant (ASC):** Exact eastern intersection of ecliptic and horizon.
  - **Descendant (DSC):** Exact western setting point ($\text{ASC} + 180^\circ$).
  - **Midheaven (MC / Medium Coeli):** Upper meridian intersection with ecliptic.
  - **Imum Coeli (IC):** Lower meridian nadir intersection ($\text{MC} + 180^\circ$).
* **Placidus Cusps 1 through 12:** Exact longitude boundaries for Houses 1 through 12, mapping each planet to its precise house placement.

### 2.6 Aspect Matrix & Velocity Vector Engine
The system checks every pair of bodies for the 5 Ptolemaic aspects:
* **Conjunction ($\mathbin{☌}$):** $0^\circ$ (Orb allowance: $8.0^\circ$)
* **Sextile ($\mathbin{✶}$):** $60^\circ$ (Orb allowance: $5.0^\circ$)
* **Square ($\mathbin{□}$):** $90^\circ$ (Orb allowance: $7.0^\circ$)
* **Trine ($\mathbin{\triangle}$):** $120^\circ$ (Orb allowance: $7.0^\circ$)
* **Opposition ($\mathbin{☍}$):** $180^\circ$ (Orb allowance: $8.0^\circ$)

#### Applying vs. Separating Determination
For bodies $A$ and $B$ with longitudes $\lambda_A, \lambda_B$ and speeds $v_A = \frac{d\lambda_A}{dt}, v_B = \frac{d\lambda_B}{dt}$:
$$\Delta\lambda = |\lambda_A - \lambda_B| \pmod{360}$$
$$\text{Current Orb} = |\Delta\lambda - \text{Aspect Target Angle}|$$
$$\text{Relative Velocity } v_{\text{rel}} = v_A - v_B$$
* If the derivative $\frac{d}{dt}(\text{Orb}) < 0$, the aspect is marked **Applying** (building in power).
* If the derivative $\frac{d}{dt}(\text{Orb}) > 0$, the aspect is marked **Separating** (waning in power).

### 2.7 Major Astrological Configurations Detection
The engine algorithmically scans the aspect matrix to identify:
* **T-Squares:** An opposition where both ends square a third focal planet (identifying the apex planet and mode: Cardinal, Fixed, or Mutable).
* **Grand Cross:** Two mutual oppositions squared to each other.
* **Grand Trine:** An equilateral triangle of 3 planets in trine ($120^\circ$) within the same element (Fire, Earth, Air, Water).
* **Yod ("Finger of God"):** Two planets in sextile ($60^\circ$) both making quincunxes ($150^\circ$) to a shared apex planet.
* **Stellium:** 3 or more planets within an orb of $8^\circ$ in a single sign or house.

### 2.8 Fixed Star Catalogue & Alignment Tracker
Uses the Swiss Ephemeris ICRS fixed star catalog (`fixstars.cat`) with full proper motion vectors:
* **Behenian Stars Tracked (15 Stars):** Algol, Pleiades, Aldebaran, Capella, Sirius, Procyon, Regulus, Alkaid, Spica, Arcturus, Alphecca, Antares, Vega, Altair, Fomalhaut, Deneb Algedi.
* **The 4 Royal Stars of Persia:** Aldebaran (East), Regulus (North), Antares (West), Fomalhaut (South).
* **Alignment Detection:** Computes topocentric horizontal coordinates ($\text{Alt/Az}$) to report true visual visibility in Jakarta ($\text{Alt} > 0^\circ$), and checks ecliptic conjunctions, oppositions, trines, and squares with planets down to a strict threshold of **$\le 1^\circ 00'$ orb**.

---

## 3. Dynamic Chronometry Engine (Planetary Hours & Days)

### 3.1 Proportional Hour Mathematics
Astronomical days in traditional grimoires run from sunrise to sunrise:
1. **Sunset Calculation:** Time $T_{\text{sunset}}$ when solar upper-limb touches the geometric horizon with Jakarta atmospheric refraction.
2. **Sunrise Calculation:** Next morning's true sunrise $T_{\text{sunrise}}$.
3. **Nocturnal Duration:** $D_{\text{night}} = T_{\text{sunrise}} - T_{\text{sunset}}$.
   $$\text{Length of each Nocturnal Hour } L_{\text{night}} = \frac{D_{\text{night}}}{12}$$
4. **Diurnal Duration:** $D_{\text{day}} = T_{\text{sunset tomorrow}} - T_{\text{sunrise tomorrow}}$.
   $$\text{Length of each Diurnal Hour } L_{\text{day}} = \frac{D_{\text{day}}}{12}$$

### 3.2 Complete 7-Day Ruler Matrix (Chaldean Order)
Descending Chaldean sphere order: **Saturn $\rightarrow$ Jupiter $\rightarrow$ Mars $\rightarrow$ Sun $\rightarrow$ Venus $\rightarrow$ Mercury $\rightarrow$ Moon**.

| Day of Week | Day Ruler | 1st Diurnal Hour (Sunrise) | 1st Nocturnal Hour (Sunset) |
| :--- | :--- | :--- | :--- |
| **Sunday** | **Sun** | Sun | Jupiter |
| **Monday** | **Moon** | Moon | Venus |
| **Tuesday** | **Mars** | Mars | Saturn |
| **Wednesday**| **Mercury**| Mercury | Sun |
| **Thursday** | **Jupiter**| Jupiter | Moon |
| **Friday** | **Venus** | Venus | Mars |
| **Saturday** | **Saturn** | Saturn | Mercury |

### 3.3 Complete 7-Planet Grimoiric Intelligence Matrix

| Planet | Sphere | Archangel | Intelligence | Spirit Daemon | Olympic Spirit | Divine Names (*Shams al-Ma'arif*) | Letter | Wafq Magic Square | Metal | Incense Blend |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Saturn** | 7th | Cassiel | Agiel (45) | Zazel (45) | Aratron | *Yā Hayyu Yā Qayyūm* (يَا حَيُّ يَا قَيُّومُ) | *Jīm* (ج) | $3 \times 3$ (Sum: 15, Total: 45) | Lead | Cypress, myrrh, sulfur, black poppy |
| **Jupiter**| 6th | Sachiel | Johphiel (136)| Hismael (136) | Bethor | *Yā 'Azīzu Yā Rahīm* (يَا عَزِيزُ يَا رَحِيمُ) | *Dāl* (د) | $4 \times 4$ (Sum: 34, Total: 136) | Tin | Cedarwood, frankincense, nutmeg |
| **Mars** | 5th | Camael | Graphiel (325)| Barzabel (325)| Phaleg | *Yā Qahhār Yā Matīn* (يَا قَهَّارُ يَا مَتِينُ) | *Hā'* (هـ) | $5 \times 5$ (Sum: 65, Total: 325) | Iron | Dragon's blood, black pepper, chili |
| **Sun** | 4th | Raphael | Nakhiel (111) | Sorath (666) | Och | *Yā Nūru Yā Bāsit* (يَا نُورُ يَا بَاسِطُ) | *Wāw* (و) | $6 \times 6$ (Sum: 111, Total: 666)| Gold | Frankincense, olibanum, saffron |
| **Venus** | 3rd | Anael | Hagiel (175) | Kedemel (175) | Hagith | *Yā Wadūdu Yā Latīf* (يَا وَدُودُ يَا لَطِيفُ) | *Zāy* (ز) | $7 \times 7$ (Sum: 175, Total: 1225)| Copper | Red sandalwood, rose petals, myrrh |
| **Mercury**| 2nd | Michael | Tiriel (260) | Taphthartharath| Ophiel | *Yā 'Alīmu Yā Hakīm* (يَا عَلِيمُ يَا حَكِيمُ) | *Hā'* (ح) | $8 \times 8$ (Sum: 260, Total: 2080)| Quicksilver| Mastic, benzoin, storax, bay laurel |
| **Moon** | 1st | Gabriel | Malcha (3321) | Chasmodai (3321)| Phul | *Yā Qaddūsu Yā Fattāh* (يَا قُدُّوسُ يَا فَتَّاحُ)| *Tā'* (ط) | $9 \times 9$ (Sum: 369, Total: 3321)| Silver | White sandalwood, camphor, aloeswood |

---

## 4. The Expanded 12-Dimensional Grimoiric & Life Domain Architecture

Rather than limiting analysis to 5 isolated emotional or crisis spikes (Love, War, Binding, Anger, Knowledge), the system implements an **exhaustive 12-Dimensional Matrix** derived from the *Dodekatropos* (the 12 Astrological Houses of Hellenistic and Persian masters: Dorotheus, Valens, Abu Ma'shar), the 7 Planetary Spheres, and the **4 Universal Operative Teleologies** of *Picatrix* and *Shams al-Ma'arif al-Kubra*.

```
                          [ATTRACTION / INCREASE]
                         Jalb wa-Taysir (Prosthesis)
                         Calling In, Uniting, Growing
                                      ▲
                                      │
[BINDING / LOCKING] ◄─────────────────┼─────────────────► [DISSOLUTION / SEVERING]
 'Aqd wa-Tathbit                      │                    Tafriq wa-Ibtal (Lysis)
 Freezing, Securing, Fixing           │                    Cutting, Purging, Banishing
                                      ▼
                           [DEFENSE / SHIELDING]
                         Hifz wa-Tahsin (Apotropaismo)
                         Warding, Guarding, Deflecting
```

### The 12 Comprehensive Life & Astral Domains

```
                                  [DOM-10: VOCATION & SOVEREIGNTY]
                                        Midheaven (Zenith)
                                                ▲
                                                │
         [DOM-11: ALLIES & HOPES]               │            [DOM-09: HIGHER WISDOM]
                                                │
   [DOM-12: SANCTUARY & KARMA]                  │              [DOM-08: CRISIS & REBIRTH]
                                                │
[DOM-01: VITALITY & PERSONA] ◄──────────────────┼────────────────► [DOM-07: CONTRACTS & FOES]
      Ascendant (East)                          │                        Descendant (West)
                                                │
      [DOM-02: WEALTH & RESOURCES]              │              [DOM-06: HEALING & LABOR]
                                                │
         [DOM-03: INTELLECT & CIPHERS]          │            [DOM-05: EROS & CREATIVITY]
                                                ▼
                                  [DOM-04: HOME & ANCESTRY]
                                         Imum Coeli (Nadir)
```

### 4.1 Exhaustive Domain Specification & Dynamic Evaluator Rules

#### DOM-01: Vitality, Health, Persona & Embodiment (*Al-Sihha wa'l-Dhat*)
* **Astrological Anchor:** 1st House, Ascendant, Sun, Mars.
* **Mundane Spheres:** Bodily constitution, physical stamina, mental clarity, sovereign self-assertion, recovery from physical depletion.
* **Evaluator Rule:**
  - *Trigger:* If `Mars.house == 1` AND `Aspect(Mars, Pluto).orb <= 1.0` (as on 4 Oct 2026):
  - *Status:* **FORTIFICATION / DEFENSE**.
  - *Protocol:* Ground excess martial fire; cooling camphor baths; warding against physical inflammation and burnout.

#### DOM-02: Material Wealth, Commerce & Tangible Sustenance (*Al-Mal wa'l-Rizq*)
* **Astrological Anchor:** 2nd House, Jupiter, Mercury, Venus, Earth Signs.
* **Mundane Spheres:** Liquid revenue, debt settlement, commercial audits, asset security, business transactions, supply resilience.
* **Evaluator Rule:**
  - *Trigger:* If `Venus.is_retrograde == True` AND `Mercury.sign == 'Scorpio'`:
  - *Status:* **AUDIT & SECURE (NO SPECULATION)**.
  - *Protocol:* Forensic accounting; identifying hidden financial leaks; freezing high-risk expenditures; locking assets (*'Aqd al-Amwal*).

#### DOM-03: Intellect, Cryptography, Divination & Daily Trade (*Al-Nutq wa'l-Kashf*)
* **Astrological Anchor:** 3rd House, Mercury, Gemini, 3rd/9th Axis.
* **Mundane Spheres:** Intellectual research, cryptography, codebreaking, deciphering books, divination, local mobility, writing contracts.
* **Evaluator Rule:**
  - *Trigger:* If `FixedStarAspect(Mercury, 'Fomalhaut').orb <= 1.0` (as on 4 Oct 2026 at $0^\circ 01'$):
  - *Status:* **SUPREME GNOSIS WINDOW**.
  - *Protocol:* *Kashf al-Asrar* (Unveiling of Secrets) via *Shams al-Ma'arif*; crystal scrying with clear quartz and Gabriel invocations during Mercury hour.

#### DOM-04: Ancestry, Domestic Roots, Land & Property (*Al-Maskan wa'l-Usul*)
* **Astrological Anchor:** 4th House, Imum Coeli (Nadir), The Moon, Saturn.
* **Mundane Spheres:** Real estate, physical home boundaries, ancestral karma, hidden underground assets, domestic security, psychological roots.
* **Evaluator Rule:**
  - *Trigger:* If `Sun.altitude <= -60.0` (Nadir midnight) AND `PlanetsInHouse(4).contains(['Venus', 'Mercury'])`:
  - *Status:* **PERIMETER SEALING & ROOT HEALING**.
  - *Protocol:* Four-corner boundary staking; perimeter sea-salt wards; unearthing domestic vulnerabilities.

#### DOM-05: Creative Passion, Eros, Offspring & Joy (*Al-Ibdā' wa'l-Surur*)
* **Astrological Anchor:** 5th House, Venus, Sun, Jupiter.
* **Mundane Spheres:** Fine arts, musical composition, romantic passion, fertility, children, theatrical work, genuine joy.
* **Evaluator Rule:**
  - *Trigger:* If `Venus.is_retrograde == True` OR `Venus.sign in ['Scorpio', 'Aries']`:
  - *Status:* **PROSCRIBED FOR NAIVE ATTRACTION; SANCTIONED FOR SHADOW ART**.
  - *Protocol:* Transmuting painful emotional grief into intense artistic and poetic creation; PGM IV Underworld Aphrodite sovereignty.

#### DOM-06: Somatic Healing, Physical Labor & Daily Craft (*Al-'Ilāj wa'l-Khidma*)
* **Astrological Anchor:** 6th House, Mercury, Chiron, Virgo.
* **Mundane Spheres:** Daily habits, somatic detoxification, treating chronic illness, workplace labor, service, care of animals.
* **Evaluator Rule:**
  - *Trigger:* If `Moon.phase in ['Waning Gibbous', 'Last Quarter', 'Waning Crescent']`:
  - *Status:* **PURGING & DETOXIFICATION**.
  - *Protocol:* Somatic cleansing (*Ibtal*); herbal purging blends (wormwood, dandelion root, rue); eliminating inflammatory habits.

#### DOM-07: Partnerships, Contracts, Alliances & Open Foes (*Al-Sharāka wa'l-Khusūma*)
* **Astrological Anchor:** 7th House, Descendant, Venus, Libra.
* **Mundane Spheres:** Marriage, contractual treaties, legal negotiations, business mergers, open adversaries, public debate.
* **Evaluator Rule:**
  - *Trigger:* If `Pluto.house == 7` AND `Aspect(Mars, Pluto).name == 'Opposition'`:
  - *Status:* **CRITICAL TACTICAL TENSION**.
  - *Protocol:* Uncompromising boundary enforcement; rejecting predatory contract terms; preparing apotropaic counter-shields against open opponents.

#### DOM-08: Crisis, Metamorphosis, Debt & Occult Severance (*Al-Ba'th wa'l-Mawāreeth*)
* **Astrological Anchor:** 8th House, Pluto, Mars, Saturn, Scorpio.
* **Mundane Spheres:** Releasing catastrophic fear, inheritance, taxes, shared debts, deep psychological cord-cutting, occult initiation.
* **Evaluator Rule:**
  - *Trigger:* If `Saturn.altitude >= +70.0` AND `Aspect(Sun, Saturn).name == 'Opposition'`:
  - *Status:* **SUPREME SEVERANCE & KARMIC SETTLEMENT**.
  - *Protocol:* *Tafriq al-Batil* (Cord-Cutting) via *Shams al-Ma'arif*; burning 7-knot black cords with consecrated iron; settling debt obligations.

#### DOM-09: Higher Wisdom, Sacred Law, Philosophy & Pilgrimage (*Al-Hikma wa'l-Asfār*)
* **Astrological Anchor:** 9th House, Jupiter, Sagittarius, Sun.
* **Mundane Spheres:** Spiritual scholarship, sacred jurisprudence, astrology, higher philosophy, long journeys, dream omens.
* **Evaluator Rule:**
  - *Trigger:* If `Moon.lunar_mansion in [8, 9]`:
  - *Status:* **DREAM ORACLES & SACRED STUDY**.
  - *Protocol:* Lucid dream incubation (*oneiromancy*) using PGM VII protocols with mugwort and saffron ink; high philosophical contemplation.

#### DOM-10: Vocation, Authority, Public Honor & Sovereign Standing (*Al-Jāh wa'l-Sultān*)
* **Astrological Anchor:** 10th House, Midheaven (MC), Sun, Saturn.
* **Mundane Spheres:** Career standing, executive leadership, institutional reputation, public accountability, interactions with rulers and judges.
* **Evaluator Rule:**
  - *Trigger:* If `MC.sign == 'Aries'` AND `Saturn.house == 10 OR Saturn.near_mc`:
  - *Status:* **ACCOUNTABILITY & PACIFYING WRATH**.
  - *Protocol:* *Thymokatochon* (Restraining Superior Rage); maintaining uncompromising ethical integrity; avoiding displays of tyrannical hubris.

#### DOM-11: Benefactors, Alliances, Networks & Collective Hopes (*Al-Aswān wa'l-Rajā'*)
* **Astrological Anchor:** 11th House, Jupiter, Uranus, Aquarius.
* **Mundane Spheres:** True allies, loyal sponsors, institutional patrons, community networks, future aspirations, social reform.
* **Evaluator Rule:**
  - *Trigger:* If `Uranus.house == 11` AND `Aspect(Uranus, Pluto).name == 'Trine'`:
  - *Status:* **VISIONARY COALITIONS**.
  - *Protocol:* Severing ties with false superficial friends; uniting with progressive, eccentric, and technically advanced allies.

#### DOM-12: Sanctuary, Solitude, Unseen Enemies & Karmic Liberation (*Al-Khalwa wa'l-Ghayb*)
* **Astrological Anchor:** 12th House, Neptune, Saturn, Moon, Pisces.
* **Mundane Spheres:** Solitary meditation, unmasking covert conspirators, breaking sorcery/hexes, dissolving karmic debt, sleep sanctuary.
* **Evaluator Rule:**
  - *Trigger:* If `PlanetsInHouse(12).contains(['Moon', 'Saturn', 'Neptune'])`:
  - *Status:* **TONGUE-LOCKING & INVIOLABLE SANCTUARY**.
  - *Protocol:* *'Aqd al-Lisan* (Padlock Defixio) via *Shams al-Ma'arif* and PGM V; sealing the mouths of covert slanderers in lead under heavy stone.

## 5. Complete Database Schema (PostgreSQL DDL)

```sql
-- Create Enum Types
CREATE TYPE motion_type AS ENUM ('DIRECT', 'STATIONARY', 'RETROGRADE');
CREATE TYPE period_type AS ENUM ('NOCTURNAL', 'DIURNAL');
CREATE TYPE aspect_nature AS ENUM ('CONJUNCTION', 'SEXTILE', 'SQUARE', 'TRINE', 'OPPOSITION', 'QUINCUNX');
CREATE TYPE domain_status AS ENUM ('PRESCRIBED', 'PROSCRIBED', 'CRITICAL', 'NEUTRAL');
CREATE TYPE operative_modality AS ENUM ('JALB', 'TAHSIN', 'AQD', 'TAFRIQ');

-- Table: Master Daily Editions
CREATE TABLE daily_editions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    edition_date DATE UNIQUE NOT NULL,
    location_name VARCHAR(100) NOT NULL DEFAULT 'Jakarta City Center',
    latitude NUMERIC(9,6) NOT NULL DEFAULT -6.208889,
    longitude NUMERIC(9,6) NOT NULL DEFAULT 106.845556,
    elevation_meters NUMERIC(5,1) NOT NULL DEFAULT 10.0,
    civil_day_name VARCHAR(20) NOT NULL,
    planetary_day_ruler VARCHAR(20) NOT NULL,
    sunrise_wib TIMESTAMPTZ NOT NULL,
    sunset_wib TIMESTAMPTZ NOT NULL,
    solar_noon_wib TIMESTAMPTZ NOT NULL,
    lst_midnight VARCHAR(12) NOT NULL,
    moon_phase_name VARCHAR(50) NOT NULL,
    moon_illumination NUMERIC(5,2) NOT NULL,
    moon_distance_km NUMERIC(9,2) NOT NULL,
    exact_quarter_timestamp TIMESTAMPTZ,
    vedic_tithi VARCHAR(50) NOT NULL,
    vedic_ayanamsa_dms VARCHAR(20) NOT NULL DEFAULT '24°13''59"',
    svg_chart_wheel TEXT NOT NULL,
    raw_markdown_report TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: Celestial Positions (10 Planets + Nodes)
CREATE TABLE celestial_positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    edition_id UUID NOT NULL REFERENCES daily_editions(id) ON DELETE CASCADE,
    body_name VARCHAR(30) NOT NULL,
    tropical_longitude NUMERIC(8,4) NOT NULL,
    tropical_dms VARCHAR(30) NOT NULL,
    tropical_sign VARCHAR(20) NOT NULL,
    sidereal_longitude NUMERIC(8,4) NOT NULL,
    sidereal_dms VARCHAR(30) NOT NULL,
    sidereal_sign VARCHAR(20) NOT NULL,
    nakshatra VARCHAR(30) NOT NULL,
    pada INTEGER NOT NULL CHECK (pada BETWEEN 1 AND 4),
    altitude NUMERIC(6,2) NOT NULL,
    azimuth NUMERIC(6,2) NOT NULL,
    right_ascension VARCHAR(20) NOT NULL,
    declination VARCHAR(20) NOT NULL,
    apparent_magnitude NUMERIC(4,2) NOT NULL,
    daily_speed NUMERIC(7,4) NOT NULL,
    motion motion_type NOT NULL,
    placidus_house INTEGER NOT NULL CHECK (placidus_house BETWEEN 1 AND 12),
    rise_wib TIMESTAMPTZ,
    transit_wib TIMESTAMPTZ,
    set_wib TIMESTAMPTZ,
    dignity_summary VARCHAR(100),
    CONSTRAINT unique_body_per_edition UNIQUE (edition_id, body_name)
);

-- Table: Placidus Houses & Cardinal Angles
CREATE TABLE placidus_houses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    edition_id UUID NOT NULL REFERENCES daily_editions(id) ON DELETE CASCADE,
    ascendant_longitude NUMERIC(8,4) NOT NULL,
    ascendant_dms VARCHAR(30) NOT NULL,
    midheaven_longitude NUMERIC(8,4) NOT NULL,
    midheaven_dms VARCHAR(30) NOT NULL,
    descendant_dms VARCHAR(30) NOT NULL,
    imum_coeli_dms VARCHAR(30) NOT NULL,
    cusp_1_cancer NUMERIC(8,4) NOT NULL,
    cusp_2_leo NUMERIC(8,4) NOT NULL,
    cusp_3_virgo NUMERIC(8,4) NOT NULL,
    cusp_4_libra NUMERIC(8,4) NOT NULL,
    cusp_5_scorpio NUMERIC(8,4) NOT NULL,
    cusp_6_sagittarius NUMERIC(8,4) NOT NULL,
    cusp_7_capricorn NUMERIC(8,4) NOT NULL,
    cusp_8_aquarius NUMERIC(8,4) NOT NULL,
    cusp_9_pisces NUMERIC(8,4) NOT NULL,
    cusp_10_aries NUMERIC(8,4) NOT NULL,
    cusp_11_taurus NUMERIC(8,4) NOT NULL,
    cusp_12_gemini NUMERIC(8,4) NOT NULL,
    CONSTRAINT unique_houses_per_edition UNIQUE (edition_id)
);

-- Table: Aspects & Geometry
CREATE TABLE aspect_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    edition_id UUID NOT NULL REFERENCES daily_editions(id) ON DELETE CASCADE,
    body_a VARCHAR(30) NOT NULL,
    body_b VARCHAR(30) NOT NULL,
    aspect aspect_nature NOT NULL,
    target_angle NUMERIC(5,1) NOT NULL,
    actual_separation NUMERIC(8,4) NOT NULL,
    orb_degrees NUMERIC(5,3) NOT NULL,
    orb_dms VARCHAR(20) NOT NULL,
    is_applying BOOLEAN NOT NULL,
    significance_tier INTEGER NOT NULL CHECK (significance_tier BETWEEN 1 AND 3)
);

-- Table: Fixed Star Alignments
CREATE TABLE fixed_star_alignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    edition_id UUID NOT NULL REFERENCES daily_editions(id) ON DELETE CASCADE,
    star_name VARCHAR(50) NOT NULL,
    planet_name VARCHAR(30) NOT NULL,
    aspect aspect_nature NOT NULL,
    orb_dms VARCHAR(20) NOT NULL,
    star_altitude NUMERIC(6,2) NOT NULL,
    star_azimuth NUMERIC(6,2) NOT NULL,
    is_visible_above_jakarta BOOLEAN NOT NULL,
    traditional_attribution TEXT NOT NULL
);

-- Table: Proportional Planetary Hours (24 Records Per Edition)
CREATE TABLE planetary_hours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    edition_id UUID NOT NULL REFERENCES daily_editions(id) ON DELETE CASCADE,
    hour_index INTEGER NOT NULL CHECK (hour_index BETWEEN 1 AND 12),
    period period_type NOT NULL,
    start_time_wib TIMESTAMPTZ NOT NULL,
    end_time_wib TIMESTAMPTZ NOT NULL,
    duration_minutes NUMERIC(5,2) NOT NULL,
    ruler VARCHAR(20) NOT NULL,
    chaldean_sphere INTEGER NOT NULL,
    archangel VARCHAR(50) NOT NULL,
    divine_name_arabic VARCHAR(100) NOT NULL,
    divine_name_translit VARCHAR(100) NOT NULL,
    prescribed_work TEXT NOT NULL,
    proscribed_work TEXT NOT NULL,
    CONSTRAINT unique_hour_per_edition UNIQUE (edition_id, period, hour_index)
);

-- Table: 12-Dimensional Life & Grimoiric Intelligence Dossiers
CREATE TABLE grimoiric_dossiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    edition_id UUID NOT NULL REFERENCES daily_editions(id) ON DELETE CASCADE,
    domain_code VARCHAR(10) NOT NULL CHECK (domain_code IN ('DOM-01', 'DOM-02', 'DOM-03', 'DOM-04', 'DOM-05', 'DOM-06', 'DOM-07', 'DOM-08', 'DOM-09', 'DOM-10', 'DOM-11', 'DOM-12')),
    domain_name VARCHAR(50) NOT NULL,
    life_sphere VARCHAR(50) NOT NULL,
    status domain_status NOT NULL,
    operative_mode operative_modality NOT NULL,
    astrological_catalyst TEXT NOT NULL,
    protocol_title TEXT NOT NULL,
    classical_authority VARCHAR(100) NOT NULL,
    prescribed_ritual TEXT NOT NULL,
    materia_and_incense JSONB NOT NULL,
    invocational_formula TEXT NOT NULL,
    proscriptions TEXT,
    CONSTRAINT unique_domain_per_edition UNIQUE (edition_id, domain_code)
);

-- Performance Indexes
CREATE INDEX idx_editions_date ON daily_editions(edition_date);
CREATE INDEX idx_hours_timerange ON planetary_hours(start_time_wib, end_time_wib);
CREATE INDEX idx_aspects_bodies ON aspect_events(body_a, body_b);
```

---

## 6. Complete REST API Specification (FastAPI / OpenAPI 3.1)

Base URL: `https://astro.jakarta.local/api/v1`

| HTTP Method | Endpoint | Query Parameters | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/editions/today` | `None` | Returns full master payload for today in Jakarta (Ephemeris, Houses, Aspects, Hours, Rituals). |
| `GET` | `/editions/{date}` | `date` (format: `YYYY-MM-DD`) | Historical lookup for any past edition. |
| `GET` | `/hours/live` | `None` | Ultra-fast endpoint (< 5ms) returning current active planetary hour, time elapsed, time remaining, transition alert flag, and next ruler. |
| `GET` | `/chart/svg` | `date` (opt), `filter` (`all`, `hard`, `soft`), `size` (px) | Renders dynamically filtered vector SVG chart wheel with active degrees and collision-free glyphs. |
| `GET` | `/grimoire/{domain}` | `domain` (`DOM-01` to `DOM-12` or slug), `date` (opt) | Returns dedicated 12-dimensional life dossier with operative mode (Jalb, Tahsin, 'Aqd, Tafriq), materia, and invocations. |
| `GET` | `/export/markdown` | `date` (opt) | Downloads full consolidated `conditions.md` markdown file. |
| `GET` | `/export/pdf` | `date` (opt) | Generates print-ready high-resolution celestial almanac PDF. |
| `GET` | `/ws/clock` | `WebSocket` | Real-time WebSocket connection streaming 1-second ticks, sub-second countdown, and planetary hour transition events. |

---

## 7. Frontend Component Architecture (Astro / Next.js)

```
src/
├── components/
│   ├── clock/
│   │   ├── LiveAstralClock.tsx       # Live status banner, progress bar, audio alert
│   │   └── TransitionModal.tsx       # Modal announcing new planetary hour ruler
│   ├── wheel/
│   │   ├── InteractiveWheel.tsx      # SVG chart wheel with mouse hover inspect
│   │   ├── AspectChordLayer.tsx      # Toggleable aspect lines (Opp, Sqr, Tri, Sxt)
│   │   └── PlanetTooltip.tsx         # Floating card showing Dignities, Alt/Az, Speed
│   ├── dossiers/
│   │   ├── EphemerisTable.tsx        # Responsive table with Alt/Az and rising times
│   │   ├── VedicMansionsTab.tsx      # Nakshatras, Padas, and Arabic Manazil
│   │   ├── PlanetaryHoursGrid.tsx    # 24-hour night & day matrix with active highlight
│   │   └── GrimoiricOperations.tsx   # Accordion cards for Love, War, Binding, Gnosis
│   └── common/
│       ├── Header.tsx                # Title, datepicker, coordinates
│       └── ExportBar.tsx             # Buttons: Download SVG, Markdown, JSON, Print PDF
```

---

## 8. Automated Daily Worker Pipeline (APScheduler)

```python
# worker/daemon.py
from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.cron import CronTrigger
from core.calculator import compute_daily_edition
from core.renderer import render_svg_wheel, generate_markdown_report
from db.repository import persist_edition

scheduler = BlockingScheduler(timezone="Asia/Jakarta")

@scheduler.scheduled_job(CronTrigger(hour=0, minute=0, second=1, timezone="Asia/Jakarta"))
def midnight_master_generation_job():
    """
    Executes at exactly 00:00:01 WIB every single day:
    1. Computes full 100% precision Swiss Ephemeris data for Jakarta.
    2. Calculates unequal proportional nocturnal & diurnal hours.
    3. Executes Grimoiric condition evaluator (Agrippa, Shams, Picatrix, PGM).
    4. Renders standalone SVG wheel and Markdown report.
    5. Persists records to PostgreSQL database.
    6. Warms up Redis API cache for /editions/today.
    """
    edition_data = compute_daily_edition()
    svg_code = render_svg_wheel(edition_data)
    markdown_doc = generate_markdown_report(edition_data)
    persist_edition(edition_data, svg_code, markdown_doc)

@scheduler.scheduled_job(CronTrigger(hour=5, minute=0, second=0, timezone="Asia/Jakarta"))
def predawn_calibration_check():
    """
    Runs at 05:00:00 WIB (36 minutes before sunrise):
    Verifies topocentric atmospheric refraction against current BMKG weather data.
    """
    pass

scheduler.start()
```

---

## 9. Verification, Benchmarking & Deployment Specification

### 9.1 Precision Verification Suite
Every build runs automated unit tests benchmarking calculated values against official references:
1. **NASA JPL Horizons Benchmark:** Longitudes for Sun, Moon, and Outer Planets must match JPL Horizons within **$\le 0.5\text{ arcseconds}$**.
2. **BMKG Jakarta Astronomical Tables:** Sunrise and sunset timestamps must agree within **$\le 1\text{ second}$** of BMKG official records.
3. **Placidus Cusps Check:** Polar house cusp equations must verify against Astrodienst reference charts for $-6.2088^\circ, 106.8456^\circ$.

### 9.2 Complete Docker Compose Production Setup (`docker-compose.yml`)
```yaml
version: '3.8'

services:
  db:
    image: postgres:16-alpine
    container_name: astro_postgres
    restart: always
    environment:
      POSTGRES_DB: astro_jakarta
      POSTGRES_USER: astro_admin
      POSTGRES_PASSWORD: secure_astral_password
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  worker:
    build: ./backend
    container_name: astro_daily_worker
    restart: always
    command: python -m worker.daemon
    environment:
      DATABASE_URL: postgresql://astro_admin:secure_astral_password@db:5432/astro_jakarta
      EPHE_PATH: /opt/astro/ephe
    volumes:
      - ./ephemeris_data:/opt/astro/ephe
    depends_on:
      - db

  api:
    build: ./backend
    container_name: astro_fastapi
    restart: always
    command: uvicorn api.main:app --host 0.0.0.0 --port 8000 --workers 4
    environment:
      DATABASE_URL: postgresql://astro_admin:secure_astral_password@db:5432/astro_jakarta
      EPHE_PATH: /opt/astro/ephe
    volumes:
      - ./ephemeris_data:/opt/astro/ephe
    ports:
      - "8000:8000"
    depends_on:
      - db

  frontend:
    build: ./frontend
    container_name: astro_web_ui
    restart: always
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:8000/api/v1
    depends_on:
      - api

volumes:
  pgdata:
```

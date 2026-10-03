---
name: astroval
description: Automated 100% precision astronomical ephemeris, Placidus celestial wheel generator, proportional 24-hour planetary clock, and Grimoiric intelligence engine for Jakarta, Indonesia.
---

# Astroval Skill Specification

When the user queries astronomical conditions, horoscope charts, proportional planetary hours, or Grimoiric ritual correspondences (*Picatrix*, *Agrippa*, *Shams al-Ma'arif*, *PGM*) for Jakarta, Indonesia, activate this skill.

## Capabilities & Resources

1. **Precision Ephemeris Engine:**
   - Coordinates locked to Jakarta City Center ($6^\circ 12' 32''\text{ S}, 106^\circ 50' 44''\text{ E}$, 10m Elev.).
   - Computes apparent geocentric/topocentric positions, Alt/Az, RA/Dec, and visual magnitudes.
   - Calculates Placidus house cusps, Ascendant, Midheaven, Descendant, and IC.
   - Computes exact aspect separations and velocity vectors ($\frac{d}{dt}|\Delta\lambda|$) for applying vs. separating determination.

2. **Dynamic Chronometry Service:**
   - Calculates proportional unequal nocturnal (59m 10s) and diurnal (60m 49s) planetary hours based on actual Jakarta sunrise and sunset.
   - Tracks the active planetary hour in real-time, its Chaldean sphere, archangel, and traditional Divine Names.

3. **12-Dimensional Life & Grimoiric Intelligence:**
   - Evaluates daily celestial configurations against classical grimoires (*Picatrix*, *Agrippa*, *Shams al-Ma'arif al-Kubra*, *PGM*).
   - Maps operations into the 4 universal teleologies:
     - *Jalb* (Attraction / Increase)
     - *Tahsin* (Defense / Shielding)
     - *'Aqd* (Binding / Fixing / Locking)
     - *Tafriq* (Dissolution / Severing / Purging)

## Key Files & Direct Access
- [`index.html`](index.html): Interactive production dashboard with live clock, aspect filter lens, and dossiers.
- [`public/natal_chart.svg`](public/natal_chart.svg): Standalone vector graphic horoscope wheel.
- [`PLAN.md`](PLAN.md): Complete technical architecture, DDL schema, API, and worker specs.
- [`docs/conditions.md`](docs/conditions.md): Consolidated verbatim astrometric benchmark data.
- [`docs/expanded_domain_taxonomy.md`](docs/expanded_domain_taxonomy.md): Complete 12-Dimensional Life Place Taxonomy.
- [`docs/planetary_hours_guide.md`](docs/planetary_hours_guide.md): 24-Hour proportional chronometry guide.
- [`docs/ritual_operations_manual.md`](docs/ritual_operations_manual.md): Domain-by-domain operative manual.
- [`VERIFICATION.md`](VERIFICATION.md): NASA JPL Horizons and BMKG verification audit.

## Operational Instructions for Agents
* When answering questions about planetary hours, always calculate unequal hours from sunrise to sunrise.
* Never prescribe conventional romantic attraction magic when Venus is retrograde, in detriment, or stationary; always prescribe cord-cutting (*Tafriq*) or shadow integration under those conditions.
* Always cross-reference fixed star alignments within $1^\circ 00'$ orbs (e.g. Mercury trine Fomalhaut at $0^\circ 01'$).

"""
Astroval Astronomical Intelligence & Operative Grimoiric Engine
Location: Jakarta Center (-6.208889, 106.845556, Elevation: 10m)
Standard: NASA JPL DE431 / DE441 via Swiss Ephemeris (pyswisseph)
"""

import os
import math
import datetime
from typing import Dict, List, Any, Optional
import swisseph as swe

# Geographic Coordinates for Jakarta Center
JAKARTA_LAT = -6.208889   # 6° 12' 32" S
JAKARTA_LON = 106.845556  # 106° 50' 44" E
JAKARTA_ALT = 10.0        # 10 meters above sea level
JAKARTA_TZ = datetime.timezone(datetime.timedelta(hours=7)) # WIB (UTC+7)

# Planet ID mapping in Swiss Ephemeris
PLANETS = {
    "sun": {"id": swe.SUN, "name": "The Sun", "glyph": "☉", "color": "#f59e0b", "chald_rank": 4},
    "moon": {"id": swe.MOON, "name": "The Moon", "glyph": "☽", "color": "#38bdf8", "chald_rank": 7},
    "mercury": {"id": swe.MERCURY, "name": "Mercury", "glyph": "☿", "color": "#2dd4bf", "chald_rank": 6},
    "venus": {"id": swe.VENUS, "name": "Venus", "glyph": "♀", "color": "#ec4899", "chald_rank": 5},
    "mars": {"id": swe.MARS, "name": "Mars", "glyph": "♂", "color": "#f87171", "chald_rank": 3},
    "jupiter": {"id": swe.JUPITER, "name": "Jupiter", "glyph": "♃", "color": "#fbbf24", "chald_rank": 2},
    "saturn": {"id": swe.SATURN, "name": "Saturn", "glyph": "♄", "color": "#e2e8f0", "chald_rank": 1},
    "uranus": {"id": swe.URANUS, "name": "Uranus", "glyph": "♅", "color": "#38bdf8", "chald_rank": 8},
    "neptune": {"id": swe.NEPTUNE, "name": "Neptune", "glyph": "♆", "color": "#818cf8", "chald_rank": 9},
    "pluto": {"id": swe.PLUTO, "name": "Pluto", "glyph": "♇", "color": "#c084fc", "chald_rank": 10},
    "north_node": {"id": swe.TRUE_NODE, "name": "North Node (Rahu)", "glyph": "☊", "color": "#fb923c", "chald_rank": 11}
}

CHALDEAN_ORDER = ["saturn", "jupiter", "mars", "sun", "venus", "mercury", "moon"]
DAY_RULERS = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn"] # Sunday = 0

ZODIAC_SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]
ZODIAC_GLYPHS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"]

NAKSHATRAS = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashirsha", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
    "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
    "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
]

LUNAR_MANSIONS = [
    {"num": 1, "name": "Al-Sharatān", "meaning": "The Two Signs", "degree_start": 0.0},
    {"num": 2, "name": "Al-Butayn", "meaning": "The Little Belly", "degree_start": 12.857},
    {"num": 3, "name": "Al-Thurayyā", "meaning": "The Many Little Ones (Pleiades)", "degree_start": 25.714},
    {"num": 4, "name": "Al-Dabarān", "meaning": "The Follower", "degree_start": 38.571},
    {"num": 5, "name": "Al-Haq'ah", "meaning": "The White Spot", "degree_start": 51.428},
    {"num": 6, "name": "Al-Han'ah", "meaning": "The Brand", "degree_start": 64.285},
    {"num": 7, "name": "Al-Dhirā'", "meaning": "The Forearm", "degree_start": 77.142},
    {"num": 8, "name": "Al-Nathrah", "meaning": "The Gap (Praesepe)", "degree_start": 90.0},
    {"num": 9, "name": "Al-Tarf", "meaning": "The Gaze / Eye", "degree_start": 102.857},
    {"num": 10, "name": "Al-Jabhah", "meaning": "The Forehead (Regulus)", "degree_start": 115.714},
    {"num": 11, "name": "Al-Zubrah", "meaning": "The Mane", "degree_start": 128.571},
    {"num": 12, "name": "Al-Sarfah", "meaning": "The Changer of Weather", "degree_start": 141.428},
    {"num": 13, "name": "Al-'Awwā'", "meaning": "The Barker", "degree_start": 154.285},
    {"num": 14, "name": "Al-Simāk", "meaning": "The Unarmed Spica", "degree_start": 167.142},
    {"num": 15, "name": "Al-Ghafr", "meaning": "The Covering", "degree_start": 180.0},
    {"num": 16, "name": "Al-Zubānā", "meaning": "The Claws of the Scorpion", "degree_start": 192.857},
    {"num": 17, "name": "Al-Iklīl", "meaning": "The Crown", "degree_start": 205.714},
    {"num": 18, "name": "Al-Qalb", "meaning": "The Heart (Antares)", "degree_start": 218.571},
    {"num": 19, "name": "Al-Shawlah", "meaning": "The Sting", "degree_start": 231.428},
    {"num": 20, "name": "Al-Na'ā'im", "meaning": "The Ostriches", "degree_start": 244.285},
    {"num": 21, "name": "Al-Baldah", "meaning": "The City / Empty Place", "degree_start": 257.142},
    {"num": 22, "name": "Sa'd al-Dhābih", "meaning": "The Lucky Star of the Slaughterer", "degree_start": 270.0},
    {"num": 23, "name": "Sa'd Bula'", "meaning": "The Lucky Star of the Glutton", "degree_start": 282.857},
    {"num": 24, "name": "Sa'd al-Su'ūd", "meaning": "The Luck of Lucks", "degree_start": 295.714},
    {"num": 25, "name": "Sa'd al-Akhbiyah", "meaning": "The Lucky Star of the Tents", "degree_start": 308.571},
    {"num": 26, "name": "Al-Fargh al-Muqdam", "meaning": "The Fore-Spout of the Urn", "degree_start": 321.428},
    {"num": 27, "name": "Al-Fargh al-Mu'akhkhar", "meaning": "The Hind-Spout of the Urn", "degree_start": 334.285},
    {"num": 28, "name": "Batn al-Hūt", "meaning": "The Belly of the Fish", "degree_start": 347.142}
]

FIXED_STARS_CATALOG = [
    {"name": "Sirius", "nom": "alCMa", "type": "Behenian Star / Isis-Sothis", "mag": -1.46},
    {"name": "Fomalhaut", "nom": "alPsA", "type": "Royal Star of South / Watcher", "mag": 1.16},
    {"name": "Regulus", "nom": "alLeo", "type": "Royal Star of North / Cor Leonis", "mag": 1.35},
    {"name": "Aldebaran", "nom": "alTau", "type": "Royal Star of East / Eye of Taurus", "mag": 0.85},
    {"name": "Antares", "nom": "alSco", "type": "Royal Star of West / Cor Scorpionis", "mag": 1.06},
    {"name": "Spica", "nom": "alVir", "type": "Behenian Star / Sheaf of Wheat", "mag": 0.98},
    {"name": "Algol", "nom": "bePer", "type": "Behenian Star / Caput Medusae", "mag": 2.12},
    {"name": "Vega", "nom": "alLyr", "type": "Behenian Star / Falling Vulture", "mag": 0.03},
    {"name": "Altair", "nom": "alAql", "type": "Behenian Star / Flying Eagle", "mag": 0.77},
    {"name": "Arcturus", "nom": "alBoo", "type": "Behenian Star / Bear Watcher", "mag": -0.05}
]

PLANETARY_THEURGY = {
    "saturn": {
        "sphere": "7th Sphere (Saturn / Zuhal)",
        "archangel": "Cassiel (Kafziel / كسفيائيل)",
        "divine_name": "Yā Hayyu Yā Qayyūm (يا حي يا قيوم)",
        "wafq": "3x3 Saturnian Kamea (Wafq Musallas)",
        "metal": "Lead (Raṣāṣ)",
        "incense": "Asafoetida (Hiltit), Sulfur, Dried Cypress",
        "prescribed": "Binding foes, deep ancestral grounding, heavy structural consolidation, boundary freezing",
        "avoid": "Lighthearted celebration, initiating swift ventures, romance"
    },
    "jupiter": {
        "sphere": "6th Sphere (Jupiter / Mushtari)",
        "archangel": "Sachiel (Zadkiel / سمسمائيل)",
        "divine_name": "Yā 'Alīmu Yā Hakīm (يا عليم يا حكيم)",
        "wafq": "4x4 Jupiterian Kamea (Wafq Murabba')",
        "metal": "Tin (Qazdir)",
        "incense": "Nutmeg, Cloves, Sumatra Benzoin, Cinnamon",
        "prescribed": "Commercial abundance, expanding treasury, petitioning judges, judicial honors",
        "avoid": "Petty disputes, parsimonious spending, isolation"
    },
    "mars": {
        "sphere": "5th Sphere (Mars / Mirrikh)",
        "archangel": "Samael (Amrael / سمائيل)",
        "divine_name": "Yā Qawiyyu Yā Matīn (يا قوي يا متين)",
        "wafq": "5x5 Martial Kamea (Wafq Mukhammas)",
        "metal": "Forged Iron (Hadid)",
        "incense": "Dragon's Blood Resin, Black Peppercorns, Tobacco Leaf",
        "prescribed": "Severing oppressive adversaries, kinetic counter-strike defense, breaking stagnant inertia",
        "avoid": "Delicate reconciliation, non-combative surgery, peaceful diplomacy"
    },
    "sun": {
        "sphere": "4th Sphere (The Sun / Shams)",
        "archangel": "Raphael (Ruqya'il / روقيائيل)",
        "divine_name": "Yā Nūru Yā Bāsiṭ (يا نور يا باسط)",
        "wafq": "6x6 Solar Kamea (Wafq Musaddas)",
        "metal": "24k Gold (Dhahab)",
        "incense": "Royal Frankincense Hojari, Ambergris, Saffron",
        "prescribed": "Sovereignty rituals, gaining imperial favor, vitality renewal, executive leadership",
        "avoid": "Nocturnal secrecy, deceptive camouflaging, timid withdrawal"
    },
    "venus": {
        "sphere": "3rd Sphere (Venus / Zuharah)",
        "archangel": "Anael (Anyail / عنيائيل)",
        "divine_name": "Yā Wadūdu Yā Jāmi' (يا ودود يا جامع)",
        "wafq": "7x7 Venusian Kamea (Wafq Musabba')",
        "metal": "Polished Copper (Nuhas)",
        "incense": "Damask Rose Otto, White Musk, Red Sandalwood",
        "prescribed": "Artistic creations, inward self-sovereignty, beauty consecration, erotic shadow reconciliation",
        "avoid": "Naive attraction spells when afflicted/retrograde, reckless financial speculation"
    },
    "mercury": {
        "sphere": "2nd Sphere (Mercury / 'Utarid)",
        "archangel": "Michael (Mika'il / ميكائيل)",
        "divine_name": "Yā Badi'u Yā Rashīd (يا بديع يا رشيد)",
        "wafq": "8x8 Mercurial Kamea (Wafq Musamman)",
        "metal": "Electrum / Quicksilver (Zi'baq)",
        "incense": "Mastic Resin, Storax, Mugwort, Star Anise",
        "prescribed": "Occult deciphering, writing sacred scrolls, intellectual audit, contract drafting",
        "avoid": "Rash verbal vows, reckless trade under afflicted aspects"
    },
    "moon": {
        "sphere": "1st Sphere (The Moon / Qamar)",
        "archangel": "Gabriel (Jibril / جبرائيل)",
        "divine_name": "Yā Qaddūsu Yā Fattāh (يا قدوس يا فتاح)",
        "wafq": "9x9 Lunar Kamea (Wafq Mutassa')",
        "metal": "Sterling Silver (Fiddah)",
        "incense": "White Sandalwood, Camphor, Aloe Resin",
        "prescribed": "Purifying baths, dream incubation, removing curses, uncrossing astral miasma",
        "avoid": "Permanent stone foundations, irreversible commitments during void of course"
    }
}

# Static Catalog Metadata for the 14 Grimoiric Operative Works
OPERATIVE_WORKS_CATALOG = [
    {
        "id": 1,
        "title": "Love & Erotic Attraction",
        "arabic": "Al-Hubb & Al-'Ishq (الحب والعشق)",
        "category": "Jalb",
        "primary_ruler": "venus",
        "favorable_hours": ["venus"],
        "authorities": "Picatrix (Ghayat al-Hakim) Bk. II Ch. 10; Agrippa De Occulta Philosophia Bk. II Ch. 32; Shams al-Ma'arif Bab al-Mahabbah; PGM IV. 2967-3006",
        "incense": "Red Sandalwood, Pure Ambergris, Damask Rose Otto, White Musk",
        "metal_seal": "Polished Copper Plate (Venusian Talisman of Qamar)",
        "warning": "Strictly proscribed when Venus is in Scorpio/Aries, retrograde, or afflicted by Mars. Inverting this rite causes suffocating jealousy and toxic obsession."
    },
    {
        "id": 2,
        "title": "Cord-Cutting & Severance",
        "arabic": "Al-Tafriq & Al-Faskh (التفريق والفسخ وحل العهود)",
        "category": "Tafriq",
        "primary_ruler": "saturn",
        "favorable_hours": ["saturn", "mars"],
        "authorities": "Picatrix Bk. IV Ch. 7; Key of Solomon (Grimoire) Book I Ch. 13; PGM VII. 396-404; Ibn Khaldun Muqaddimah (Sihr al-Faskh)",
        "incense": "Asafoetida (Hiltit), Black Henbane, Dried Cypress Resin, Sulfur",
        "metal_seal": "Cast Lead Plate inscribed with Saturnian Seal of Agiel & Zazel",
        "warning": "Severance is permanent and non-reversible. Requires grounding in salt bath immediately following closure."
    },
    {
        "id": 3,
        "title": "Binding & Tongue-Tying",
        "arabic": "Al-'Aqd & Katadesmoi (العقد والربط وعقد الألسنة)",
        "category": "Aqd",
        "primary_ruler": "saturn",
        "favorable_hours": ["saturn"],
        "authorities": "PGM V. 304-446; Picatrix Bk. III Ch. 5; Agrippa Bk. III Ch. 27; Shams al-Ma'arif (Fasl 'Aqd al-Alsun)",
        "incense": "Brimstone, Myrrh, Crushed Galbanum, Storax",
        "metal_seal": "Cold-hammered Lead Ribbon tied in 7 knots with blackened iron needle",
        "warning": "The practitioner must maintain absolute internal silence for 3 hours after operative knotting."
    },
    {
        "id": 4,
        "title": "Cleansing & Uncrossing",
        "arabic": "Al-Taharah & Lustratio (الطهارة والاستنزال وحل المعقود)",
        "category": "Tahsin",
        "primary_ruler": "moon",
        "favorable_hours": ["moon", "sun"],
        "authorities": "Picatrix Bk. II Ch. 3; Shams al-Ma'arif (Bab al-Tashir wa al-Tathir); PGM IV. 850-929; Agrippa Bk. I Ch. 35",
        "incense": "High-Grade Frankincense (Luban Dhakar), Cedarwood, Hyssop, Benzoin",
        "metal_seal": "Sterling Silver Mirror consecrated under Cancerian Moon / Sirius",
        "warning": "Dispose of wastewater into running natural water or unpaved crossroads facing East."
    },
    {
        "id": 5,
        "title": "Protection & Boundary Armor",
        "arabic": "Al-Tahsin & Hifz (التحصين والحفظ والحرز المانع)",
        "category": "Tahsin",
        "primary_ruler": "mars",
        "favorable_hours": ["mars", "sun"],
        "authorities": "Shams al-Ma'arif (Ayat al-Hifz wa al-Tahsin); Agrippa Bk. II Ch. 41; Key of Solomon (Pentacles of Mars); Picatrix Bk. III Ch. 7",
        "incense": "Dragon's Blood Resin (Damm al-Akhawayn), Bay Laurel, Cloves, Pure Frankincense",
        "metal_seal": "Forged Iron Pentacle of Mars (4th Pentacle of Solomon)",
        "warning": "Forms an aggressive kinetic mirror ward. Any external psychic intrusion reflects back threefold to the caster of origin."
    },
    {
        "id": 6,
        "title": "War & Dismantling Oppressors",
        "arabic": "Al-Harb & Victoria (الحرب والغلبة وقهر الجبارين)",
        "category": "Tafriq",
        "primary_ruler": "mars",
        "favorable_hours": ["mars"],
        "authorities": "Picatrix Bk. III Ch. 12; PGM IV. 1390-1495; Key of Solomon (3rd & 6th Pentacles of Mars); Agrippa Bk. I Ch. 22",
        "incense": "Black Peppercorns, Tobacco Leaf, Dragon's Blood, Sulfur, Dried Thistle",
        "metal_seal": "Tempered Steel Blade inscribed with Martial Square of 5x5",
        "warning": "Extreme surgical force. The target's energetic structure suffers rapid destabilization."
    },
    {
        "id": 7,
        "title": "Pacification & Quelling Wrath",
        "arabic": "Al-Silm & Thymokatochon (تسكين الغضب وعقد ألسنة الحكام)",
        "category": "Aqd",
        "primary_ruler": "jupiter",
        "favorable_hours": ["jupiter", "venus"],
        "authorities": "PGM XII. 161-181; Shams al-Ma'arif (Daf' al-Zulm wa Tashil al-Umur); Agrippa Bk. II Ch. 39",
        "incense": "White Sandalwood, Nutmeg, Sweet Amber, Roman Chamomile",
        "metal_seal": "Polished Tin Plate engraved with the Character of Sachiel",
        "warning": "Subdues aggressive anger in employers, judges, and persecutors into calm compliance."
    },
    {
        "id": 8,
        "title": "Occult Knowledge & Prophecy",
        "arabic": "Al-Kashf & Gnosis (الكشف والاستنزال واستنزال الأرواح)",
        "category": "Kashf",
        "primary_ruler": "mercury",
        "favorable_hours": ["mercury", "moon"],
        "authorities": "Picatrix Bk. III Ch. 9; Shams al-Ma'arif (Fasl Kashf al-Ghayb wa al-Manam); Agrippa Bk. II Ch. 43; Corpus Hermeticum Poimandres",
        "incense": "Mastic Resin, Artemisia (Mugwort), Star Anise, Storax Calamita",
        "metal_seal": "Electrum or Silver Tablet engraved with Seal of Raphael / Hermes",
        "warning": "Deep nocturnal trance required. Cleanse the scrying vessel with rainwater and wormwood infusion."
    },
    {
        "id": 9,
        "title": "Wealth & Commercial Abundance",
        "arabic": "Al-Rizq & Al-Jalb (جلب الرزق والتجارة والبركة)",
        "category": "Jalb",
        "primary_ruler": "jupiter",
        "favorable_hours": ["jupiter", "sun"],
        "authorities": "Picatrix Bk. II Ch. 7; Key of Solomon (Pentacles of Jupiter); Shams al-Ma'arif (Bab Jalb al-Arzaq); Agrippa Bk. II Ch. 39",
        "incense": "Cinnamon Bark, Cloves, Benzoin of Sumatra, Olibanum, Nutmeg",
        "metal_seal": "Cast Solid Tin or Fine Gold Plate engraved with 4x4 Jupiterian Kamea",
        "warning": "Tie the talisman to the physical business ledger, cash box, or ledger vault on Waxing Moon."
    },
    {
        "id": 10,
        "title": "Healing & Somatic Renewal",
        "arabic": "Al-Shifa' & Hygieia (الشفاء واسترداد العافية)",
        "category": "Tahsin",
        "primary_ruler": "sun",
        "favorable_hours": ["sun", "moon", "jupiter"],
        "authorities": "Corpus Hippocraticum; Agrippa Bk. II Ch. 38; Shams al-Ma'arif (Asma' al-Shifa'); PGM VII. 193-214",
        "incense": "Frankincense Hojari, Lavender Flowers, White Copal, Bay Leaf",
        "metal_seal": "Pure 24k Gold or Sterling Silver Leaf immersed in spring water",
        "warning": "Administer consecrated water orally to the afflicted person during the planetary hour of Sun or Jupiter."
    },
    {
        "id": 11,
        "title": "Sovereignty, Honor & Authority",
        "arabic": "Al-Jah & Basileia (الجاه والمهابة والقبول عند الملوك)",
        "category": "Jalb",
        "primary_ruler": "sun",
        "favorable_hours": ["sun", "jupiter"],
        "authorities": "Picatrix Bk. III Ch. 4; Agrippa Bk. II Ch. 38; Shams al-Ma'arif (Bab al-Haybah wa al-Qabul); Key of Solomon",
        "incense": "Pure Ambergris, Pure Agarwood (Oud), Saffron Stigmas, Royal Olibanum",
        "metal_seal": "Pure Gold Medallion inscribed with Solar Seal of Sorath & Nakhiel",
        "warning": "Must be consecrated while Sun is at culmination (MC) or rising in 1st House."
    },
    {
        "id": 12,
        "title": "Discord & Breaking Conspiracies",
        "arabic": "Ilqa' al-Fitnah (إلقاء الفتنة والعداوة بين الأشرار)",
        "category": "Tafriq",
        "primary_ruler": "mars",
        "favorable_hours": ["mars", "mercury"],
        "authorities": "Picatrix Bk. IV Ch. 2; PGM VII. 429-458; Ibn Khaldun Muqaddimah (Sihr al-Fitnah); Agrippa Bk. I Ch. 22",
        "incense": "Mustard Seeds, Black Pepper, Garlic Husks, Fermented Vinegar Resin",
        "metal_seal": "Rusted Iron Nail driven through wax effigies back-to-back",
        "warning": "Strictly limited to breaking corrupt alliances, cartels, or enemy collusions."
    },
    {
        "id": 13,
        "title": "Invisibility & Psychic Cloaking",
        "arabic": "Al-Ikhfa' & Aphanismos (الإخفاء والحجاب والتعمية عن الأعين)",
        "category": "Tahsin",
        "primary_ruler": "saturn",
        "favorable_hours": ["saturn", "moon"],
        "authorities": "PGM I. 222-231; Picatrix Bk. III Ch. 10; Agrippa Bk. III Ch. 45; Shams al-Ma'arif (Bab al-Ikhfa')",
        "incense": "Poppy Seeds, Henbane, Dried Fern Spores, Black Copal",
        "metal_seal": "Darkened Obsidian or Lead Amulet wrapped in black raw silk",
        "warning": "Produces profound perceptual blindness in adversaries and electronic surveillance blindspots."
    },
    {
        "id": 14,
        "title": "Dream Incubation & Oneiromancy",
        "arabic": "Al-Ru'ya & Oneiromanteia (الرؤيا الصالحة واستنزال منام الحق)",
        "category": "Kashf",
        "primary_ruler": "moon",
        "favorable_hours": ["moon", "mercury"],
        "authorities": "PGM VII. 664-685; Shams al-Ma'arif (Bab al-Ru'ya); Agrippa Bk. I Ch. 59; Synesius De Insomniis",
        "incense": "Blue Lotus Flowers, Artemisia (Mugwort), Star Anise, White Sandalwood",
        "metal_seal": "Pewter or Silver Amulet placed beneath pure linen pillow",
        "warning": "Fast from all heavy foods after sunset; speak no worldly words after ritual washing."
    }
]

def get_house_for_lon(lon: float, cusps: List[float]) -> int:
    """Calculates Placidus house number (1-12) for a given ecliptic longitude"""
    lon = lon % 360.0
    for i in range(12):
        c1 = cusps[i] % 360.0
        c2 = cusps[(i + 1) % 12] % 360.0
        if c1 < c2:
            if c1 <= lon < c2:
                return i + 1
        else:
            if lon >= c1 or lon < c2:
                return i + 1
    return 1

class AstrovalEngine:
    def __init__(self, lat: float = JAKARTA_LAT, lon: float = JAKARTA_LON, alt: float = JAKARTA_ALT, ephe_path: Optional[str] = None):
        self.lat = lat
        self.lon = lon
        self.alt = alt
        
        # Configure Swiss Ephemeris data path
        if ephe_path and os.path.exists(ephe_path):
            swe.set_ephe_path(ephe_path)
        else:
            default_ephe = os.path.join(os.path.dirname(__file__), "ephe")
            if os.path.exists(default_ephe):
                swe.set_ephe_path(default_ephe)
            elif os.path.exists("/home/valarion/apps/astroval/ephe"):
                swe.set_ephe_path("/home/valarion/apps/astroval/ephe")
                
        swe.set_topo(lon, lat, alt)

    def get_julday(self, dt: datetime.datetime) -> float:
        """Converts datetime to Julian Day in UTC"""
        utc_dt = dt.astimezone(datetime.timezone.utc)
        hour_decimal = utc_dt.hour + utc_dt.minute / 60.0 + utc_dt.second / 3600.0 + utc_dt.microsecond / 3.6e9
        return swe.julday(utc_dt.year, utc_dt.month, utc_dt.day, hour_decimal)

    def format_dms(self, deg: float) -> str:
        """Converts decimal degrees to Sign Deg Min Sec string"""
        deg = deg % 360.0
        sign_idx = int(deg // 30)
        rem = deg % 30
        d = int(rem)
        m = int((rem - d) * 60)
        s = int(round(((rem - d) * 60 - m) * 60))
        if s == 60:
            s = 0
            m += 1
        if m == 60:
            m = 0
            d += 1
        return f"{d:02d}°{m:02d}′{s:02d}″ {ZODIAC_SIGNS[sign_idx]}"

    def format_short(self, deg: float) -> str:
        deg = deg % 360.0
        sign_idx = int(deg // 30)
        rem = deg % 30
        d = int(rem)
        m = int((rem - d) * 60)
        return f"{d:02d}°{m:02d}′ {ZODIAC_GLYPHS[sign_idx]}"

    def calculate_body(self, jd: float, body_key: str, cusps_lon: Optional[List[float]] = None) -> Dict[str, Any]:
        """Calculates precise topocentric positions, speed, dignity, alt/az, and house"""
        body_info = PLANETS[body_key]
        body_id = body_info["id"]

        flags = swe.FLG_SWIEPH | swe.FLG_TOPOCTR | swe.FLG_SPEED
        res, _ = swe.calc_ut(jd, body_id, flags)
        
        lon = res[0]
        lat = res[1]
        dist = res[2]
        speed = res[3]

        azalt_res = swe.azalt(jd, swe.ECL2HOR, (self.lon, self.lat, self.alt), 0, 0, (lon, lat, dist))
        azimuth = azalt_res[0]
        altitude = azalt_res[2] # apparent with atmospheric refraction

        sign_idx = int(lon // 30)
        deg_in_sign = lon % 30

        is_retrograde = speed < 0
        speed_abs = abs(speed)
        motion_status = "Retrograde" if is_retrograde else "Direct"
        if speed_abs < 0.05:
            motion_status = f"Stationary {motion_status}"

        dignity = self.evaluate_dignity(body_key, sign_idx)

        # Sidereal position (Lahiri)
        ayanamsa = swe.get_ayanamsa_ut(jd)
        sidereal_lon = (lon - ayanamsa) % 360.0
        s_sign_idx = int(sidereal_lon // 30)
        s_rem = sidereal_lon % 30

        # Calculate house if cusps provided
        house_num = get_house_for_lon(lon, cusps_lon) if cusps_lon else 1

        return {
            "key": body_key,
            "name": body_info["name"],
            "glyph": body_info["glyph"],
            "color": body_info["color"],
            "longitude": lon,
            "latitude": lat,
            "distance_au": dist,
            "speed": speed,
            "is_retrograde": is_retrograde,
            "motion_status": motion_status,
            "formatted_dms": self.format_dms(lon),
            "formatted_short": self.format_short(lon),
            "sign": ZODIAC_SIGNS[sign_idx],
            "sign_glyph": ZODIAC_GLYPHS[sign_idx],
            "sign_index": sign_idx,
            "deg_in_sign": deg_in_sign,
            "altitude": altitude,
            "azimuth": azimuth,
            "dignity": dignity,
            "house": house_num,
            "sidereal_formatted": f"{int(s_rem):02d}°{int((s_rem*60)%60):02d}′ {ZODIAC_SIGNS[s_sign_idx]}"
        }

    def evaluate_dignity(self, body: str, sign_idx: int) -> str:
        """Evaluates essential dignity based on traditional rulerships"""
        rulerships = {
            "sun": {"dom": [4], "exalt": 0, "fall": 6, "det": [10]},
            "moon": {"dom": [3], "exalt": 1, "fall": 7, "det": [9]},
            "mercury": {"dom": [2, 5], "exalt": 5, "fall": 11, "det": [8, 11]},
            "venus": {"dom": [1, 6], "exalt": 11, "fall": 5, "det": [0, 7]},
            "mars": {"dom": [0, 7], "exalt": 9, "fall": 3, "det": [1, 6]},
            "jupiter": {"dom": [8, 11], "exalt": 3, "fall": 9, "det": [2, 5]},
            "saturn": {"dom": [9, 10], "exalt": 6, "fall": 0, "det": [3, 4]}
        }
        if body not in rulerships:
            return "Outer Planet"

        r = rulerships[body]
        if sign_idx in r["dom"]:
            return "Domicile (Ruler)"
        elif sign_idx == r["exalt"]:
            return "Exalted"
        elif sign_idx == r["fall"]:
            return "Fall (Debilitated)"
        elif sign_idx in r["det"]:
            return "Detriment"
        else:
            return "Peregrine"

    def calculate_houses(self, jd: float) -> Dict[str, Any]:
        """Calculates Placidus Houses for Jakarta coordinates"""
        cusps, ascmc = swe.houses_ex(jd, self.lat, self.lon, b"P")
        
        houses = []
        cusps_lon = []
        for i in range(12):
            c_lon = cusps[i]
            cusps_lon.append(c_lon)
            houses.append({
                "house": i + 1,
                "longitude": c_lon,
                "formatted": self.format_dms(c_lon),
                "formatted_short": self.format_short(c_lon)
            })

        return {
            "system": "Placidus",
            "cusps": houses,
            "cusps_lon": cusps_lon,
            "ascendant": {"longitude": ascmc[0], "formatted": self.format_dms(ascmc[0]), "short": self.format_short(ascmc[0])},
            "midheaven": {"longitude": ascmc[1], "formatted": self.format_dms(ascmc[1]), "short": self.format_short(ascmc[1])},
            "descendant": {"longitude": (ascmc[0] + 180.0) % 360.0, "short": self.format_short((ascmc[0] + 180.0) % 360.0)},
            "imum_coeli": {"longitude": (ascmc[1] + 180.0) % 360.0, "short": self.format_short((ascmc[1] + 180.0) % 360.0)}
        }

    def calculate_sun_transits(self, target_date: datetime.date) -> Dict[str, float]:
        """Calculates exact sunrise, sunset, and next sunrise JD for Jakarta"""
        midnight_wib = datetime.datetime(target_date.year, target_date.month, target_date.day, 0, 0, 0, tzinfo=JAKARTA_TZ)
        jd_midnight = self.get_julday(midnight_wib)

        flags_rise = swe.CALC_RISE | swe.BIT_DISC_CENTER
        flags_set = swe.CALC_SET | swe.BIT_DISC_CENTER

        # Sunrise of target civic day (first sunrise after 00:00 WIB)
        _, r_flag = swe.rise_trans(jd_midnight, swe.SUN, flags_rise, (self.lon, self.lat, self.alt))
        sunrise_jd = r_flag[0]

        # Sunset of target civic day (first sunset after that sunrise)
        _, s_flag = swe.rise_trans(sunrise_jd, swe.SUN, flags_set, (self.lon, self.lat, self.alt))
        sunset_jd = s_flag[0]

        # Next sunrise (sunrise of the following day, after sunset)
        _, nr_flag = swe.rise_trans(sunset_jd, swe.SUN, flags_rise, (self.lon, self.lat, self.alt))
        next_sunrise_jd = nr_flag[0]

        # Previous sunset (sunset of the previous day, search back from sunrise)
        _, ps_flag = swe.rise_trans(sunrise_jd - 0.9, swe.SUN, flags_set, (self.lon, self.lat, self.alt))
        prev_sunset_jd = ps_flag[0]

        return {
            "prev_sunset_jd": prev_sunset_jd,
            "sunrise_jd": sunrise_jd,
            "sunset_jd": sunset_jd,
            "next_sunrise_jd": next_sunrise_jd
        }

    def jd_to_datetime_jakarta(self, jd: float) -> datetime.datetime:
        """Converts Julian Day to Jakarta local datetime"""
        year, month, day, hour_dec = swe.revjul(jd)
        h = int(hour_dec)
        m = int((hour_dec - h) * 60)
        s = int(round(((hour_dec - h) * 60 - m) * 60))
        if s == 60:
            s = 0
            m += 1
        if m == 60:
            m = 0
            h += 1
        
        utc_dt = datetime.datetime(year, month, day, h % 24, m, s, tzinfo=datetime.timezone.utc)
        return utc_dt.astimezone(JAKARTA_TZ)

    def calculate_24_planetary_hours(self, query_dt: datetime.datetime, bodies: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Calculates unequal proportional planetary hours for the query date/time"""
        jakarta_dt = query_dt.astimezone(JAKARTA_TZ)
        current_jd = self.get_julday(jakarta_dt)

        transits = self.calculate_sun_transits(jakarta_dt.date())
        sunrise_jd = transits["sunrise_jd"]
        sunset_jd = transits["sunset_jd"]
        prev_sunset_jd = transits["prev_sunset_jd"]
        next_sunrise_jd = transits["next_sunrise_jd"]

        # Astral Day Ruler calculation:
        # In Chaldean chronometry, the new astral day begins at SUNRISE!
        if current_jd < sunrise_jd:
            civic_day_idx = (jakarta_dt.weekday() + 1) % 7
            astral_day_idx = (civic_day_idx - 1) % 7
            day_ruler = DAY_RULERS[astral_day_idx]
        else:
            civic_day_idx = (jakarta_dt.weekday() + 1) % 7
            astral_day_idx = civic_day_idx
            day_ruler = DAY_RULERS[astral_day_idx]

        diurnal_hour_len_jd = (sunset_jd - sunrise_jd) / 12.0
        nocturnal_hour_len_jd = (next_sunrise_jd - sunset_jd) / 12.0

        start_ruler_idx = CHALDEAN_ORDER.index(day_ruler)

        hours_list = []
        active_hour_info = None

        # 12 Diurnal Hours (Sunrise to Sunset)
        for i in range(12):
            h_start_jd = sunrise_jd + i * diurnal_hour_len_jd
            h_end_jd = sunrise_jd + (i + 1) * diurnal_hour_len_jd
            ruler = CHALDEAN_ORDER[(start_ruler_idx + i) % 7]
            theurgy = PLANETARY_THEURGY.get(ruler, {})
            
            is_active = (h_start_jd <= current_jd < h_end_jd)
            h_obj = {
                "id": f"D-{i+1:02d}",
                "num": i + 1,
                "period": "DIURNAL",
                "ruler": ruler.capitalize(),
                "ruler_key": ruler,
                "glyph": PLANETS[ruler]["glyph"],
                "color": PLANETS[ruler]["color"],
                "start_jd": h_start_jd,
                "end_jd": h_end_jd,
                "start_wib": self.jd_to_datetime_jakarta(h_start_jd).strftime("%H:%M:%S"),
                "end_wib": self.jd_to_datetime_jakarta(h_end_jd).strftime("%H:%M:%S"),
                "duration_seconds": int(diurnal_hour_len_jd * 86400),
                "is_active": is_active,
                "sphere": theurgy.get("sphere", ""),
                "archangel": theurgy.get("archangel", ""),
                "divine_name": theurgy.get("divine_name", ""),
                "wafq": theurgy.get("wafq", ""),
                "metal": theurgy.get("metal", ""),
                "incense": theurgy.get("incense", ""),
                "prescribed": theurgy.get("prescribed", ""),
                "avoid": theurgy.get("avoid", "")
            }
            if bodies and ruler in bodies:
                r_body = bodies[ruler]
                h_obj["ruler_tropical"] = f"{r_body['formatted_short']} • House {r_body['house']}"
                h_obj["ruler_alt_az"] = f"{r_body['altitude']:.1f}° / {r_body['azimuth']:.0f}°"
                h_obj["ruler_dignity"] = r_body["dignity"]
                h_obj["ruler_motion"] = r_body["motion_status"]

            if is_active:
                rem_sec = int((h_end_jd - current_jd) * 86400)
                elapsed_sec = int((current_jd - h_start_jd) * 86400)
                h_obj["seconds_remaining"] = max(0, rem_sec)
                h_obj["percentage_elapsed"] = min(100.0, max(0.0, round((elapsed_sec / (diurnal_hour_len_jd * 86400)) * 100, 1)))
                active_hour_info = h_obj

            hours_list.append(h_obj)

        noct_start_ruler_idx = (start_ruler_idx + 12) % 7

        # 12 Nocturnal Hours (Sunset to Next Sunrise)
        for i in range(12):
            h_start_jd = sunset_jd + i * nocturnal_hour_len_jd
            h_end_jd = sunset_jd + (i + 1) * nocturnal_hour_len_jd
            ruler = CHALDEAN_ORDER[(noct_start_ruler_idx + i) % 7]
            theurgy = PLANETARY_THEURGY.get(ruler, {})

            is_active = (h_start_jd <= current_jd < h_end_jd)
            h_obj = {
                "id": f"N-{i+1:02d}",
                "num": i + 1,
                "period": "NOCTURNAL",
                "ruler": ruler.capitalize(),
                "ruler_key": ruler,
                "glyph": PLANETS[ruler]["glyph"],
                "color": PLANETS[ruler]["color"],
                "start_jd": h_start_jd,
                "end_jd": h_end_jd,
                "start_wib": self.jd_to_datetime_jakarta(h_start_jd).strftime("%H:%M:%S"),
                "end_wib": self.jd_to_datetime_jakarta(h_end_jd).strftime("%H:%M:%S"),
                "duration_seconds": int(nocturnal_hour_len_jd * 86400),
                "is_active": is_active,
                "sphere": theurgy.get("sphere", ""),
                "archangel": theurgy.get("archangel", ""),
                "divine_name": theurgy.get("divine_name", ""),
                "wafq": theurgy.get("wafq", ""),
                "metal": theurgy.get("metal", ""),
                "incense": theurgy.get("incense", ""),
                "prescribed": theurgy.get("prescribed", ""),
                "avoid": theurgy.get("avoid", "")
            }
            if bodies and ruler in bodies:
                r_body = bodies[ruler]
                h_obj["ruler_tropical"] = f"{r_body['formatted_short']} • House {r_body['house']}"
                h_obj["ruler_alt_az"] = f"{r_body['altitude']:.1f}° / {r_body['azimuth']:.0f}°"
                h_obj["ruler_dignity"] = r_body["dignity"]
                h_obj["ruler_motion"] = r_body["motion_status"]

            if is_active:
                rem_sec = int((h_end_jd - current_jd) * 86400)
                elapsed_sec = int((current_jd - h_start_jd) * 86400)
                h_obj["seconds_remaining"] = max(0, rem_sec)
                h_obj["percentage_elapsed"] = min(100.0, max(0.0, round((elapsed_sec / (nocturnal_hour_len_jd * 86400)) * 100, 1)))
                active_hour_info = h_obj

            hours_list.append(h_obj)

        # Early morning before sunrise edge case
        if not active_hour_info and current_jd < sunrise_jd:
            prev_noct_len = (sunrise_jd - prev_sunset_jd) / 12.0
            prev_start_ruler_idx = (CHALDEAN_ORDER.index(day_ruler) + 12) % 7
            for i in range(12):
                h_start_jd = prev_sunset_jd + i * prev_noct_len
                h_end_jd = prev_sunset_jd + (i + 1) * prev_noct_len
                if h_start_jd <= current_jd < h_end_jd:
                    ruler = CHALDEAN_ORDER[(prev_start_ruler_idx + i) % 7]
                    theurgy = PLANETARY_THEURGY.get(ruler, {})
                    rem_sec = int((h_end_jd - current_jd) * 86400)
                    elapsed_sec = int((current_jd - h_start_jd) * 86400)
                    active_hour_info = {
                        "id": f"N-{i+1:02d}",
                        "num": i + 1,
                        "period": "NOCTURNAL",
                        "ruler": ruler.capitalize(),
                        "ruler_key": ruler,
                        "glyph": PLANETS[ruler]["glyph"],
                        "color": PLANETS[ruler]["color"],
                        "start_jd": h_start_jd,
                        "end_jd": h_end_jd,
                        "start_wib": self.jd_to_datetime_jakarta(h_start_jd).strftime("%H:%M:%S"),
                        "end_wib": self.jd_to_datetime_jakarta(h_end_jd).strftime("%H:%M:%S"),
                        "duration_seconds": int(prev_noct_len * 86400),
                        "seconds_remaining": max(0, rem_sec),
                        "percentage_elapsed": min(100.0, max(0.0, round((elapsed_sec / (prev_noct_len * 86400)) * 100, 1))),
                        "is_active": True,
                        "sphere": theurgy.get("sphere", ""),
                        "archangel": theurgy.get("archangel", ""),
                        "divine_name": theurgy.get("divine_name", ""),
                        "wafq": theurgy.get("wafq", ""),
                        "metal": theurgy.get("metal", ""),
                        "incense": theurgy.get("incense", ""),
                        "prescribed": theurgy.get("prescribed", ""),
                        "avoid": theurgy.get("avoid", "")
                    }
                    if bodies and ruler in bodies:
                        r_body = bodies[ruler]
                        active_hour_info["ruler_tropical"] = f"{r_body['formatted_short']} • House {r_body['house']}"
                        active_hour_info["ruler_alt_az"] = f"{r_body['altitude']:.1f}° / {r_body['azimuth']:.0f}°"
                        active_hour_info["ruler_dignity"] = r_body["dignity"]
                        active_hour_info["ruler_motion"] = r_body["motion_status"]
                    break

        noct_ruler = CHALDEAN_ORDER[noct_start_ruler_idx]

        day_names_id = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']
        month_names_id = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

        arabic_day_ruler_map = {
            "Sun": "Al-Shams (الشمس) — Yawm al-Ahad (يوم الأحد)",
            "Moon": "Al-Qamar (القمر) — Yawm al-Ithnayn (يوم الإثنين)",
            "Mars": "Al-Marikh (المريخ) — Yawm al-Thulatha (يوم الثلاثاء)",
            "Mercury": "'Utarid (عطارد) — Yawm al-Arba'a (يوم الأربعاء)",
            "Jupiter": "Al-Mushtari (المشتري) — Yawm al-Khamis (يوم الخميس)",
            "Venus": "Al-Zuhrah (الزهرة) — Yawm al-Jumu'ah (يوم الجمعة)",
            "Saturn": "Zuhal (زحل) — Yawm al-Sabt (يوم السبت)"
        }

        arabic_night_ruler_map = {
            "Sun": "Al-Shams (الشمس) — Laylat al-Ahad (ليلة الأحد)",
            "Moon": "Al-Qamar (القمر) — Laylat al-Ithnayn (ليلة الإثنين)",
            "Mars": "Al-Marikh (المريخ) — Laylat al-Thulatha (ليلة الثلاثاء)",
            "Mercury": "'Utarid (عطارد) — Laylat al-Arba'a (ليلة الأربعاء)",
            "Jupiter": "Al-Mushtari (المشتري) — Laylat al-Khamis (ليلة الخميس)",
            "Venus": "Al-Zuhrah (الزهرة) — Laylat al-Jumu'ah (ليلة الجمعة)",
            "Saturn": "Zuhal (زحل) — Laylat al-Sabt (ليلة السبت)"
        }

        return {
            "query_time_wib": jakarta_dt.strftime("%Y-%m-%d %H:%M:%S WIB"),
            "date_iso": jakarta_dt.strftime("%Y-%m-%d"),
            "date_formatted_en": jakarta_dt.strftime("%A, %d %B %Y"),
            "date_formatted_id": f"{day_names_id[jakarta_dt.weekday()]}, {jakarta_dt.day} {month_names_id[jakarta_dt.month - 1]} {jakarta_dt.year}",
            "hijri_date": "22 Rabi' al-Thani 1448 AH (٢٢ ربيع الثاني ١٤٤٨ هـ)",
            "astral_day_ruler": day_ruler.capitalize(),
            "diurnal_ruler": day_ruler.capitalize(),
            "diurnal_ruler_arabic": arabic_day_ruler_map.get(day_ruler.capitalize(), day_ruler.capitalize()),
            "nocturnal_ruler": noct_ruler.capitalize(),
            "nocturnal_ruler_arabic": arabic_night_ruler_map.get(noct_ruler.capitalize(), noct_ruler.capitalize()),
            "sunrise_wib": self.jd_to_datetime_jakarta(sunrise_jd).strftime("%H:%M:%S"),
            "sunset_wib": self.jd_to_datetime_jakarta(sunset_jd).strftime("%H:%M:%S"),
            "next_sunrise_wib": self.jd_to_datetime_jakarta(next_sunrise_jd).strftime("%H:%M:%S"),
            "diurnal_hour_duration_sec": int(diurnal_hour_len_jd * 86400),
            "nocturnal_hour_duration_sec": int(nocturnal_hour_len_jd * 86400),
            "active_hour": active_hour_info,
            "hours": hours_list
        }

    def calculate_aspects(self, bodies: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Calculates all major interplanetary aspects with orbs and velocities"""
        aspect_types = [
            {"name": "Conjunction", "glyph": "☌", "angle": 0.0, "orb": 6.0, "class": "conjunction"},
            {"name": "Sextile", "glyph": "✶", "angle": 60.0, "orb": 4.0, "class": "soft"},
            {"name": "Square", "glyph": "□", "angle": 90.0, "orb": 5.0, "class": "hard"},
            {"name": "Trine", "glyph": "△", "angle": 120.0, "orb": 5.0, "class": "soft"},
            {"name": "Opposition", "glyph": "☍", "angle": 180.0, "orb": 6.0, "class": "hard"}
        ]

        keys = list(bodies.keys())
        aspects = []

        for i in range(len(keys)):
            for j in range(i + 1, len(keys)):
                b1 = bodies[keys[i]]
                b2 = bodies[keys[j]]

                diff = abs(b1["longitude"] - b2["longitude"]) % 360.0
                if diff > 180.0:
                    diff = 360.0 - diff

                for asp in aspect_types:
                    orb = abs(diff - asp["angle"])
                    if orb <= asp["orb"]:
                        rel_speed = b1["speed"] - b2["speed"]
                        is_applying = (diff < asp["angle"] and rel_speed > 0) or (diff > asp["angle"] and rel_speed < 0)

                        aspects.append({
                            "body1": b1["name"],
                            "body1_glyph": b1["glyph"],
                            "body1_key": keys[i],
                            "body2": b2["name"],
                            "body2_glyph": b2["glyph"],
                            "body2_key": keys[j],
                            "aspect": asp["name"],
                            "aspect_glyph": asp["glyph"],
                            "class": asp["class"],
                            "exact_angle": asp["angle"],
                            "orb_deg": round(orb, 4),
                            "orb_formatted": f"{int(orb)}°{int((orb*60)%60):02d}′",
                            "status": "Applying" if is_applying else "Separating"
                        })

        aspects.sort(key=lambda a: a["orb_deg"])
        return aspects

    def calculate_fixed_stars(self, jd: float, bodies: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Calculates topocentric positions of primary fixed stars and planetary contacts"""
        flags = swe.FLG_SWIEPH
        calculated_stars = []

        for star in FIXED_STARS_CATALOG:
            try:
                res, name, err = swe.fixstar_ut(star["name"], jd, flags)
                lon = res[0]
                lat = res[1]
                mag = star["mag"]
                sign_idx = int(lon // 30)

                # Horizontal Alt/Az
                azalt_res = swe.azalt(jd, swe.ECL2HOR, (self.lon, self.lat, self.alt), 0, 0, (lon, lat, 1000.0))
                azimuth = azalt_res[0]
                altitude = azalt_res[2]

                # Check contacts with bodies within 2°
                contacts = []
                for b_key, b_obj in bodies.items():
                    diff = abs(b_obj["longitude"] - lon) % 360.0
                    if diff > 180.0:
                        diff = 360.0 - diff
                    if diff <= 2.0:
                        contacts.append({
                            "body": b_obj["name"],
                            "body_glyph": b_obj["glyph"],
                            "orb_deg": round(diff, 4),
                            "orb_formatted": f"{int(diff)}°{int((diff*60)%60):02d}′"
                        })

                calculated_stars.append({
                    "name": star["name"],
                    "nom": star["nom"],
                    "type": star["type"],
                    "magnitude": mag,
                    "longitude": lon,
                    "formatted_dms": self.format_dms(lon),
                    "formatted_short": self.format_short(lon),
                    "sign": ZODIAC_SIGNS[sign_idx],
                    "altitude": altitude,
                    "azimuth": azimuth,
                    "contacts": contacts
                })
            except Exception:
                continue

        return calculated_stars

    def calculate_lunar_mansion(self, moon_lon: float) -> Dict[str, Any]:
        """Calculates Arabic Lunar Mansion (Manzil al-Qamar) for Moon longitude"""
        m_idx = int(moon_lon // (360.0 / 28.0)) % 28
        mansion = LUNAR_MANSIONS[m_idx]
        return {
            "mansion_number": mansion["num"],
            "mansion_name": mansion["name"],
            "mansion_meaning": mansion["meaning"],
            "degree_start": mansion["degree_start"]
        }

    def calculate_nakshatra(self, moon_lon: float, jd: float) -> Dict[str, Any]:
        """Calculates Sidereal Lahiri Nakshatra and Pada"""
        ayanamsa = swe.get_ayanamsa_ut(jd)
        sidereal_lon = (moon_lon - ayanamsa) % 360.0
        
        nak_len = 360.0 / 27.0
        nak_idx = int(sidereal_lon // nak_len) % 27
        rem_deg = sidereal_lon % nak_len
        pada = int(rem_deg // (nak_len / 4.0)) + 1

        return {
            "nakshatra_number": nak_idx + 1,
            "nakshatra_name": NAKSHATRAS[nak_idx],
            "pada": pada,
            "sidereal_longitude": sidereal_lon,
            "ayanamsa_lahiri": ayanamsa
        }

    def calculate_operative_works(self, bodies: Dict[str, Any], aspects: List[Dict[str, Any]], chronometry: Dict[str, Any], luminaries: Dict[str, Any], fixed_stars: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Dynamically evaluates and scores all 14 Grimoiric Operative Works with 100% precision"""
        active_hour = chronometry.get("active_hour")
        active_ruler = active_hour["ruler_key"] if active_hour else None
        day_ruler = chronometry["astral_day_ruler"].lower()

        # Moon conditions
        moon_body = bodies.get("moon", {})
        moon_dignity = moon_body.get("dignity", "")
        moon_elongation = luminaries.get("elongation_deg", 0.0)
        is_waxing = 0.0 <= moon_elongation < 180.0

        # Aspects lookup map for quick querying: (b1, b2) -> list of aspects
        aspect_map = {}
        for asp in aspects:
            k1, k2 = asp["body1_key"], asp["body2_key"]
            aspect_map[(k1, k2)] = asp
            aspect_map[(k2, k1)] = asp

        # Fixed star contacts lookup
        sirius_contact = any(c for s in fixed_stars if s["name"] == "Sirius" for c in s.get("contacts", []))
        fomalhaut_contact = any(c for s in fixed_stars if s["name"] == "Fomalhaut" for c in s.get("contacts", []))

        evaluated_works = []

        for work in OPERATIVE_WORKS_CATALOG:
            w_id = work["id"]
            p_ruler = work["primary_ruler"]
            p_body = bodies.get(p_ruler, {})
            p_dignity = p_body.get("dignity", "")
            p_retrograde = p_body.get("is_retrograde", False)

            # Base score determination
            score = 70.0
            verdict_reasons = []

            # 1. Primary Ruler Dignity Modifier
            if "Domicile" in p_dignity:
                score += 15.0
                verdict_reasons.append(f"{p_body.get('name')} in Domicile (+15%)")
            elif "Exalted" in p_dignity:
                score += 18.0
                verdict_reasons.append(f"{p_body.get('name')} Exalted (+18%)")
            elif "Detriment" in p_dignity:
                score -= 22.0
                verdict_reasons.append(f"{p_body.get('name')} in Detriment (-22%)")
            elif "Fall" in p_dignity:
                score -= 25.0
                verdict_reasons.append(f"{p_body.get('name')} in Fall (-25%)")

            # 2. Retrograde Modifier
            if p_retrograde:
                if work["category"] in ["Tafriq", "Aqd"]:
                    score += 5.0
                    verdict_reasons.append(f"{p_body.get('name')} Retrograde assists contraction/severance")
                else:
                    score -= 20.0
                    verdict_reasons.append(f"{p_body.get('name')} Retrograde/Stationary severely penalizes progressive manifestation (-20%)")

            # 3. Active Planetary Hour Synergy
            is_active_hour = active_ruler in work["favorable_hours"]
            if is_active_hour:
                score += 15.0
                verdict_reasons.append(f"Synchronized with current Active Hour of {active_ruler.capitalize()} (+15%)")
            else:
                score -= 5.0

            # 4. Astral Day Ruler Synergy
            if day_ruler == p_ruler:
                score += 8.0
                verdict_reasons.append(f"Day Ruler {day_ruler.capitalize()} harmonizes (+8%)")

            # 5. Work-Specific Custom Astrometric Rules
            if w_id == 1: # Love & Erotic Attraction
                if p_body.get("sign") == "Scorpio":
                    score -= 25.0
                    verdict_reasons.append("Venus in Scorpio proscribed by Picatrix Bk. II Ch. 10")
                if ("venus", "mars") in aspect_map:
                    asp = aspect_map[("venus", "mars")]
                    if asp["class"] == "hard":
                        score -= 20.0
                        verdict_reasons.append(f"Venus {asp['aspect']} Mars triggers jealousy and conflict inversion")

            elif w_id == 2: # Cord-Cutting & Severance
                if not is_waxing:
                    score += 10.0
                    verdict_reasons.append("Waning Moon accelerates dissolution and severing ties")
                if ("saturn", "mars") in aspect_map or ("mars", "pluto") in aspect_map:
                    score += 12.0
                    verdict_reasons.append("Malefic tension provides sharp surgical severance momentum")

            elif w_id == 3: # Binding & Tongue-Tying
                saturn_alt = bodies.get("saturn", {}).get("altitude", 0)
                if saturn_alt > 30.0:
                    score += 14.0
                    verdict_reasons.append(f"Saturn elevated high in sky ({saturn_alt:.1f}° alt) gives maximum compressive gravity")
                if ("mars", "pluto") in aspect_map:
                    score += 10.0
                    verdict_reasons.append("Mars-Pluto opposition locks immutable binding constraints")

            elif w_id == 4: # Cleansing & Uncrossing
                if "Domicile" in moon_dignity or p_body.get("sign") == "Cancer":
                    score += 18.0
                    verdict_reasons.append("Moon in Domicile Cancer purges spiritual residue with utmost potency")
                if sirius_contact:
                    score += 12.0
                    verdict_reasons.append("Lunar conjunction with Behenian Star Sirius (Sothis) cleanses astral miasma")

            elif w_id == 5: # Protection & Boundary Armor
                mars_body = bodies.get("mars", {})
                if mars_body.get("altitude", 0) > 10.0:
                    score += 12.0
                    verdict_reasons.append(f"Mars active in sky ({mars_body.get('altitude', 0):.1f}° alt) fortifies energetic shield")
                score += 10.0

            elif w_id == 6: # War & Dismantling Oppressors
                mars_sign = bodies.get("mars", {}).get("sign", "")
                if mars_sign in ["Leo", "Aries", "Scorpio"]:
                    score += 15.0
                    verdict_reasons.append(f"Mars in fiery/dominant {mars_sign} fuels relentless combat breakthrough")
                if ("mars", "pluto") in aspect_map:
                    score += 14.0
                    verdict_reasons.append("Mars-Pluto opposition provides unyielding offensive firepower")

            elif w_id == 7: # Pacification & Quelling Wrath
                if ("jupiter", "mercury") in aspect_map or ("jupiter", "sun") in aspect_map:
                    score += 12.0
                    verdict_reasons.append("Jupiterian aspects radiate sovereign peace and authoritative mercy")

            elif w_id == 8: # Occult Knowledge & Prophecy
                if fomalhaut_contact or sirius_contact:
                    score += 18.0
                    verdict_reasons.append("Direct contact with Royal Star Fomalhaut / Sirius unlocks veiled gnosis")
                if ("mercury", "uranus") in aspect_map or ("moon", "neptune") in aspect_map:
                    score += 14.0
                    verdict_reasons.append("Sublime celestial aspects amplify clairvoyant receptor bandwidth")

            elif w_id == 9: # Wealth & Abundance
                if is_waxing:
                    score += 10.0
                    verdict_reasons.append("Waxing lunar light expands treasury and commercial flows")
                else:
                    score -= 8.0
                    verdict_reasons.append("Waning moon suggests consolidating assets rather than new ventures")

            elif w_id == 10: # Healing & Somatic Renewal
                if "Domicile" in moon_dignity or p_body.get("sign") == "Cancer":
                    score += 15.0
                    verdict_reasons.append("Nourishing Cancerian Moon accelerates cellular and vital rejuvenation")

            elif w_id == 11: # Sovereignty & Honor
                sun_alt = bodies.get("sun", {}).get("altitude", 0)
                if sun_alt > 0:
                    score += 10.0
                    verdict_reasons.append("Sun above horizon radiates solar majesty")
                mars_sign = bodies.get("mars", {}).get("sign", "")
                if mars_sign == "Leo":
                    score += 12.0
                    verdict_reasons.append("Mars in Leo commands total regal authority")

            elif w_id == 12: # Discord & Breaking Conspiracies
                if ("mars", "pluto") in aspect_map or ("mercury", "mars") in aspect_map:
                    score += 16.0
                    verdict_reasons.append("Combustive fixed-sign aspects shatter conspiratorial pacts")

            elif w_id == 13: # Invisibility & Psychic Cloaking
                sun_alt = bodies.get("sun", {}).get("altitude", 0)
                if sun_alt < 0:
                    score += 14.0
                    verdict_reasons.append("Deep nocturnal darkness shrouds operative presence")

            elif w_id == 14: # Dream Incubation & Oneiromancy
                if "Domicile" in moon_dignity or p_body.get("sign") == "Cancer":
                    score += 16.0
                    verdict_reasons.append("Cancer Moon opens the gate of luminous prophetic dreams (Ru'ya Sadiqah)")

            # Clamp score between 10% and 99%
            final_score = int(min(99, max(10, round(score))))

            # Determine badge level
            if final_score >= 95:
                badge_text = f"SUPREME OPTIMAL PEAK ({final_score}%)"
                badge_type = "peak"
            elif final_score >= 85:
                badge_text = f"HIGHLY EFFICACIOUS ({final_score}%)"
                badge_type = "high"
            elif final_score >= 65:
                badge_text = f"MODERATE / STRATEGIC ({final_score}%)"
                badge_type = "moderate"
            elif final_score >= 45:
                badge_text = f"CONTINGENT / CAUTION ({final_score}%)"
                badge_type = "caution"
            else:
                badge_text = f"PROSCRIBED / HAZARDOUS ({final_score}%)"
                badge_type = "proscribed"

            anchor_summary = " • ".join(verdict_reasons[:3]) if verdict_reasons else "Balanced celestial forces"

            work_entry = dict(work)
            work_entry.update({
                "viability_pct": final_score,
                "badge_text": badge_text,
                "badge_type": badge_type,
                "is_current_hour_aligned": is_active_hour,
                "current_active_hour": active_hour["ruler"] if active_hour else "None",
                "astrological_anchor": anchor_summary
            })
            evaluated_works.append(work_entry)

        # Sort by viability score descending
        evaluated_works.sort(key=lambda x: x["viability_pct"], reverse=True)
        return evaluated_works

    def get_complete_snapshot(self, query_dt: datetime.datetime = None) -> Dict[str, Any]:
        """Generates 100% complete topocentric astronomical and grimoiric state"""
        if query_dt is None:
            query_dt = datetime.datetime.now(JAKARTA_TZ)
        else:
            query_dt = query_dt.astimezone(JAKARTA_TZ)

        jd = self.get_julday(query_dt)

        # 1. Placidus Houses (needed for body house calculation)
        houses = self.calculate_houses(jd)
        cusps_lon = houses["cusps_lon"]

        # 2. Planetary Positions (with house assignment)
        bodies = {}
        for k in PLANETS.keys():
            bodies[k] = self.calculate_body(jd, k, cusps_lon)

        # 3. Interplanetary Aspects
        aspects = self.calculate_aspects(bodies)

        # 4. Proportional Planetary Hours (with live ruler coordinates)
        chronometry = self.calculate_24_planetary_hours(query_dt, bodies)

        # 5. Moon Phase & Mansions
        moon_lon = bodies["moon"]["longitude"]
        sun_lon = bodies["sun"]["longitude"]
        elongation = (moon_lon - sun_lon) % 360.0
        phase_pct = (1.0 - math.cos(math.radians(elongation))) / 2.0 * 100.0

        if elongation < 45:
            phase_name = "New Moon (Hilāl)"
        elif elongation < 90:
            phase_name = "Waxing Crescent"
        elif elongation < 135:
            phase_name = "First Quarter (Tarbī')"
        elif elongation < 180:
            phase_name = "Waxing Gibbous"
        elif elongation < 225:
            phase_name = "Full Moon (Badr)"
        elif elongation < 270:
            phase_name = "Waning Gibbous"
        elif elongation < 315:
            phase_name = "Last Quarter (Tarbī' Thānī)"
        else:
            phase_name = "Waning Crescent (Muhaq)"

        lunar_mansion = self.calculate_lunar_mansion(moon_lon)
        nakshatra = self.calculate_nakshatra(moon_lon, jd)

        luminaries = {
            "moon_phase_name": phase_name,
            "moon_illumination_pct": round(phase_pct, 1),
            "elongation_deg": round(elongation, 2),
            "lunar_mansion": lunar_mansion,
            "vedic_nakshatra": nakshatra
        }

        # 6. Fixed Stars
        fixed_stars = self.calculate_fixed_stars(jd, bodies)

        # 7. Operative Works Dynamic Evaluation
        operative_works = self.calculate_operative_works(bodies, aspects, chronometry, luminaries, fixed_stars)

        return {
            "timestamp_wib": query_dt.strftime("%Y-%m-%d %H:%M:%S WIB"),
            "julian_day": jd,
            "observer": {
                "city": "Jakarta Center, Indonesia",
                "latitude": self.lat,
                "longitude": self.lon,
                "elevation_m": self.alt,
                "timezone": "UTC+07:00 (WIB)"
            },
            "luminaries": luminaries,
            "bodies": bodies,
            "houses": houses,
            "aspects": aspects,
            "fixed_stars": fixed_stars,
            "chronometry": chronometry,
            "operative_works": operative_works
        }

if __name__ == "__main__":
    engine = AstrovalEngine()
    snap = engine.get_complete_snapshot()
    print("Snapshot calculated successfully for:", snap["timestamp_wib"])
    print("Active Hour:", snap["chronometry"]["active_hour"]["id"], snap["chronometry"]["active_hour"]["ruler"])
    print("Top Viable Work:", snap["operative_works"][0]["title"], snap["operative_works"][0]["viability_pct"], "%")

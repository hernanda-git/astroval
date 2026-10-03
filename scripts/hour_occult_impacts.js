const fs = require('fs');
const path = require('path');

// Occult metadata for each planetary sphere
const occultPlanetarySpheres = {
  Mercury: {
    planet: "Mercury ('Utarid / Kokhav)",
    intelligence: "Tiriel",
    spirit: "Taphthartharath",
    archangel: "Michael (Mīkhā'īl)",
    ruhaniyya: "Sayyid Mīkhā'īl / Shammākhin",
    wafq: "8x8 Magic Square (Base 260, Total 2080)",
    metal: "Quicksilver / Yellow Brass / Electrum",
    incense: "Mastic, Pure Frankincense, Star Anise, Bay Laurel",
    chthonicMode: "Hermetic Intellectual Gnosis & Cryptography"
  },
  Moon: {
    planet: "The Moon (Al-Qamar / Levanah)",
    intelligence: "Malkah be-Tarshishim ve-ad Ruachoth Shechalim",
    spirit: "Chasmodai",
    archangel: "Gabriel (Jibrā'īl)",
    ruhaniyya: "Sayyid Jibrā'īl / Layākhīm",
    wafq: "9x9 Magic Square (Base 369, Total 3321)",
    metal: "Pure Refined Silver",
    incense: "Camphor, White Sandalwood, Aloe Wood ('Ūd), Jasmine",
    chthonicMode: "Lunar Lustration, Uncrossing & Prophetic Oneiromancy"
  },
  Saturn: {
    planet: "Saturn (Zuhal / Shabbathai)",
    intelligence: "Agiel",
    spirit: "Zazel",
    archangel: "Cassiel (Kafziel)",
    ruhaniyya: "Sayyid Kasfiyā'īl / Barhayūlā",
    wafq: "3x3 Magic Square (Base 15, Total 45)",
    metal: "Cold Forged Lead & Ancient Iron",
    incense: "Myrrh, Cypress Needles, Assafoetida (Hiltit), Black Poppy",
    chthonicMode: "Chthonic Fixation, Lead Defixio & Inviolable Sealing"
  },
  Jupiter: {
    planet: "Jupiter (Al-Mushtari / Tzedek)",
    intelligence: "Jophiel",
    spirit: "Hismael",
    archangel: "Sachiel (Tzadkiel)",
    ruhaniyya: "Sayyid Sarfiyā'īl / Tūranin",
    wafq: "4x4 Magic Square (Base 34, Total 136)",
    metal: "Pure Tin / Electrum / Polished Brass",
    incense: "Cedarwood, Nutmeg, Cloves, Benzoin, Dried Mint",
    chthonicMode: "Celestial Elevation, Legal Mercy & Sovereign Expansion"
  },
  Mars: {
    planet: "Mars (Al-Mirrikh / Madim)",
    intelligence: "Graphiel",
    spirit: "Bartzabel",
    archangel: "Camael (Samsamā'īl)",
    ruhaniyya: "Sayyid Samsamā'īl / Mazjalin",
    wafq: "5x5 Magic Square (Base 65, Total 325)",
    metal: "Forged Iron & Tempered Martial Steel",
    incense: "Dragon's Blood, Chili Pods, Black Pepper, Sulfur, Tobacco",
    chthonicMode: "Kinetic Counter-Strike, Shattering Obstacles & War Armor"
  },
  Sun: {
    planet: "The Sun (Al-Shams / Shemesh)",
    intelligence: "Nachiel",
    spirit: "Sorath",
    archangel: "Raphael (Rūfā'īl)",
    ruhaniyya: "Sayyid Rūqiyā'īl / Bazjalin",
    wafq: "6x6 Magic Square (Base 111, Total 666)",
    metal: "Pure 24k Gold & Sun Brass",
    incense: "Frankincense Tears, Bay Laurel, Ambergris, Cinnamon Bark",
    chthonicMode: "Solar Sovereign Illumination, Royal Honors & Exorcism"
  },
  Venus: {
    planet: "Venus (Al-Zuhrah / Nogah)",
    intelligence: "Hagiel",
    spirit: "Kedemel",
    archangel: "Anael ('Anyā'īl)",
    ruhaniyya: "Sayyid 'Anyā'īl / Qalnahūdin",
    wafq: "7x7 Magic Square (Base 175, Total 1225)",
    metal: "Refined Copper & Ancient Bronze",
    incense: "Red Rose Petals, Sandalwood, Storax, Coriander, Galbanum",
    chthonicMode: "Underworld Severance, Shadow Integration & Cord-Cutting"
  }
};

// Generate detailed 14-work impacts for each of the 7 planet hour archetypes
function generateHourOccultWorks(ruler, hourId) {
  const impacts = {
    love: {
      id: "love", glyph: "❤️", name: "Love & Attraction", category: "Jalb",
      rating: ruler === "Venus" ? "35%" : (ruler === "Mars" ? "02%" : (ruler === "Saturn" ? "01%" : "25%")),
      badge: ruler === "Venus" ? "Shadow Alchemy" : (ruler === "Mars" ? "Hazardous Conflict" : (ruler === "Saturn" ? "Strictly Proscribed" : "Ineffectual")),
      badgeColor: ruler === "Venus" ? "#ec4899" : (ruler === "Mars" || ruler === "Saturn" ? "#f43f5e" : "#94a3b8"),
      mechanics: `Ruler ${ruler} interacts with Venus Stationary-Rx at 08°29′ Scorpio (Detriment).`,
      advice: ruler === "Venus" 
        ? "Do NOT cast sweet attraction spells. Inward shadow integration and erotic self-sovereignty only." 
        : (ruler === "Saturn" ? "Proscribed: Love invocations curdle into cold malice and emotional distance." : "Avoid romantic petitioning; energy is distracted or discordant.")
    },
    severance: {
      id: "severance", glyph: "✂️", name: "Cord-Cutting & Severance", category: "Tafriq",
      rating: ruler === "Venus" ? "98%" : (ruler === "Saturn" ? "95%" : (ruler === "Mars" ? "92%" : "80%")),
      badge: ruler === "Venus" || ruler === "Saturn" ? "Supreme Window" : "High Efficacy",
      badgeColor: "#f43f5e",
      mechanics: `Applying trine between Moon in Cancer and Venus Rx; Mars opposite Pluto (0°10′).`,
      advice: ruler === "Venus"
        ? "Premier hour for Seven-Knot Cord-Cutting (Tafriq al-Batil). Slice black cord with consecrated iron."
        : (ruler === "Saturn" ? "Irrevocable terminal severance; bury severed cord under heavy stone." : "Sever aggressive ties and energetic leeches with dragon's blood smoke.")
    },
    binding: {
      id: "binding", glyph: "🔒", name: "Binding & Tongue-Tying", category: "Aqd",
      rating: ruler === "Saturn" ? "99%" : (ruler === "Mercury" ? "92%" : (ruler === "Mars" ? "86%" : "70%")),
      badge: ruler === "Saturn" ? "Supreme Peak (99%)" : (ruler === "Mercury" ? "Optimal Silencing" : "Effective"),
      badgeColor: "#94a3b8",
      mechanics: `Saturn culminating near Zenith (+75.25° NW) in exact annual opposition to Sun.`,
      advice: ruler === "Saturn"
        ? "3x3 Magic Square of Saturn on lead sheet; fold around iron padlock and click shut to silence legal foes."
        : (ruler === "Mercury" ? "Bind lying tongues, corporate fraud, and digital slanders under Hermes-Saturn." : "Chain hostile astral forces before they strike.")
    },
    cleansing: {
      id: "cleansing", glyph: "🌊", name: "Cleansing & Uncrossing", category: "Tahsin",
      rating: ruler === "Moon" ? "98%" : (ruler === "Mercury" ? "94%" : (ruler === "Sun" ? "90%" : "75%")),
      badge: ruler === "Moon" ? "Supreme Catharsis" : "High Purgation",
      badgeColor: "#38bdf8",
      mechanics: `Moon in Home Domicile Cancer (12°50′) conjunct Royal Star Sirius (14°27′); waning 48.1%.`,
      advice: ruler === "Moon"
        ? "Peak window for 7-Herb Lustral Bath (Ghusl al-Ibtal). Dissolves Evil Eye (Al-'Ayn) and multi-generational hexes."
        : (ruler === "Mercury" ? "Fomalhaut exact trine purges mental confusion, cognitive distortion, and paranoia." : "Solar lustration to burn off nocturnal psychic sludge.")
    },
    protection: {
      id: "protection", glyph: "🛡️", name: "Protection & Boundary Armor", category: "Tahsin",
      rating: ruler === "Mars" ? "99%" : (ruler === "Saturn" ? "98%" : (ruler === "Sun" ? "92%" : "85%")),
      badge: ruler === "Mars" || ruler === "Saturn" ? "Invincible Armor" : "Fortified Ward",
      badgeColor: "#f59e0b",
      mechanics: `Mars in Leo opposite Pluto in Aquarius at 0°10′ exact orb; Saturnian 4-corner boundary anchors.`,
      advice: ruler === "Mars"
        ? "Kinetic mirror ward reflects psychic attacks tenfold back to senders. Consecrate pocket mirror."
        : (ruler === "Saturn" ? "Drive 4 forged iron stakes with black tourmaline into the four cardinal corners." : "Solar golden aura armor invoked through Archangel Raphael.")
    },
    war: {
      id: "war", glyph: "⚔️", name: "War & Dismantling Oppressors", category: "Tafriq",
      rating: ruler === "Mars" ? "98%" : (ruler === "Saturn" ? "92%" : (ruler === "Sun" ? "82%" : "65%")),
      badge: ruler === "Mars" ? "Supreme Combat Peak" : (ruler === "Saturn" ? "Crushing Siege" : "Defensive"),
      badgeColor: "#dc2626",
      mechanics: `Mars at 03°16′ Leo in 1st house in exact 0°10′ opposition to Pluto; trine Neptune (0°29′).`,
      advice: ruler === "Mars"
        ? "Engrave 5x5 Wafq of Mars on iron sheet. Strike blade into oak to shatter administrative blockades."
        : (ruler === "Saturn" ? "Crush institutional predators under slow, crushing statutory weight." : "Declare righteous spiritual combat against systemic tyranny.")
    },
    pacification: {
      id: "pacification", glyph: "🕊️", name: "Pacification & Quelling Wrath", category: "Aqd",
      rating: ruler === "Moon" ? "94%" : (ruler === "Venus" ? "88%" : (ruler === "Jupiter" ? "86%" : "60%")),
      badge: ruler === "Moon" ? "High Efficacy" : "Serene Pacification",
      badgeColor: "#a7f3d0",
      mechanics: `Moon entering Lunar Mansion 9 (Al-Tarf / The Eye) applying trine to Venus in Scorpio.`,
      advice: ruler === "Moon"
        ? "Drop silver coin into spring water with PGM Thymokatochon formula. Quells rage of judges and bosses."
        : (ruler === "Venus" ? "Soothes domestic friction and cools hostile marital grievances." : "Appeals to judicial mercy and divine higher law.")
    },
    knowledge: {
      id: "knowledge", glyph: "👁️", name: "Occult Knowledge & Prophecy", category: "Kashf",
      rating: ruler === "Mercury" ? "99%" : (ruler === "Moon" ? "95%" : (ruler === "Sun" ? "88%" : "75%")),
      badge: ruler === "Mercury" ? "Supreme Clarity (0°01′)" : "Lucid Revelation",
      badgeColor: "#2dd4bf",
      mechanics: `Mercury at 04°13′ Scorpio in EXACT Trine (0°01′ orb) to Royal Star Fomalhaut (04°15′ Pisces).`,
      advice: ruler === "Mercury"
        ? "Direct transmission from Archangel Gabriel. Crystal scrying, deciphering esoteric ciphers, and Gnosis."
        : (ruler === "Moon" ? "Water scrying and deep subconscious diagnostic revelation." : "Illuminating concealed truths and unmasking hypocrites.")
    },
    wealth: {
      id: "wealth", glyph: "💰", name: "Wealth & Material Abundance", category: "Jalb",
      rating: ruler === "Jupiter" ? "85%" : (ruler === "Sun" ? "75%" : (ruler === "Mercury" ? "70%" : "60%")),
      badge: ruler === "Jupiter" ? "Strategic Elevation" : "Prudent Accounting",
      badgeColor: "#eab308",
      mechanics: `Jupiter in Leo trine Midheaven in Aries (25°40′); Venus Rx advises strict audit over speculation.`,
      advice: ruler === "Jupiter"
        ? "4x4 Magic Square of Jupiter with saffron-musk ink for closing profitable commercial covenants."
        : (ruler === "Sun" ? "Solar blessing on honest labor and executive remuneration." : "Audit books, eliminate hidden financial waste, and negotiate contracts.")
    },
    healing: {
      id: "healing", glyph: "🩺", name: "Healing & Somatic Renewal", category: "Tahsin",
      rating: ruler === "Moon" ? "96%" : (ruler === "Sun" ? "90%" : (ruler === "Jupiter" ? "88%" : "70%")),
      badge: ruler === "Moon" ? "Cellular Rebirth" : "Vital Infusion",
      badgeColor: "#10b981",
      mechanics: `Domicile Moon in Cancer conjunct Sirius; Sun in Libra trine Royal Star Aldebaran (0°21′).`,
      advice: ruler === "Moon"
        ? "Carnelian stone in spring water charged under Sirius. Purges somatic trauma and resets nervous system."
        : (ruler === "Sun" ? "Solar prana charging to revitalize depleted adrenals." : "Infuse healing teas with benevolent Jovian blessing.")
    },
    sovereignty: {
      id: "sovereignty", glyph: "👑", name: "Sovereignty & Royal Authority", category: "Jalb",
      rating: ruler === "Sun" ? "92%" : (ruler === "Jupiter" ? "90%" : (ruler === "Mars" ? "88%" : "72%")),
      badge: ruler === "Sun" || ruler === "Jupiter" ? "Imperial Command" : "Martial Presence",
      badgeColor: "#f97316",
      mechanics: `Mars and Jupiter in regal Leo in 1st House; Sun trine Aldebaran (Royal Star of the East).`,
      advice: ruler === "Sun" || ruler === "Jupiter"
        ? "Anoint forehead with frankincense-cinnamon oil. Carry gold coin for commanding respect in high tribunals."
        : (ruler === "Mars" ? "Commanding presence and sovereign martial courage in high-stakes negotiations." : "Establish dignified personal authority without arrogance.")
    },
    discord: {
      id: "discord", glyph: "🎭", name: "Discord Among Conspirators", category: "Tafriq",
      rating: ruler === "Mars" ? "96%" : (ruler === "Mercury" ? "94%" : (ruler === "Saturn" ? "90%" : "65%")),
      badge: ruler === "Mars" || ruler === "Mercury" ? "Destructively Potent" : "Fracturing",
      badgeColor: "#7f1d1d",
      mechanics: `Fixed T-Square: Mercury in Scorpio square Mars in Leo square Pluto in Aquarius.`,
      advice: ruler === "Mars" || ruler === "Mercury"
        ? "Write conspirators' names on broken pottery with sulfur. Turn corrupt persecutors inward against each other."
        : (ruler === "Saturn" ? "Sow immovable distrust between plotting corporate rivals." : "Only deploy against documented cabals of unjust persecutors.")
    },
    invisibility: {
      id: "invisibility", glyph: "🌫️", name: "Invisibility & Psychic Cloaking", category: "Tahsin",
      rating: ruler === "Moon" ? "95%" : (ruler === "Mercury" ? "92%" : (ruler === "Saturn" ? "88%" : "70%")),
      badge: ruler === "Moon" ? "Total Shroud" : "Covert Veiling",
      badgeColor: "#64748b",
      mechanics: `Moon in 12th House (unseen realm); Neptune Rx trine Mars (0°29′); Mercury in deep Scorpio.`,
      advice: ruler === "Moon"
        ? "Wrap smoky quartz in dark silk over copal smoke with Surah Ya-Sin verse 9 (21 times). Veils assets."
        : (ruler === "Mercury" ? "Shield trade secrets, passwords, and sensitive transmissions from espionage." : "Quiet retreat into obscurity away from hostile attention.")
    },
    dreams: {
      id: "dreams", glyph: "🌙", name: "Dream Incubation & Oneiromancy", category: "Kashf",
      rating: ruler === "Moon" ? "98%" : (ruler === "Mercury" ? "94%" : (ruler === "Jupiter" ? "88%" : "70%")),
      badge: ruler === "Moon" ? "Supreme Oracle" : "Lucid Guidance",
      badgeColor: "#818cf8",
      mechanics: `Moon in 12th House conjunct Isis-Sirius; Mercury trine Fomalhaut (Watcher of Visions).`,
      advice: ruler === "Moon"
        ? "Slip saffron ink question with mugwort beneath pillowcase. Receive direct lucid guidance from Isis-Sirius."
        : (ruler === "Mercury" ? "Hermetic dream divination for solving complex mathematical and intellectual riddles." : "Spiritual visions and communion with ancestral guides.")
    }
  };

  return impacts;
}

console.log("hour_occult_impacts module defined successfully.");
module.exports = { occultPlanetarySpheres, generateHourOccultWorks };

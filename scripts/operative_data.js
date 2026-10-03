const fs = require('fs');
const path = require('path');

// 1. Define the 24 hours operative data
const hourOperativeData = {
  "N-01": {
    love: { rating: "Proscribed (20%)", desc: "Venus in detriment/Rx. Avoid sweet attraction or reconciliations. Only suitable for analytical grief journaling." },
    binding: { rating: "Moderate (65%)", desc: "Mercury in Scorpio square Mars/Pluto. Effective for binding deceitful rumors, fraud, or slandering words." },
    cleansing: { rating: "High (82%)", desc: "Fomalhaut exact trine (0°01′) purges mental confusion, cognitive distortion, and intellectual fog." },
    protection: { rating: "Fortified (78%)", desc: "Apotropaic against commercial fraud, data breach, and malicious misdirection; Hermes boundary seal." }
  },
  "N-02": {
    love: { rating: "Severance Only (35%)", desc: "Moon trine Venus Rx in Scorpio allows gentle dissolution of past emotional attachments without malice." },
    binding: { rating: "Good (75%)", desc: "Moon square Saturn allows binding through emotional resonance or silencing domestic complaints." },
    cleansing: { rating: "Supreme (96%)", desc: "Moon in Domicile Cancer conjunct Sirius (1°37′). Peak window for herbal salt baths and evil eye purging." },
    protection: { rating: "High (85%)", desc: "Maternal psychic shield; protects infants, homes, dreams, and personal sanctuary from night terror." }
  },
  "N-03": {
    love: { rating: "Strictly Forbidden (05%)", desc: "Saturn culminating in Aries square Moon. Invocations of love curdle into freezing contempt and bitter hatred." },
    binding: { rating: "Supreme Peak (99%)", desc: "Last Quarter Moon exact square Saturn. Master window for lead defixiones, padlocks, and tongue-tying." },
    cleansing: { rating: "Moderate (55%)", desc: "Too heavy and melancholic for gentle purification; only suitable for harsh exorcisms of stubborn haunts." },
    protection: { rating: "Maximum (98%)", desc: "Saturnian stone fortress. Driving iron boundary stakes into the four corners of the perimeter." }
  },
  "N-04": {
    love: { rating: "Mild Detachment (45%)", desc: "Benevolent philosophical perspective on relationships; excellent for forgiving past emotional debts." },
    binding: { rating: "Moderate (60%)", desc: "Binding unjust corporate predators or legal adversaries to strict ethical covenants." },
    cleansing: { rating: "High (88%)", desc: "Spiritual elevation and sanctification; washing away poverty consciousness and moral guilt." },
    protection: { rating: "High (90%)", desc: "Archangelic canopy of Sachiel and Raphael; invokes divine mercy and protection from corrupt officials." }
  },
  "N-05": {
    love: { rating: "Catastrophic Hazard (02%)", desc: "Mars opposite Pluto (0°10′). Love rituals will provoke violent rage, physical confrontation, and ruin." },
    binding: { rating: "High (86%)", desc: "Aggressive iron chain bindings; shattering the astral weapons of an enemy before they strike." },
    cleansing: { rating: "Purging by Fire (75%)", desc: "Cauterizing energetic wounds; scorching demonic parasites and burning contaminated spiritual ties." },
    protection: { rating: "Invincible (99%)", desc: "Kinetic mirror shield; reflects hexes, curses, and malice back to sender with tenfold velocity." }
  },
  "N-06": {
    love: { rating: "Poor / Discordant (30%)", desc: "Sun in Fall in Libra opposite Saturn. Ego clashes, patronizing behavior, and mutual resentment." },
    binding: { rating: "Moderate (65%)", desc: "Binding oath-breakers by invoking the Solar all-seeing eye under the earth." },
    cleansing: { rating: "Moderate (70%)", desc: "Subterranean solar purification; illuminating deeply repressed shadow patterns." },
    protection: { rating: "High (85%)", desc: "Royal star Aldebaran trine Sun; shields the soul's sovereign dignity against humiliation." }
  },
  "N-07": {
    love: { rating: "Supreme for Severance (95%)", desc: "Venus stationary in Scorpio. Picatrix and Shams cord-cutting (Tafriq). Cut toxic cords with iron blade." },
    binding: { rating: "High (84%)", desc: "Binding erotic obsession and lust-based attachments; tying knots to hold sexual boundaries firm." },
    cleansing: { rating: "High (86%)", desc: "Cleansing reproductive and sacral chakra trauma; washing away lingering astral imprints of past lovers." },
    protection: { rating: "Moderate (68%)", desc: "Warding against psychic seduction, emotional manipulation, and narcissistic entrapment." }
  },
  "N-08": {
    love: { rating: "Analytical Only (25%)", desc: "Scrying relational root causes; intellectual autopsy of failed relationships." },
    binding: { rating: "High (92%)", desc: "Mercury in Scorpio under Saturn day. Supreme for silencing slanders, courtroom witnesses, and liars." },
    cleansing: { rating: "Supreme (95%)", desc: "Exact Fomalhaut Trine (0°01′). Archangel Gabriel cleanses intellect, removes confusion, and purifies sight." },
    protection: { rating: "High (88%)", desc: "Hermetic boundary herms; protects esoteric books, private manuscripts, ciphers, and travel." }
  },
  "N-09": {
    love: { rating: "Shadow Dream Severance (38%)", desc: "Dream incubation to release deceased or departed lovers; unbinding unconscious emotional hooks." },
    binding: { rating: "High (88%)", desc: "Binding nocturnal incubi, succubi, night hags, and predatory thought-forms feeding on sleep." },
    cleansing: { rating: "Supreme (98%)", desc: "Deepest night Moon in Cancer entering Mansion 9 (Al-Tarf). Maximum uncrossing bath potency." },
    protection: { rating: "High (92%)", desc: "Casting the sacred lunar silver circle around the bed; shielding oneiromancy and lucid dreaming." }
  },
  "N-10": {
    love: { rating: "Strictly Forbidden (01%)", desc: "Saturn near zenith descending. Love petitions turn into cold estrangement, sterility, and silence." },
    binding: { rating: "Supreme Peak (99%)", desc: "4-corner iron boundary stakes; lead defixio buried in earth; absolute lockdown of all adversaries." },
    cleansing: { rating: "Deep Earth Purge (60%)", desc: "Drawing deep somatic trauma down through the soles of the feet into the bedrock of the earth." },
    protection: { rating: "Maximum (99%)", desc: "The Iron Wall of Cassiel. Complete sealing of the physical house against all astral intrusion." }
  },
  "N-11": {
    love: { rating: "Compassion / Grace (50%)", desc: "Spiritual agape and benevolent release; blessing former partners from a safe, detached distance." },
    binding: { rating: "Moderate (62%)", desc: "Judicial restraining; binding unjust predators by appealing to higher divine law." },
    cleansing: { rating: "High (92%)", desc: "Pre-dawn divine light infusion; washing the subtle bodies with high-vibrational celestial grace." },
    protection: { rating: "High (94%)", desc: "Archangelic shield of light; grants invulnerability against spiritual despair and demonic taunts." }
  },
  "N-12": {
    love: { rating: "Combative Friction (05%)", desc: "Volatile martial anger; explosive breakups; severing ties through confrontation." },
    binding: { rating: "High (85%)", desc: "Breaking an enemy's binding cords; snapping astral chains through raw martial assertion." },
    cleansing: { rating: "Scorching Purge (78%)", desc: "Dragon's blood and pepper fumigation; scorching lingering poltergeists before dawn." },
    protection: { rating: "Maximum (98%)", desc: "Mars rising on eastern horizon opposite Pluto. Activating the impenetrable kinetic war shield." }
  },
  "D-01": {
    love: { rating: "Sovereign Self-Love (40%)", desc: "Sun rises in Libra. Focus strictly on reclaiming self-respect and establishing balanced mutual dignity." },
    binding: { rating: "High (80%)", desc: "Binding solemn covenants and formal legal oaths at sunrise; sealing solar contracts." },
    cleansing: { rating: "High (90%)", desc: "Dawn lustration; greeting the first rays of sunlight to burn away nocturnal miasma and nightmare residue." },
    protection: { rating: "High (92%)", desc: "Solar armor of Raphael; creating a shimmering golden aura that repels darkness and depression." }
  },
  "D-02": {
    love: { rating: "Shadow Integration (35%)", desc: "Venus stationary in Scorpio. Purging low self-esteem and financial insecurity in relationships." },
    binding: { rating: "Moderate (65%)", desc: "Binding runaway financial expenditure and reckless impulse buying." },
    cleansing: { rating: "Good (75%)", desc: "Rosewater and sandalwood facial wash; clearing somatic fatigue and facial tension." },
    protection: { rating: "Moderate (70%)", desc: "Warding against social jealousy, malicious gossip, and envious rivals in artistic or social spheres." }
  },
  "D-03": {
    love: { rating: "Intellectual Distance (25%)", desc: "Analytical and emotionally detached; excellent for drafting legal separation or prenuptial terms." },
    binding: { rating: "High (88%)", desc: "Silencing fraudulent competitors, corporate espionage, and counterfeiters." },
    cleansing: { rating: "High (86%)", desc: "Mental detox; clearing digital clutter, overwhelming notifications, and nervous exhaustion." },
    protection: { rating: "High (90%)", desc: "Cybersecurity ward; protects online communications, sensitive servers, and financial accounts." }
  },
  "D-04": {
    love: { rating: "Maternal Self-Care (45%)", desc: "Nurturing the inner child; cutting energetic cords connecting you to needy emotional vampires." },
    binding: { rating: "Moderate (68%)", desc: "Domestic boundaries; binding disruptive tenants or toxic family members from crossing threshold." },
    cleansing: { rating: "Supreme (96%)", desc: "Mid-morning saltwater cleansing bath; purging residual evil eye picked up in public spaces." },
    protection: { rating: "High (90%)", desc: "Sanctuary ward; shielding home life, domestic tranquility, and private living spaces." }
  },
  "D-05": {
    love: { rating: "Frozen Isolation (02%)", desc: "Cold emotional distance; partner feels shut out; complete emotional shutdown." },
    binding: { rating: "Supreme (98%)", desc: "Midday courtroom defixio; binding judges and hostile attorneys to strict statutory restraint." },
    cleansing: { rating: "Low (45%)", desc: "Too rigid and dry; only suitable for fumigating mould, damp, and physical rot." },
    protection: { rating: "Maximum (97%)", desc: "Heavy architectural warding; placing consecrated iron boundary stones on property borders." }
  },
  "D-06": {
    love: { rating: "Ethical Friendship (55%)", desc: "Cultivating noble camaraderie, mutual professional respect, and honorable alliances." },
    binding: { rating: "Moderate (65%)", desc: "Binding corporate fraud; enforcing fair trade practices and honest bookkeeping." },
    cleansing: { rating: "High (90%)", desc: "Elevating auric radiance; clearing toxic scarcity mindsets and fear of destitution." },
    protection: { rating: "High (93%)", desc: "Patronage protection; shielding executive authority, legal standing, and public goodwill." }
  },
  "D-07": {
    love: { rating: "Explosive Discord (02%)", desc: "Extreme conflict hazard; midday Mars triggers fiery confrontation and mutual insult." },
    binding: { rating: "High (85%)", desc: "Severing adversarial alliances; dividing conspirators who seek your downfall." },
    cleansing: { rating: "Cauterization (75%)", desc: "Violent expulsion of stubborn astral parasites through chili and dragon's blood smoke." },
    protection: { rating: "Maximum (99%)", desc: "Midday martial counter-strike; unmasking hidden enemies and reflecting attacks back instantly." }
  },
  "D-08": {
    love: { rating: "Exposing Illusions (30%)", desc: "Harsh daylight reveals hidden infidelities and unfulfilled promises; not for romantic overtures." },
    binding: { rating: "Moderate (68%)", desc: "Sealing public covenants and formal business oaths under high solar visibility." },
    cleansing: { rating: "High (88%)", desc: "Solar charging of quartz crystals; burning off lingering lethargy and self-doubt." },
    protection: { rating: "High (92%)", desc: "Reputational shield; protecting career prestige, honors, and public standing from smear campaigns." }
  },
  "D-09": {
    love: { rating: "Conscious Uncoupling (60%)", desc: "Mature, civilized separation agreements; clearing relational baggage with dignity." },
    binding: { rating: "Moderate (65%)", desc: "Binding addictive indulgence, emotional eating, and toxic romantic compulsions." },
    cleansing: { rating: "Good (78%)", desc: "Aromatic floral water cleansing; soothing somatic anxiety and nervous heartbeat." },
    protection: { rating: "Moderate (72%)", desc: "Guarding against social entrapment, emotional blackmail, and false flattery." }
  },
  "D-10": {
    love: { rating: "Analytical Clarity (25%)", desc: "Objective appraisal of mutual commitments; zero romantic sentimentality." },
    binding: { rating: "High (90%)", desc: "Binding deceptive contracts; silencing slanderous emails, leaks, and defamatory posts." },
    cleansing: { rating: "High (88%)", desc: "Forensic intellectual purge; clearing cognitive dissonance and media overstimulation." },
    protection: { rating: "High (92%)", desc: "Digital data protection; shielding business negotiations and confidential records." }
  },
  "D-11": {
    love: { rating: "Self-Compassion (45%)", desc: "Gentle emotional self-forgiveness; releasing relationship guilt before the close of day." },
    binding: { rating: "Moderate (65%)", desc: "Binding domestic worries; preventing workplace stress from entering the home sanctuary." },
    cleansing: { rating: "Supreme (97%)", desc: "Late afternoon lustral wash; clearing the energetic sludge of the workday before sunset." },
    protection: { rating: "High (91%)", desc: "Hearth and home defense; sealing all entranceways and windows against evening intrusions." }
  },
  "D-12": {
    love: { rating: "Strictly Forbidden (01%)", desc: "Sun-Saturn exact opposition at sunset. Bitter severance; love magic here causes irrevocable rupture." },
    binding: { rating: "Supreme Peak (100%)", desc: "Astronomical peak opposition! Ultimate window for lead defixiones, silencing foes, and final seals." },
    cleansing: { rating: "Grounding (65%)", desc: "Heavy grounding; discharging accumulated psychic radiation directly into the earth." },
    protection: { rating: "Maximum (100%)", desc: "The Sunset Iron Lock. Permanent sealing of covenants, property lines, and spiritual wards." }
  }
};

console.log("hourOperativeData loaded for all 24 hours.");
module.exports = { hourOperativeData };

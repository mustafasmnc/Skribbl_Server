const getWordHard = () => {
    const adjectives = [
        "offstage", "eureka", "zero", "riddle", "soul", "president", "psychologist", "opaque", "acre", "mine car", "landfill", "flutter", "tinting", "expired", "archaeologist", "exponential", "con", "Chick-fil-A", "stowaway", "password", "overture", "Zen", "lyrics", "pride", "translate", "nutmeg", "inertia", "addendum", "neutron", "blunt", "blacksmith", "stockholder", "positive", "gallop", "vision", "observatory", "random", "carat", "ligament", "ice fishing", "fragment", "publisher", "figment", "compromise", "Everglades", "ironic", "jig", "crisp", "interference", "implode", "philosopher", "clue", "telepathy", "drift", "handful", "champion", "intern", "default", "brunette", "slump", "armada", "loiterer", "flotsam", "pomp", "century", "mooch", "freshwater", "pastry", "lichen", "trademark", "infection", "siesta", "parody", "snag", "chaos", "czar", "tournament", "aristocrat", "reimbursement", "hang ten", "blueprint", "stout", "upgrade", "quarantine", "Atlantis", "population", "kilogram", "panic", "brainstorm", "standing ovation", "transpose", "periwinkle", "twang", "inquisition", "protestant", "tutor", "cartography", "rainwater", "coast"
    ];

    return adjectives[Math.floor(Math.random() * adjectives.length)];
};

module.exports = getWordHard;
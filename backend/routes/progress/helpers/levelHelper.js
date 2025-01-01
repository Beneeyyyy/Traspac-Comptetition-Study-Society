const calculateLevel = (xp) => {
  let level = 1;
  let xpNeeded = 100;
  let totalXpNeeded = xpNeeded;
  
  while (xp >= totalXpNeeded) {
    level++;
    xpNeeded = Math.floor(xpNeeded * 1.5);
    totalXpNeeded += xpNeeded;
  }
  
  return {
    level,
    nextLevelXP: totalXpNeeded,
    currentLevelXP: totalXpNeeded - xpNeeded,
    xpNeededForNext: totalXpNeeded - xp
  };
};

const calculateRank = (level) => {
  if (level >= 50) return "Grandmaster";
  if (level >= 40) return "Master";
  if (level >= 30) return "Expert";
  if (level >= 20) return "Advanced";
  if (level >= 10) return "Intermediate";
  if (level >= 5) return "Novice";
  return "Beginner";
};

module.exports = {
  calculateLevel,
  calculateRank
}; 
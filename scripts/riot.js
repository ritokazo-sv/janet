function winrate(wins, loses) {
    let total = wins + loses;
    return Math.round((wins * 100) / total).toFixed(0)
}

module.exports = { winrate };
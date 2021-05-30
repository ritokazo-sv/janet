function winrate(wins, loses) {
    let total = wins + loses;
    return Math.round(total).toFixed(2)
}

module.exports = { winrate };
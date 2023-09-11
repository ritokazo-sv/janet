module.exports = () => {
    return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padEnd(6, '0');
}
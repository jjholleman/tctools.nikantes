/* eslint-disable no-console */
export default {
    getAgeData(players) {
        const ages = this.getAges(players)
        const max = Math.max(...ages);
        const min = Math.min(...ages);
        const difference = max - min;

        return {
            average: ages.reduce((a, b) => a + b, 0) / ages.length,
            bandwidth: difference,
            min: min,
            max: max,
        };
    },
    getAges(players) {
        let ages = []
        players.forEach(player => {
            ages.push(player.knkv_age);
        })
        return ages;
    },
}

/* eslint-disable no-console */
const ruleColors = {
    red: {
        name: 'Rood',
        color: '#dc2222',
        vakken: 2,
        korf: 3.5,
        ball: 5,
        wisselen: 'Na 2 doelpunten',
    },
    orange: {
        name: 'Oranje',
        color: '#ff6b11',
        vakken: 2,
        korf: 3.5,
        ball: 5,
        wisselen: 'Op tijd',
    },
    yellow: {
        name: 'Geel',
        color: '#ffc500',
        vakken: 2,
        korf: 3.0,
        ball: 4,
        wisselen: 'Op tijd',
    },
    green: {
        name: 'Groen',
        color: '#1ebd4b',
        vakken: 1,
        korf: 3.0,
        ball: 4,
        wisselen: undefined,
    },
    blue: {
        name: 'Blauw',
        color: '#123cac',
        vakken: 1,
        korf: 2.5,
        ball: 3,
        wisselen: undefined,
    },
    none: {
        name: 'Geen/Onbekend',
        color: '#818493',
        vakken: undefined,
        korf: undefined,
        ball: undefined,
        wisselen: undefined,
    }
}

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
    getRuleColors() {
        return ruleColors;
    }
}

/* eslint-disable no-console */
export default {
    divisions: [
        {
            name: "Senioren",
            avg_age: {
                min: 16,
                max: 9999,
            },
            max_age: 9999,
            min_age: 19,
            indexId: 7,
            teamSize: 8,
        },
        {
            name: "A",
            avg_age: {
                min: 15.1,
                max: 18.0,
            },
            max_age: 19,
            min_age: 16,
            indexId: 6,
            teamSize: 8,
        },
        {
            name: "B",
            avg_age: {
                min: 13.1,
                max: 15.0,
            },
            max_age: 16,
            min_age: 14,
            indexId: 5,
            teamSize: 8,
        },
        {
            name: "C",
            avg_age: {
                min: 11.1,
                max: 13.0,
            },
            max_age: 14,
            min_age: 12,
            indexId: 4,
            teamSize: 8,
        },
        {
            name: "D",
            avg_age: {
                min: 9.1,
                max: 11.0,
            },
            max_age: 12,
            min_age: 10,
            indexId: 3,
            teamSize: 8,
        },
        {
            name: "E",
            avg_age: {
                min: 7.1,
                max: 9.0,
            },
            max_age: 10,
            min_age: 8,
            indexId: 2,
            teamSize: 4,
        },
        {
            name: "F",
            avg_age: {
                min: 5.1,
                max: 7.0,
            },
            max_age: 8,
            min_age: 0,
            indexId: 1,
            teamSize: 4,
        },
        {
            name: "G",
            avg_age: {
                min: 5,
                max: 999,
            },
            max_age: 999,
            min_age: 0,
            indexId: 0.5,
            teamSize: 8,
        },
        {
            name: "K",
            avg_age: {
                min: 3,
                max: 6,
            },
            max_age: 6,
            min_age: 3,
            indexId: 0.4,
            teamSize: 4,
        },

    ],
    getAllDivisions() {
        return this.divisions;
    },
    findDivisionByLetter(division, identifier) {
        return division.name === identifier
    },
    getDivisionMaxAge(divisionLetter) {
        let division = this.divisions.find(division => this.findDivisionByLetter(division, divisionLetter));
        return division.max_age;
    },
    getDivisionAgeLimit(divisionLetter) {
        let division = this.divisions.find(division => this.findDivisionByLetter(division, divisionLetter));
        return division.avg_age;
    },
    getDivisionTeamSize(divisionLetter) {
        let division = this.divisions.find(division => this.findDivisionByLetter(division, divisionLetter));
        return division.teamSize;
    }
}

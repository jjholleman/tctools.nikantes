export default {
    divisions: [
        {
            name: "Senioren",
            max_age: 9999,
            min_age: 19,
            indexId: 7,
        },
        {
            name: "A",
            max_age: 19,
            min_age: 16,
            indexId: 6,
        },
        {
            name: "B",
            max_age: 16,
            min_age: 14,
            indexId: 5,
        },
        {
            name: "C",
            max_age: 14,
            min_age: 12,
            indexId: 4,
        },
        {
            name: "D",
            max_age: 12,
            min_age: 10,
            indexId: 3,
        },
        {
            name: "E",
            max_age: 10,
            min_age: 8,
            indexId: 2,
        },
        {
            name: "F",
            max_age: 8,
            min_age: 0,
            indexId: 1,
        }
    ],
    getAllDivisions() {
        return this.divisions;
    },
    getDivisionMaxAge(divisionLetter) {
        let division = this.divisions.find(division => {return division.name === divisionLetter});
        return division.max_age;
    }
}

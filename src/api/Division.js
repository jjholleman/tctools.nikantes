export default {
    divisions: [
        {
            name: "Senioren",
            max_age: 9999,
            min_age: 19
        },
        {
            name: "A",
            max_age: 19,
            min_age: 16
        },
        {
            name: "B",
            max_age: 16,
            min_age: 14
        },
        {
            name: "C",
            max_age: 14,
            min_age: 12
        },
        {
            name: "D",
            max_age: 12,
            min_age: 10
        },
        {
            name: "E",
            max_age: 10,
            min_age: 8
        },
        {
            name: "F",
            max_age: 8,
            min_age: 0
        }
    ],
    getAllDivisions() {
        return this.divisions;
    }
}

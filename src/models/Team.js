import DivisionAPI from "../api/Division";

export class Team {
    constructor(data) {
        this._division = data.division;
        this._divrank = data.divrank;
        this._players = data.players || {males: [], females: []};
        this._divisionIndex = "";
        this.setDivisionIndex()
    }

    setDivisionIndex() {
        const divisions = DivisionAPI.getAllDivisions();
        divisions.forEach(division => {
            if (division.name === this._division) {
                this._divisionIndex = division.indexId - (this._divrank / 100);
            }
        });
    }

    get divrank() {
        return this._divrank;
    }

    set divrank(rank) {
        this._divrank = rank;
    }

    get division() {
        return this._division;
    }

    set division(division) {
        this._division = division;
    }

    get players() {
        return this._players;
    }

    set players(collection) {
        this._players = collection;
    }

    addPlayer(player) {
        this._players = this._players.push(player)
    }

    toJSON() {
        return {
            division: this._division,
            divrank: this._divrank,
            players: this._players,
            divisionIndex: this._divisionIndex,
        }
    }
}

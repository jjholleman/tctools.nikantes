export class Team {
    constructor(data) {
        this._division = data.division;
        this._divrank = data.divrank;
        this._players = data.players || [];
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
        }
    }
}

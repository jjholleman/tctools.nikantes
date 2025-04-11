export class Team {
    constructor(data) {
        this._name = data.name;
        this._ruleColor = data.ruleColor || null;
        this._players = data.players || [];
        this._staff = data.staff || [];
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get ruleColor() {
        return this._ruleColor;
    }

    set ruleColor(value) {
        this._ruleColor = value;
    }

    get staff() {
        return this._staff;
    }

    set staff(value) {
        this._staff = value;
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
            name: this._name,
            ruleColor: this._ruleColor,
            players: this._players,
            staff: this._staff,
        }
    }
}

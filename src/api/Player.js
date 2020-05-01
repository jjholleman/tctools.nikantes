import nikantesleden from '@/assets/nikantesleden.json'
import DivisionAPI from '@/api/Division'
import moment from 'moment'

export default {
    getAllPlayers(nextSeason) {
        let players = [];
        nikantesleden.forEach(data => {
            let person = {};
            person.firstname = data.Roepnaam;
            person.lastname = data.Achternaam;
            person.middlename = data['Tussenvoegsel(s)'];
            person.date_of_birth = moment(data.Geboortedatum, 'DD-MM-YYYY');
            person.fullname = data["Volledige naam (1)"];

            // Get the persons age and age on the checkdate
            person.age = moment().diff(person.date_of_birth, "years");
            if(nextSeason === true) {
                let checkdate = moment(this.getCheckDate()).set("year", moment().year() + 1);
                person.knkv_age = moment(checkdate).diff(person.date_of_birth, 'years')
            } else{
                person.knkv_age = moment(this.getCheckDate()).diff(
                    person.date_of_birth,
                    "years"
                );
            }

            // Calculate the lowest accepted team the person can play in, based on the divisions data
            DivisionAPI.getAllDivisions().forEach(function (division) {
                if (
                    person.knkv_age <= division.max_age &&
                    person.knkv_age >= division.min_age
                ) {
                    person.limit_team = division.name;
                }

            });

            players.push(person)
        });
        return players;
    },
    getCheckDate() {
            let date = moment().dayOfYear(1);
            if (moment().format("M") >= 7) { //7 = August. Moment starts months from 0
                date = date.set("year", moment().year() + 1);
            }
            return date;
    },
}

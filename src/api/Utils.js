import moment from "moment";

export default {
    timeSinceLogin() {
        const lastLogin = moment(new Date(localStorage.getItem("lastLogin")));
        const now = moment();
        return now.diff(lastLogin, 'days');
    },
}

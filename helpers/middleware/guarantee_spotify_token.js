
let guarantee_spotify_token = {

    isExpired: function (expiry_time) {

        let currentDate = new Date();
        let currentTime = Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(),
            currentDate.getUTCDate(), currentDate.getUTCHours(), currentDate.getUTCMinutes(),
            currentDate.getUTCSeconds(), currentDate.getUTCMilliseconds());

        return (currentTime > expiry_time);

    },

    transferControl: function (res, display_name, access_token, refresh_token, next) {
        res.locals.display_name = display_name;
        res.locals.access_token = access_token;
        res.locals.refresh_token = refresh_token;
        next();
    }



};

module.exports = guarantee_spotify_token;
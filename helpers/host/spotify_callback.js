
let spotify_ops = require('../spotify_ops');

let spotify_callback = {

    getTokensRequestOptions: function (code) {

        let options = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                client_id: spotify_ops.credentials.client_id,
                client_secret: spotify_ops.credentials.client_secret,
                redirect_uri: spotify_ops.credentials.redirect_uri,
                grant_type: 'authorization_code'
            },

            json: true
        };

        return options;

    },

    getDisplayNameOptions: function (access_token) {

        let options = {
            url: 'https://api.spotify.com/v1/me',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
        };

        return options;

    },

    getTokensUpdateOperator: function (access_token, refresh_token, expiration_time) {

        let UPDATE = {
            $set: {
                access_token: access_token,
                refresh_token: refresh_token,
                expirationTime: expiration_time
            }
        }

        return UPDATE;

    }

}

module.exports = spotify_callback;
let SpotifyWebApi = require('spotify-web-api-node');
let events = require('events');

let spotify_ops = {

    stateKey: 'spotify_auth_state',

    credentials: {
        client_id: process.env.client_id, // Your Spotify client id
        client_secret: process.env.client_secret, // Your Spotify client secret
        redirect_uri: process.env.redirect_uri // Your redirect uri
    },

    getCurrentTime: function () {
        let currentDate = new Date();
        let currentTime = Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(),
            currentDate.getUTCDate(), currentDate.getUTCHours(), currentDate.getUTCMinutes(),
            currentDate.getUTCSeconds(), currentDate.getUTCMilliseconds());

        return currentTime;
    },

    getExpiryTime: function () {
        let expirationTime = 3300000 + this.getCurrentTime();
        return expirationTime;
    },

    makeTrackURI: function (track_id) {
        return "spotify:track:" + track_id;
    },

    getPlaylistImage: function (images) {

        if (images.length > 0) {
            if (images[2]) {
                return images[2].url;
            }

            return images[0].url;
        }

        return "http://localhost:3000/images/no_image.png";

    }

};


let spotify_api = new SpotifyWebApi(spotify_ops.credentials);

spotify_ops.getSpotifyApi = function() {
    return spotify_api;
};

let songPlayedEmitter = new events.EventEmitter();
let songAddedEmitter = new events.EventEmitter();

spotify_ops.songPlayedEmitter = function () {
    return songPlayedEmitter;
};

spotify_ops.songAddedEmitter = function () {
    return songAddedEmitter;
};

module.exports = spotify_ops;
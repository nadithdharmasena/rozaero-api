let express = require('express');
let router = express.Router();

let querystring = require('querystring');

let globals = require('../../global_modules/globals');

let spotify_ops = require('../../helpers/spotify_ops');

/**
 * @description Instructs Spotify to ask user to grant Rozaero access to their Spotify account;
 *              Redirects user to the Spotify login page
 */
router.get('/', function(req, res, next) {

    let state = globals.generateRandomAlphaNumeric(16);
    res.cookie(spotify_ops.state_key, state);

    // Types of authorization scopes requested by Rozaero
    let scope = 'user-read-private ' +
        'user-read-email ' +
        'playlist-read-private ' +
        'playlist-modify-public ' +
        'playlist-modify-private ' +
        'user-modify-playback-state ' +
        'user-read-currently-playing ' +
        'user-read-playback-state ' +
        'user-read-recently-played';

    // Generates request to Spotify, who will ask user
    // To grant Rozaero access to their Spotify account
    let url = 'https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: spotify_ops.credentials.client_id,
            scope: scope,
            redirect_uri: spotify_ops.credentials.redirect_uri,
            state: state,
            show_dialog: true
        });

    res.redirect(url);

});

module.exports = router;
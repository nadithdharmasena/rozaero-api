let express = require('express');
let router = express.Router();

let request = require('request');

let response = require('../../global_modules/response');
let dbs = require('../../global_modules/dbs');

let spotify_callback = require('../../helpers/host/spotify_callback');
let spotify_ops = require('../../helpers/spotify_ops');

/**
 * @description Serves as callback from Spotify access
 */
router.get('/', function(req, res, next) {

    // User has granted Rozaero access to their Spotify account

    let code = req.query.code || null;
    let state = req.query.state || null;
    let stored_state = req.cookies ? req.cookies[spotify_ops.state_key] : null;

    // Checks whether the current request is truly from Spotify
    if ( state === null || state !== stored_state ) {
        response.unauthorizedAccessResponse(res);
        return;
    }

    // No-branch indicates spotify_callback request is valid
    // Because the user's browser state is equal to the state received from Spotify

    res.clearCookie(spotify_ops.state_key);

    let tokens_options = spotify_callback.getTokensRequestOptions(code);

    request.post(tokens_options, function(error, token_response, body) {

        if (!error && token_response.statusCode === 200) {

            let access_token = body.access_token;
            let refresh_token = body.refresh_token;

            let display_name_options = spotify_callback.getDisplayNameOptions(access_token);

            // Use the access token to retrieve the display name associated with it from Spotify
            request.get(display_name_options, function(error, display_name_response, user_info) {

                if(!error) {

                    let expiration_time = spotify_ops.getExpiryTime();

                    const QUERY = { display_name: user_info.display_name };
                    const UPDATE = spotify_callback.getTokensUpdateOperator(access_token, refresh_token, expiration_time);

                    // Stores Spotify access and refresh tokens in Rozaero's database
                    dbs.tokensObject().updateOne(QUERY, UPDATE, {upsert: true}).then(
                        function (data) {
                            response.successResponse(res, "Registered Spotify Account");
                        }
                    ).catch(
                        function (error) {
                            response.databaseErrorResponse(res);
                        }
                    );

                } else {
                    response.unauthorizedAccessResponse(res);
                }

            });

        } else {
            response.unauthorizedAccessResponse(res);
        }
    });


});

module.exports = router;
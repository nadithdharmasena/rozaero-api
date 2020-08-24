let express = require('express');
let router = express.Router();

let response = require('../../global_modules/response');
let dbs = require('../../global_modules/dbs');

let guarantee = require('../../helpers/middleware/guarantee_spotify_token');
let spotify_ops = require('../../helpers/spotify_ops');


/**
 * @description: Ensures that each subsequent route has valid Spotify access token
 * @param token: Authorization token of user
 * @param: display_name: Spotify display name associated with the party
 *
 */
router.use(function(req, res, next) {

    const DISPLAY_NAME = req.body.display_name;
    const QUERY = {display_name: DISPLAY_NAME};

    let tokens_promise = dbs.tokensObject().find(QUERY).toArray();

    tokens_promise.then(
        function (token_info_array) {

            let refresh_token = token_info_array[0].refresh_token;

            // Ensure token associated with Spotify display name is not expired
            if (!guarantee.isExpired(token_info_array[0].expirationTime)) {

                let access_token = token_info_array[0].access_token;

                guarantee.transferControl(res, DISPLAY_NAME, access_token, refresh_token, next);

            } else {

                // Access token is expired, use stored refresh token to request a new one

                spotify_ops.getSpotifyApi().rozaero_refreshToken(refresh_token).then(
                    function (data) {

                        let expiration_time = spotify_ops.getExpiryTime();
                        let new_access_token = data.body['access_token'];

                        let token_update = {
                            $set: {
                                access_token: new_access_token,
                                expirationTime: expiration_time
                            }
                        };

                        // Set new access token for given display name and reset expiration time
                        dbs.tokensObject().updateOne(QUERY, token_update)
                            .then(
                                function (docs) {
                                    guarantee.transferControl(res, DISPLAY_NAME, new_access_token, refresh_token, next);
                                }
                            )
                            .catch(
                                function (error) {
                                    // Failed update operation at Tokens collection
                                    response.databaseErrorResponse(res);
                                }
                            );

                    }
                ).catch(
                    function (error) {
                        // Failed connection to Spotify's refresh token endpoint
                        response.spotifyErrorResponse(res);
                    }
                );
            }
        }
    ).catch(
        function (error) {
            // Failed connection to the Tokens collection
            response.databaseErrorResponse(res);
        }
    );

});

module.exports = router;
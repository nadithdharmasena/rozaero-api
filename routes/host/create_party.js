let express = require('express');
let router = express.Router();

let globals = require('../../global_modules/globals');
let response = require('../../global_modules/response');
let dbs = require('../../global_modules/dbs');

let create_party = require('../../helpers/host/create_party');
let geography = require('../../helpers/misc/geography');

/**
 * URL: /create_party
 *
 * @description Extract and store track data from given playlist;
 *              Create new party with initialization tracks;
 *              Return party code to the user
 *
 * @param token: Authorization token of user
 * @param display_name: Spotify display name associated with the party
 * @param name: Name of the party
 * @param playlist_id: ID of initialization playlist
 * @param track_total: Number of tracks on initialization playlist
 * @param latitude: Latitude (in radians) of party's center
 * @param longitude: Longitude (in radians) of party's center
 * @param radius: Radius of party's access region (meters)
 *
 */
router.post('/', function(req, res, next) {

    let do_inputs_exist = req.body.name && req.body.playlist_id && req.body.track_total && req.body.latitude && req.body.longitude && req.body.radius;

    if (!do_inputs_exist) {
        response.inputErrorResponse(res);
    }

    const HOST = res.locals.user.username;
    const NAME = req.body.name;
    const PLAYLIST_ID = req.body.playlist_id;
    const TRACK_TOTAL = parseInt(req.body.track_total);
    const LAT_DEGREE = parseFloat(req.body.latitude);
    const LONG_DEGREE = parseFloat(req.body.longitude);
    const RADIUS = parseFloat(req.body.radius);
    const ID = globals.generateRandomAlphaNumeric(10);

    const LAT_RADIAN = geography.toRad(LAT_DEGREE);
    const LONG_RADIAN = geography.toRad(LONG_DEGREE);

    let party = {
        host: HOST,
        name: NAME,
        display_name: res.locals.display_name,
        latitude: LAT_RADIAN,
        longitude: LONG_RADIAN,
        radius: RADIUS,
        id: ID
    };

    create_party.getPlaylistTracks(res.locals.access_token, PLAYLIST_ID, TRACK_TOTAL, function (error, data) {
        if (!error && data) {

            if (data.length < 2) {
                response.internalErrorResponse(res, "You need at least two songs in your playlist.");
            } else {

                let track_update_queries = [];
                let track_update_operators = [];

                if (data.length > 0) {
                    let update_track_query = create_party.makeTrackUpdateQuery(data[0]);
                    let update_track_operator = create_party.makeTrackUpdateOperator(ID, 0);

                    track_update_queries.push(update_track_query);
                    track_update_operators.push(update_track_operator);
                }

                for (let track_index = 1; track_index < data.length; track_index++) {

                    let update_track_query = create_party.makeTrackUpdateQuery(data[track_index]);
                    let update_track_operator = create_party.makeTrackUpdateOperator(ID, data.length - track_index);

                    track_update_queries.push(update_track_query);
                    track_update_operators.push(update_track_operator);

                }

                // Updating/inserting tracks with new party ID associated with them
                for (let update_index = 0; update_index < track_update_queries.length; update_index++) {
                    dbs.tracksObject().updateOne(track_update_queries[update_index], track_update_operators[update_index], {upsert: true});
                }

                party.code = globals.generateRandomAlphaNumeric(6);
                party.current = track_update_queries[0];
                party.active = false;

                dbs.partiesObject().insertOne(party).then(
                    function (docs) {
                        response.successResponse(res, party.code);
                    }
                ).catch(
                    function (error) {
                        // Failed insert to parties collection
                        response.databaseErrorResponse(res);
                    }
                );

            }

        } else {
            // Failed connection to Spotify
            response.spotifyErrorResponse(res);
        }
    });



});

module.exports = router;
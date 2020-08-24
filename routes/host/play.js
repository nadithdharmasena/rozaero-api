let express = require('express');
let router = express.Router();

let response = require('../../global_modules/response');
let dbs = require('../../global_modules/dbs');

let spotify_ops = require('../../helpers/spotify_ops');
let play = require('../../helpers/host/play');

/**
 * URL: /play
 *
 * @description: Tells Spotify to play new song and updates internal tracking to reflect new current song
 * @param token: Authorization token of user
 * @param display_name: Spotify display name associated with the party
 * @param code: Code associated with the party on which operations are to be executed
 * @param track_id: Track ID associated with track to be played
 */
router.post('/', function(req, res, next) {

    const PARTY = res.locals.party;

    const TRACK_ID = req.body.track_id;
    const TRACK_URI = spotify_ops.makeTrackURI(TRACK_ID);

    // Tell Spotify to play the new song
    let play_promise = spotify_ops.getSpotifyApi().rozaero_play({uris: [TRACK_URI]}, res.locals.access_token);

    play_promise.then(
        function (data) {

            const QUERY = {"track.id": TRACK_ID};
            let tracks_promise = dbs.tracksObject().find(QUERY).toArray();

            tracks_promise.then(
                function (tracksArray) {

                    let new_current_track = tracksArray[0];

                    const PARTY_UPDATE_QUERY = play.getPartiesUpdateQuery(PARTY.id);
                    const PARTY_UPDATE_OPERATOR = play.getPartiesUpdateOperator(new_current_track);

                    const TRACK_UPDATE_QUERY = play.getTracksUpdateQuery(new_current_track);
                    const TRACK_UPDATE_OPERATOR = play.getTracksUpdateOperator(PARTY.id, spotify_ops);

                    // Update currently playing song in Parties
                    dbs.partiesObject().update(PARTY_UPDATE_QUERY, PARTY_UPDATE_OPERATOR);

                    // Update last played time of new currently playing song
                    dbs.tracksObject().update(TRACK_UPDATE_QUERY, TRACK_UPDATE_OPERATOR);

                    // Notify system that a new song has begun
                    spotify_ops.songPlayedEmitter().emit(party.code);
                    response.successResponse(res, TRACK_ID);

                }
            ).catch(
                function (error) {
                    response.databaseErrorResponse(res);
                }
            );

        }
    ).catch(
        function (error) {
            response.spotifyErrorResponse(res);
        }
    );


});

module.exports = router;
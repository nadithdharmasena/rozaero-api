let express = require('express');
let router = express.Router();

let response = require('../../global_modules/response');
let dbs = require('../../global_modules/dbs');

let spotify_ops = require('../../helpers/spotify_ops');
let refresh_track = require('../../helpers/host/refresh_track');

/**
 * URL: /refresh_track
 *
 * @description: Determines if the currently playing track must be refreshed;
 *               Transitions to the next highest-voted song if the currently playing track
 *               is determined to need a refresh
 * @param token: Authorization token of user
 * @param display_name: Spotify display name associated with the party
 * @param code: Code associated with the party on which operations are to be executed
 */
router.post('/', function(req, res, next) {

    let access_token = res.locals.access_token;
    let party = res.locals.party;

    let current_song_promise = spotify_ops.getSpotifyApi().rozaero_getCurrentlyPlayingTrack({}, access_token);

    current_song_promise.then(
        function (data) {

            const QUERY = refresh_track.getMatchOperator(party.id);
            const PRELIM_SORT = refresh_track.getPrelimSortOperator(party.id);

            let pipeline = [QUERY, PRELIM_SORT, {$limit: 1}];

            let tracks_promise = dbs.tracksObject().aggregate(pipeline).toArray();

            tracks_promise.then(
                function (lastPlayedTrack) {

                    let current_song = data.body.item;
                    let current_song_start_time = lastPlayedTrack[0][party.id].lastPlayed;

                    if (current_song == null) {
                        response.successResponse(res, "");
                        return;
                    }

                    let expected_end = (current_song_start_time + current_song.duration_ms);

                    // Determines if the currently playing song is the expected song
                    // AKA, the song that was last played by Rozaero
                    let is_stored_song_same = current_song.id === party.current.track.id;

                    // Determines if the current time is before the expected end time of the currently playing song
                    let has_expected_end_arrived = spotify_ops.getCurrentTime() < expected_end;

                    if (is_stored_song_same && has_expected_end_arrived && data.body.progress_ms !== 0 ) {
                        // Branch indicates that the currently playing song has not yet ended
                        response.successResponse(res, "");
                    } else {
                        // Branch indicates that the currently playing song has ended

                        const SECONDARY_SORT = refresh_track.getSecondarySortOperator(party.id);
                        const PROJECTION = refresh_track.getProjectionOperator();

                        pipeline = [QUERY, SECONDARY_SORT, {$limit: 1}, PROJECTION];

                        // Get the next song in line, which will become the next currently playing song
                        tracks_promise = dbs.tracksObject().aggregate(pipeline).toArray();

                        tracks_promise.then(
                            function (tracksArray) {

                                let new_current_track = tracksArray[0];

                                const PARTY_UPDATE_QUERY = refresh_track.getPartiesUpdateQuery(party.id);
                                const PARTY_UPDATE_OPERATOR = refresh_track.getPartiesUpdateOperator(new_current_track);

                                const TRACK_UPDATE_QUERY = refresh_track.getTracksUpdateQuery(new_current_track);
                                const TRACK_UPDATE_OPERATOR = refresh_track.getTracksUpdateOperator(party.id, spotify_ops);

                                // Generate formatted Spotify track URI
                                const TRACK_URI = spotify_ops.makeTrackURI(new_current_track.track.id);

                                // Tell Spotify to play new song
                                let play_promise = spotify_ops.getSpotifyApi().rozaero_play({uris: [TRACK_URI]}, res.locals.access_token);

                                play_promise.then(
                                    function (data) {

                                        // Update currently playing song in Parties
                                        dbs.partiesObject().update(PARTY_UPDATE_QUERY, PARTY_UPDATE_OPERATOR);

                                        // Update last played time of new currently playing song
                                        dbs.tracksObject().update(TRACK_UPDATE_QUERY, TRACK_UPDATE_OPERATOR);

                                        // Notify system that a new song has begun
                                        spotify_ops.songPlayedEmitter().emit(party.code);
                                        response.successResponse(res, "");
                                    }
                                ).catch(
                                    function (error) {
                                        response.spotifyErrorResponse(res);
                                    }
                                );

                            }
                        ).catch(
                            function (error) {
                                response.databaseErrorResponse(res);
                            }
                        );

                    }

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
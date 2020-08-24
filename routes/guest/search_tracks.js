let express = require('express');
let router = express.Router();

let response = require('../../global_modules/response');

let spotify_ops = require('../../helpers/spotify_ops');
let track_refinement = require('../../helpers/misc/track_refinement');

/**
 * URL: /search_tracks
 *
 * @description Returns general search results given search_string
 * @param token: Authorization token of user
 * @param: display_name: Spotify display name associated with the party
 * @param: search_string: User's search
 * @param: page: Page number of the results
 *
 * @remark: Will return track objects or response indicating no more track objects remain
 */
router.post('/', function(req, res, next) {

    const ACCESS_TOKEN = res.locals.access_token;

    const SEARCH_STRING = req.body.search_string;
    const PAGE = parseInt(req.body.page);

    const LIMIT = 15;
    const OFFSET = LIMIT * (PAGE - 1);

    const OPTIONS = {
        limit: LIMIT,
        offset: OFFSET
    };

    spotify_ops.getSpotifyApi().rozaero_search(SEARCH_STRING, ["track"], OPTIONS, ACCESS_TOKEN).then(
        function (results) {

            let tracks = results.body.tracks.items;
            let tracks_array = [];

            for (let track = 0; track < tracks.length; track++) {
                let temp_track = track_refinement.getRefinedTrack(tracks[track]);
                tracks_array.push(temp_track);
            }

            response.successResponse(res, tracks_array);

        }
    ).catch(
        function (error) {
            response.exhaustedAllTracksResponse(res);
        }
    );

});

module.exports = router;
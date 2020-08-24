let express = require('express');
let router = express.Router();

let response = require('../../global_modules/response');

let spotify_ops = require('../../helpers/spotify_ops');

/**
 * URL: /get_playlists
 *
 * @description: Returns a list of playlists owned by the Spotify user associated with the given display name
 * @param token: Authorization token of user
 * @param display_name: Spotify display name associated with the party
 */
router.post('/', function(req, res, next) {

    let playlists_promise = spotify_ops.getSpotifyApi().rozaero_getUserPlaylists(null, res.locals.access_token);

    playlists_promise.then(
        function (data) {

            let playlists = [];
            let items = data.body.items;

            for (let item = 0; item < items.length; item++) {

                // Ensures only the playlists the host owns are returned
                if (items[item].owner.display_name === res.locals.display_name) {
                    let playlist_info = {
                        name: items[item].name,
                        id: items[item].id,
                        numOfTracks: items[item].tracks.total,
                        image: spotify_ops.getPlaylistImage(items[item].images)
                    };

                    playlists.push(playlist_info);
                }

            }

            response.successResponse(res, playlists);

        }
    ).catch(
        function (error) {
            response.spotifyErrorResponse(res);
        }
    );

});

module.exports = router;
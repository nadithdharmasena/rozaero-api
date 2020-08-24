
let spotify_ops = require('../spotify_ops');
let track_refinement = require('../misc/track_refinement');

let create_party = {

    /**
     * @description Return a Spotify promise for tracks from a playlist
     * @param access_token: Spotify access token for playlist owner
     * @param playlist_id: Indicates which playlist from which to request tracks
     * @param round: Indicates which round of track fetching is in progress
     * @param limit: Determines limit number of tracks to fetch
     */
    getTrackPromises: function (access_token, playlist_id, round, limit) { // NEEDS FIXING

        let offset = round * limit;

        let promise = spotify_ops.getSpotifyApi().rozaero_getPlaylistTracks(null, playlist_id, access_token, {
            offset: offset,
            limit: limit
        });

        return promise;

    },

    /**
     * @description Returns array containing all tracks on given playlist
     * @param access_token: Spotify access token for playlist owner
     * @param playlist_id: Indicates which playlist from which to request tracks
     * @param track_total: Total number of tracks on the playlist
     * @param callback: Function to call once tracks are gathered
     */
    getPlaylistTracks: function (access_token, playlist_id, track_total, callback) {

        const limit = 20;
        const rounds = Math.ceil(track_total/limit);

        let track_promises = [];

        // Generates promises for all tracks on playlist
        for (let round = 0; round < rounds; round++) {
            let promise = create_party.getTrackPromises(access_token, playlist_id, round, limit);
            track_promises.push(promise);
        }

        // Gathers all promise data into single callback
        Promise.all(track_promises)
            .then(function (data) {

                let tracks = [];

                // Gathering all tracks into single array "tracks"
                for (let data_index = 0; data_index < data.length; data_index++) {

                    let items = data[data_index].body.items;

                    for (let track_index = 0; track_index < items.length; track_index++) {
                        let new_track = items[track_index].track;
                        tracks.push(track_refinement.getRefinedTrack(new_track));
                    }
                }

                callback(null, tracks);
            })
            .catch(function(error) {
                callback(error, null);
            });
    },


    /**
     * @description Generate the query parameter for the database upsert for playlist tracks
     * @param track: Track to be inserted/updated
     */
    makeTrackUpdateQuery: function (track) {

        let QUERY = {
            album: track.album,
            artist: track.artist,
            track: track.track
        };

        return QUERY;

    },

    /**
     * @description Generate the update parameter for the database upsert for playlist tracks
     * @param party_id: Party ID for which the tracks will be added
     * @param last_played: Last played time of the track
     */
    makeTrackUpdateOperator: function (party_id, last_played) {

        let UPDATE = {
            $set: {}
        };

        UPDATE.$set[party_id] = {votes: 0, lastPlayed: last_played, addedAtTime: spotify_ops.getCurrentTime()};

        return UPDATE;

    }

};

module.exports = create_party;
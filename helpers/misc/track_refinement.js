
let track_refinement = {

    /**
     * @description Returns an array of artist objects containing their name and ID
     * @param artists: Raw array of artists from Spotify which is to be refined
     */
    getTrackArtists: function (artists) {
        let artistsInfo = [];
        for (let index = 0; index < artists.length; index++) {
            let artistInfo = {
                name: artists[index].name,
                id: artists[index].id
            };
            artistsInfo.push(artistInfo);
        }
        return artistsInfo;
    },

    /**
     * @description Return formatted track object from a Spotify track object
     * @param track: Spotify track object that is to be refined into Rozaero track object
     */
    getRefinedTrack: function (track) {

        let refined_track = {
            album: {
                name: track.album.name,
                id: track.album.id,
                image: track.album.images[1]
            },
            artist: track_refinement.getTrackArtists(track.artists),
            track: {
                name: track.name,
                id: track.id
            }
        };

        return refined_track;
    }

};

module.exports = track_refinement;
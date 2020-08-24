
let play = {

    getPartiesUpdateQuery: function (party_id) {

        let QUERY = {
            id: party_id
        };

        return QUERY;

    },

    getPartiesUpdateOperator: function (track) {

        let UPDATE = {
            $set: {
                current: track
            }
        };

        return UPDATE;

    },

    getTracksUpdateQuery: function (track) {

        let QUERY = {
            "track.id": track.track.id
        };

        return QUERY;

    },

    getTracksUpdateOperator: function (party_id, spotify_ops) {

        let UPDATE = {
            $set: {}
        };

        UPDATE.$set[party_id + ".votes"] = 0;
        UPDATE.$set[party_id + ".lastPlayed"] = spotify_ops.getCurrentTime();

        return UPDATE;

    }

};

module.exports = play;
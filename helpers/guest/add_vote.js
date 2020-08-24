
let add_vote = {

    getMatchOperator: function (id, track_id) {

        let QUERY = {
            "track.id": track_id
        };

        QUERY[id] = {$exists: true};

        return QUERY;

    },

    getUpdateOperator: function (id) {

        let UPDATE = {
            $inc: {}
        };

        UPDATE.$inc[id + ".votes"] = 1;

        return UPDATE;

    }

};

module.exports = add_vote;
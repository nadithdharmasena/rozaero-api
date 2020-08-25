
let refresh_track = {

    getMatchOperator: function (party_id) {

        let QUERY = {
            $match: {}
        };

        QUERY.$match[party_id] = {
            $exists: true
        };

        return QUERY;

    },

    getPrelimSortOperator: function (party_id) {

        let SORT = {
            $sort: {}
        };

        SORT.$sort[party_id + ".lastPlayed"] = -1;

        return SORT;

    },

    getSecondarySortOperator: function (party_id) {

        let SORT = {
            $sort: {}
        };

        // Sorts the tracks according to votes primarily
        SORT.$sort[party_id + ".votes"] = -1;

        // Settles ties by placing songs played the longest time ago first
        SORT.$sort[party_id + ".lastPlayed"] = 1;

        return SORT;

    },

    getProjectionOperator: function () {

        let PROJECT = {
            $project: {
                album: 1,
                artist: 1,
                track: 1
            }
        };

        return PROJECT;

    }

};

module.exports = refresh_track;
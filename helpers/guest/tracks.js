
let tracks = {

    getMatchOperator: function (id) {

        let QUERY = {
            $match: {}
        };

        QUERY.$match[id] = {$exists: true};

        return QUERY;

    },

    getSortOperator: function (id) {

        let SORT = {
            $sort: {}
        };

        SORT.$sort[id + ".votes"] = -1;

        return SORT;

    },

    getRefineOperator: function (id) {

        let PROJECTION = {
            $project: {
                album: 1,
                artist: 1,
                track: 1
            }
        };

        PROJECTION.$project[id] = 1;

        return PROJECTION;

    }

};

module.exports = tracks;
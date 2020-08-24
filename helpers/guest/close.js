
let geography = require('../misc/geography');

var close = {

    getActiveOperator: function () {

        let operator = {
            $match: {active: true}
        };

        return operator;

    },

    getDiffOperator: function (user_latitude, user_longitude) {

        let user_lat_cos = Math.cos(user_latitude);

        let operator = {
            $project: {
                _id: 0,
                host: 1,
                name: 1,
                display_name: 1,
                code: 1,
                id: 1,
                latitude: 1,
                longitude: 1,
                radius: 1,

                latitude_diff: {$subtract: ["$latitude", user_latitude]},
                longitude_diff: {$subtract: ["$longitude", user_longitude]},
                user_lat_cos: {$add: [user_lat_cos]},
                party_lat_cos: {$cos: "$latitude"}
            }
        };

        return operator;

    },

    getSinSquaredOperator: function () {

        let operator = {
            $project: {
                host: 1,
                name: 1,
                display_name: 1,
                code: 1,
                id: 1,
                latitude: 1,
                longitude: 1,
                radius: 1,
                user_lat_cos: 1,
                party_lat_cos: 1,

                lat_diff_sin_squared: {
                    $pow: [{
                        $sin: {
                            $divide: ["$latitude_diff", 2]
                        }
                    }, 2]
                },

                long_diff_sin_squared: {
                    $pow: [{
                        $sin: {
                            $divide: ["$longitude_diff", 2]
                        }
                    }, 2]
                }
            }
        };

        return operator;

    },

    getAlphaOperator: function () {

        let operator = {
            $project: {
                host: 1,
                name: 1,
                display_name: 1,
                code: 1,
                id: 1,
                latitude: 1,
                longitude: 1,
                radius: 1,

                alpha: {
                    $add: [
                        "$lat_diff_sin_squared",
                        {$multiply: [
                            "$long_diff_sin_squared",
                                "$user_lat_cos",
                                "$party_lat_cos"
                            ]}
                    ]
                }
            }
        };

        return operator;

    },

    getRootAlphaOperator: function () {

        let operator = {
            $project: {
                host: 1,
                name: 1,
                display_name: 1,
                code: 1,
                id: 1,
                latitude: 1,
                longitude: 1,
                radius: 1,

                root_alpha: {$sqrt: "$alpha"},
                root_complement_alpha: {$sqrt: {$subtract: [1, "$alpha"]}}
            }
        };

        return operator;

    },

    getArcTanTwoAlphaOperator: function () {

        let operator = {
            $project: {
                host: 1,
                name: 1,
                display_name: 1,
                code: 1,
                id: 1,
                latitude: 1,
                longitude: 1,
                radius: 1,

                arcTanTwoAlpha: {$atan2: ["$root_alpha", "$root_complement_alpha"]}
            }
        };

        return operator;

    },

    getMeterDistance: function () {

        let operator = {
            $project: {
                host: 1,
                name: 1,
                display_name: 1,
                code: 1,
                id: 1,
                latitude: 1,
                longitude: 1,
                radius: 1,

                distance: {$multiply: [1000, geography.EARTH_RADIUS, 2, "$arcTanTwoAlpha"]}

            }
        };

        return operator;

    },

    getRefineOperator: function () {

        let operator = {
            $project: {
                host: 1,
                name: 1,
                display_name: 1,
                code: 1,
                id: 1,
                latitude: 1,
                longitude: 1,
                radius: 1,
                distance: 1,

                returnDoc: {$lte: ["$distance", "$radius"]}
            }
        };

        return operator;

    },

    getFinalDocumentsOperator: function () {

        let operator = {
            $match: {
                returnDoc: true
            }
        };

        return operator;

    },

    getSortOperator: function () {

        let operator = {
            $sort: {
                distance: 1
            }
        };

        return operator;

    },

    getFinalizedDataOperator: function () {

        let operator = {
            $project: {
                host: 1,
                name: 1,
                code: 1,
                id: 1,
                distance: 1
            }
        };

        return operator;

    },

};

module.exports = close;

/*
*
* "host" : "ultiprince435",
        "name" : "Delta Chi Winter Formal '19",
        "display_name" : "Dilanka",
        "id" : "azuxuwmtkf",
        "latitude" : 0.65144048910941,
        "longitude" : -2.12964582307213,
        "radius" : 100,
        "code" : "CQ8U2A",
        "active" : true,

*
*
*
* */


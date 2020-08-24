let express = require('express');
let router = express.Router();

let response = require('../../global_modules/response');
let dbs = require('../../global_modules/dbs');

let tracks = require('../../helpers/guest/tracks');


/**
 * URL: /tracks
 *
 * @description: Returns the tracks associated with the given party code
 * @param token: Authorization token for user
 * @param id: Party ID of party whose tracks are being requested
 */
router.post('/', function(req, res, next) {

    const id = req.body.id;

    const QUERY = tracks.getMatchOperator(id);
    const SORT = tracks.getSortOperator(id);
    const PROJECTION = tracks.getRefineOperator(id);
    const PIPELINE = [QUERY, SORT, PROJECTION];

    let tracks_promise = dbs.tracksObject().aggregate(PIPELINE).toArray();

    tracks_promise.then(
        function (tracks_array) {
            response.successResponse(res, tracks_array);
        }
    ).catch(
        function (error) {
            response.databaseErrorResponse(res);
        }
    );



});

module.exports = router;
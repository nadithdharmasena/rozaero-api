let express = require('express');
let router = express.Router();

let response = require('../../global_modules/response');
let dbs = require('../../global_modules/dbs');

let add_vote = require('../../helpers/guest/add_vote');


/**
 * URL: /add_vote
 *
 * @description: Increments the vote total of track associated with
 *                  given trackID and party ID
 * @param token: Authorization token for user
 * @param party_id: Party ID associated with the party whose track is being incremented
 * @param track_id: Track ID associated with track to be incremented
 */
router.post('/', function(req, res, next) {

    const party_id = req.body.party_id;
    const track_id = req.body.track_id;

    const QUERY = add_vote.getMatchOperator(party_id, track_id);
    const UPDATE = add_vote.getUpdateOperator(party_id);

    let update_promise = dbs.tracksObject().updateOne(QUERY, UPDATE);

    update_promise.then(
        function (docs) {
            response.successResponse(res, "");
        }
    ).catch(
        function (error) {
            response.databaseErrorResponse(res);
        }
    );

});

module.exports = router;
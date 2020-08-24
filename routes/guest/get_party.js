let express = require('express');
let router = express.Router();

let response = require('../../global_modules/response');
let dbs = require('../../global_modules/dbs');


/**
 * URL: /get_party
 *
 * @description: Returns the party associated with the party ID
 * @param token: Authorization token for user
 * @param id: Party ID associated with the party info being requested
 */
router.post('/', function(req, res, next) {

    const id = req.body.id;
    const QUERY = {
        id: id
    };

    let parties_promise = dbs.partiesObject().find(QUERY).toArray();

    parties_promise.then(
        function (parties_array) {

            if (parties_array.length === 1) {

                const PARTY = parties_array[0];
                response.successResponse(res, PARTY);

            } else {
                response.databaseErrorResponse(res);
            }


        }
    ).catch(
        function (error) {
            response.databaseErrorResponse(res);
        }
    );


});

module.exports = router;
let express = require('express');
let router = express.Router();

let response = require('../../global_modules/response');
let dbs = require('../../global_modules/dbs');


/**
 * URL: /my_parties
 *
 * @description: Returns a list of parties hosted by the user associated with the given token
 * @param: token: Authorization token of user
 *
 */
router.post('/', function(req, res, next) {


    let account = res.locals.user;
    let parties_promise = dbs.partiesObject().find({host: account.username}).toArray();

    parties_promise.then(
        function (parties_array) {

            let ret_array = parties_array.map((party) => {

                let refined_party = {
                    name: party.name,
                    id: party.id,
                    code: party.code,
                    active: party.active
                };

                return refined_party;

            });

            response.successResponse(res, ret_array);
        }
    ).catch(
        function (error) {
            response.databaseErrorResponse(res);
        }
    );

});

module.exports = router;
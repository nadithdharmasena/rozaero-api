let express = require('express');
let router = express.Router();

let response = require('../../global_modules/response');
let dbs = require('../../global_modules/dbs');


/**
 * URL: /my_parties
 *
 * @description: Returns a list of parties the user associated
 *                  with the given token hosts
 * @param: token: Authorization token of user
 *
 */
router.post('/', function(req, res, next) {

    const TOKEN = req.body.token;

    let accounts_promise = dbs.accountsObject().find({token: TOKEN}).toArray();

    accounts_promise.then(
        function (accounts_array) {
            if (accounts_array.length > 0) {

                let account = accounts_array[0];
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


            } else {
                response.noUserAssociatedResponse(res);
            }
        }
    ).catch(
        function (error) {
            response.databaseErrorResponse(res);
        }
    );


});

module.exports = router;
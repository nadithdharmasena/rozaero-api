let express = require('express');
let router = express.Router();

let response = require('../../global_modules/response');
let dbs = require('../../global_modules/dbs');

/**
 * URL: /user_info
 *
 * @description: Returns information about the user associated
 *                  with the given token
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
                let account_info = {
                    username: account.username
                };

                response.successResponse(res, account_info);

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
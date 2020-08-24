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

    let account = res.locals.user;
    let account_info = {
        username: account.username
    };

    response.successResponse(res, account_info);

});

module.exports = router;
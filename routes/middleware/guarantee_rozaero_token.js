let express = require('express');
let router = express.Router();

let response = require('../../global_modules/response');
let dbs = require('../../global_modules/dbs');

/**
 * @description: Ensures that the user has a validated authorization token
 * @param token: Authorization token of user
 */
router.use(function(req, res, next) {

    let token = req.body.token;

    dbs.accountsObject().find({token: token}).toArray().then(
        function (accountsArray) {
            if (accountsArray.length > 0) {
                res.locals.user = accountsArray[0];
                next();
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
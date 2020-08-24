let express = require('express');
let router = express.Router();

let bcrypt = require('bcrypt');

let response = require('../../global_modules/response');
let dbs = require('../../global_modules/dbs');

let login = require('../../helpers/noauth/login');

/**
 * URL: /login
 *
 * @description: Validates the given credentials and returns an
 *               access token
 * @param: email_address: Email address associated with account
 * @param: password: Self-explanatory
 */
router.post('/', function(req, res, next) {

    const EMAIL_ADDRESS = req.body.email;
    const PASSWORD = req.body.password;

    dbs.accountsObject().find({
        email_address: EMAIL_ADDRESS,
        active: true
    }).toArray().then(
        function (accountsArray) {

            if (accountsArray.length > 0) {

                const HASH = accountsArray[0].password;

                bcrypt.compare(PASSWORD, HASH).then(
                    function (result) {

                        if (result) {

                            const AUTH_TOKEN = login.generateToken();

                            dbs.accountsObject().updateOne({
                                email_address: EMAIL_ADDRESS
                            }, {
                                $set: {token: AUTH_TOKEN}
                            });

                            response.successResponse(res, AUTH_TOKEN);

                        } else {
                            response.wrongPasswordResponse(res);
                        }

                    }
                ).catch(
                    function (error) {
                        response.internalErrorResponse(res, "Hashing algorithm failed.");
                    }
                );

            } else {
                res.end(response.noUserAssociatedResponse(res));
            }

        }
    ).catch(
        function (error) {
            res.end(response.databaseErrorResponse(res));
        }
    );

});

module.exports = router;
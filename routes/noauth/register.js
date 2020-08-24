let express = require('express');
let router = express.Router();

let bcrypt = require('bcrypt');

let globals = require('../../global_modules/globals');
let response = require('../../global_modules/response');
let dbs = require('../../global_modules/dbs');

let register = require('../../helpers/noauth/register');


/**
 * URL: /register
 *
 * @description Creates a new user with the given credentials
 * @param: username: Selected username for new account
 * @param: email_address: Selected email address to be associated with new account
 * @param: password: Password for the new account
 * @param: retype_password: Retyped password to ensure the user typed the correct pass code
 *
 * Output: Username of the new account
 */

router.post('/', function(req, res, next) {

    const USERNAME = req.body.username;
    const EMAIL_ADDRESS = req.body.email;
    const PASSWORD = req.body.password;
    const RETYPE_PASSWORD = req.body.retype_password;

    if (PASSWORD !== RETYPE_PASSWORD) {
        response.passwordMismatchErrorResponse(res);
        return;
    }

    if (globals.email_regexp.test(EMAIL_ADDRESS) && USERNAME.length < 16) {

        dbs.accountsObject().countDocuments({username: USERNAME}).then(
            function (count) {

                if (count > 0) {

                    response.usernameErrorResponse(res);

                } else {

                    dbs.accountsObject().countDocuments({email_address: EMAIL_ADDRESS}).then(
                        function (count) {

                            if (count > 0) {
                                response.emailAddressErrorResponse(res);
                            } else {

                                // Unique username and unique email

                                bcrypt.genSalt(10).then(
                                    function (salt) {
                                        bcrypt.hash(PASSWORD, salt).then(

                                            function (hash) {

                                                let new_account = register.generateAccount(USERNAME, hash, EMAIL_ADDRESS);

                                                dbs.accountsObject().insertOne(new_account).then(
                                                    function (data) {

                                                        // Send email with confirmation code
                                                        // Non-activated accounts get deleted every 20 minutes

                                                        response.successResponse(res, new_account.username);

                                                    }
                                                ).catch(
                                                    function (error) {
                                                        response.databaseErrorResponse(res);
                                                    }
                                                );


                                            }

                                        ).catch(

                                            function (error) {
                                                response.internalErrorResponse(res, "Hashing algorithm failed.");
                                            }

                                        );
                                    }
                                ).catch(
                                    function (error) {
                                        response.internalErrorResponse(res, "Hashing algorithm failed.");
                                    }
                                );

                            }
                        }
                    ).catch(
                        function (error) {
                            response.databaseErrorResponse(res);
                        }
                    );
                }
            }
        ).catch(
            function (error) {
                response.databaseErrorResponse(res);
            }
        );
    } else {
        response.inputErrorResponse(res);
    }

});

/**
 * URL: /register/validate
 *
 * @description: Validates the email of the given username and activates the account
 * @param: username: Username of the newly created but non-activated account
 * @param: code: Activation code of the newly created but non-activated account
 *
 * Output: Success response
 */
router.post('/validate', function (req, res, next) {

    let USERNAME = req.body.username;
    let CODE = req.body.code;

    dbs.accountsObject().find({
        username: USERNAME,
        active: false
    }).toArray().then(
        function (accounts) {

            if (accounts.length !== 1) {
                response.internalErrorResponse(res, "Too many accounts associated with username.");
            } else {

                if (CODE === accounts[0].activationCode) {
                    // Activate account

                    dbs.accountsObject().updateOne({
                        username: USERNAME
                    }, {
                        $set: {active: true}
                    }, {});

                    response.successResponse(res, null)

                } else {
                    // Wrong code

                    response.wrongCodeResponse(res);

                }


            }

        }
    ).catch(
        function (error) {
            response.databaseErrorResponse(res);
        }
    );

});

module.exports = router;

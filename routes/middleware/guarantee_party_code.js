let express = require('express');
let router = express.Router();

let response = require('../../global_modules/response');
let dbs = require('../../global_modules/dbs');

/**
 * @description: Ensures that each subsequent routes have the correct party object in storage
 * @param token: Authorization token of user
 * @param display_name: Spotify display name associated with the party
 * @param code: Party code associated with the party on which operations are to be executed
 */
router.use(function(req, res, next) {

    let code = req.body.code;

    let partiesPromise = dbs.partiesObject().find({code: code}).toArray();

    partiesPromise.then(
        function (partyArray) {
            switch (partyArray.length) {
                case 0:
                    // If no party is associated with the given code, then there has been internal data corruption
                    response.databaseErrorResponse(res);
                    break;
                case 1:

                    if (res.locals.user.username === partyArray[0].host) {
                        res.locals.party = partyArray[0];
                        next();
                    } else {
                        response.unauthorizedAccessResponse(res);
                    }

                    break;
                default:
                    // If more than one party is associated with the given code, then there has been internal data corruption
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
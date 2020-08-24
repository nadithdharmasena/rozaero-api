let express = require('express');
let router = express.Router();

let response = require('../../global_modules/response');
let dbs = require('../../global_modules/dbs');

let close = require('../../helpers/guest/close');
let geography = require('../../helpers/misc/geography');

/**
 * URL: /close
 *
 * @description: Returns the parties with access regions including the user's current location
 * @param: Authorization token for user
 * @param: latitude: Latitude of user
 * @param: longitude: Longitude of user
 */
router.post('/', function(req, res, next) {

    const user_latitude_degrees = req.body.latitude;
    const user_longitude_degrees = req.body.longitude;

    const user_latitude = geography.toRad(user_latitude_degrees);
    const user_longitude = geography.toRad(user_longitude_degrees);

    // NOTE: Latitudes, Longitudes of party centers must be in radian

    let pipeline = [
        close.getActiveOperator(),
        close.getDiffOperator(user_latitude, user_longitude),
        close.getSinSquaredOperator(),
        close.getAlphaOperator(),
        close.getRootAlphaOperator(),
        close.getArcTanTwoAlphaOperator(),
        close.getMeterDistance(),
        close.getRefineOperator(),
        close.getFinalDocumentsOperator(),
        close.getSortOperator(),
        close.getFinalizedDataOperator()
    ];

    dbs.partiesObject().aggregate(pipeline).toArray().then(
        function (partiesArray) {
            response.successResponse(res, partiesArray);
        }
    ).catch(
        function (error) {
            response.databaseErrorResponse(res);
        }
    );


});

module.exports = router;
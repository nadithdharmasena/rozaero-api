
let geography = {

    EARTH_RADIUS: 6371,

    toRad: function (degrees) {
        return degrees * (Math.PI / 180);
    }

};

module.exports = geography;
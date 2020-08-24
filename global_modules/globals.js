let SpotifyWebApi = require('spotify-web-api-node');
let dbs = require('./dbs');

var globals = {

    email_regexp: /^[A-Za-z0-9_]*@[A-Za-z0-9_]*.[A-Za-z0-9]*$/,

    generateRandomAlphaNumeric: function (length) {
        let text = '';
        let possible = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }

};

module.exports = globals;
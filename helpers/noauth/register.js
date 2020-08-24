let globals = require('../../global_modules/globals');

let register = {

    generateAccount: function (username, hash, email_address) {
        let account = {
            username: username,
            password: hash,
            email_address: email_address,
            active: false,
            activationCode: globals.generateRandomAlphaNumeric(8),
            token: "",
            parties: []
        };

        return account;

    }

};

module.exports = register;
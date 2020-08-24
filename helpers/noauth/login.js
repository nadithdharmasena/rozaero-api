
let login = {

    generateToken: function () {
        let length = 64;
        let text = "";
        let possible = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;

    },

};

module.exports = login;
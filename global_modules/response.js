
let response = {

    databaseErrorResponse: function (res) {
        console.log("Database connection error.");

        let response = {
            status: 105,
            data: null
        };

        res.end(JSON.stringify(response));
    },

    internalErrorResponse: function (res, message) {
        console.log(message);

        let response = {
            status: 110,
            data: null
        };

        res.end(JSON.stringify(response));
    },

    usernameErrorResponse: function (res) {
        console.log("Already an account associated with this username.");

        let response = {
            status: 115,
            data: null
        };

        res.end(JSON.stringify(response));
    },

    emailAddressErrorResponse: function (res) {
        console.log("Already an account associated with this email address.");

        let response = {
            status: 120,
            data: null
        };

        res.end(JSON.stringify(response));
    },

    inputErrorResponse: function (res) {
        console.log("There was an error with the user's input.");

        let response = {
            status: 125,
            data: null
        };

        res.end(JSON.stringify(response));
    },

    wrongCodeResponse: function (res) {
        console.log("The code entered was not correct.");

        let response = {
            status: 130,
            data: null
        };

        res.end(JSON.stringify(response));
    },

    passwordMismatchErrorResponse: function (res) {
        console.log("The passwords do not match.");

        let response = {
            status: 145,
            data: null
        };

        res.end(JSON.stringify(response));
    },

    noUserAssociatedResponse: function (res) {
        console.log("There is no user associated with this email address.");

        let response = {
            status: 150,
            data: null
        };

        res.end(JSON.stringify(response));
    },

    wrongPasswordResponse: function (res) {
        console.log("The password is incorrect.");

        let response = {
            status: 155,
            data: null
        };

        res.end(JSON.stringify(response));
    },

    exhaustedAllTracksResponse: function (res) {
        console.log("All of the songs have been exhausted.");

        let response = {
            status: 160,
            data: null
        };

        res.end(JSON.stringify(response));
    },

    spotifyErrorResponse: function (res) {

        console.log("Failed connection to Spotify.");

        let response = {
            status: 165,
            data: "Failed connection to internal service."
        };

        res.end(JSON.stringify(response));

    },

    unauthorizedAccessResponse: function (res) {

        console.log("User attempted to access unauthorized resources.");

        let response = {
            status: 170,
            data: "Attempted to access unauthorized resources."
        };

        res.end(JSON.stringify(response));

    },

    successResponse: function (res, data) {
        let response = {
            status: 200,
            data: data
        };

        res.end(JSON.stringify(response));
    }

};

module.exports = response;
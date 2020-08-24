let mongo = require('mongodb').MongoClient;
const assert = require('assert');

let accountsObj; // Accounts collection object
let tracksObj; // Tracks collection object
let partiesObj; // Parties collection object
let tokensObj; // Tokens collection object
let errorObj; // Error object

// Connection URL
const url = 'mongodb://djvadmin:musical@localhost:27017/?authMechanism=SCRAM-SHA-1&authSource=DJV';
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongo.connect(url, options, function(error, client){
    if (!error && client) {

        assert.equal(null, error);

        let DJV = client.db("DJV");

        // Connecting to Accounts collection below

        DJV.collection("Accounts", function(error, accounts) {
            if (!error) {
                accountsObj = accounts;
            } else {
                accountsObj = false;
                errorObj = error;
            }
        });

        DJV.collection("Tokens", function(error, tokens) {
            if (!error) {
                tokensObj = tokens;
            } else {
                tokensObj = false;
                errorObj = error;
            }
        });

        DJV.collection("Parties", function(error, parties) {
            if (!error) {
                partiesObj = parties;
            } else {
                partiesObj = false;
                errorObj = error;
            }
        });

        DJV.collection("Tracks", function(error, tracks) {
            if (!error) {
                tracksObj = tracks;
            } else {
                tracksObj = false;
                errorObj = error;
            }
        });

    } else {
        errorObj = error;
    }
});

let dbs = {

    accountsObject: function () {
        return accountsObj;
    },

    tokensObject: function () {
        return tokensObj;
    },

    partiesObject: function () {
        return partiesObj;
    },

    tracksObject: function () {
        return tracksObj;
    }

};

module.exports = dbs;
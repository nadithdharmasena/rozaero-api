let mongo = require('mongodb').MongoClient;
const assert = require('assert');

var accountsObj; // Accounts collection object
var tracksObj; // Tracks collection object
var partiesObj; // Parties collection object
var tokensObj; // Tokens collection object
var imagesObj; // Images collection object
var forgottenObj; // Forgotten collection object
var errorObj; // Error object

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

        DJV.collection("Tracks", function(error, tracks) {
            if (!error) {
                tracksObj = tracks;
            } else {
                tracksObj = false;
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

        DJV.collection("Tokens", function(error, tokens) {
            if (!error) {
                tokensObj = tokens;
            } else {
                tokensObj = false;
                errorObj = error;
            }
        });

        DJV.collection("Images", function(error, images) {
            if (!error) {
                imagesObj = images;
            } else {
                imagesObj = false;
                errorObj = error;
            }
        });

        DJV.collection("Forgotten", function(error, forgotten) {
            if (!error) {
                forgottenObj = forgotten;
            } else {
                forgottenObj = false;
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
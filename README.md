# Rozaero API
Rozaero is a cooperative playlist generator that allows guests to influence the composition and order of an event's playlist.

## Acronyms

* RAT - Rozaero Authorization Token
    * Token extended to users who have successfully authenticated themselves by logging in
* PC - Party Code
    * Code that uniquely identifies a party

## Endpoints

The following endpoints service the operational needs of Rozaero's front-end iOS application. Each endpoint's inputs
are outlined in the headers of their respective implementation files. These implementation files are housed in `routes`.

#### Login and Registration Operations

* /login
    * Validates the given credentials and returns a RAT
* /register
    * Creates a new user with the given credentials
* /register/validate
    * Validates the email of the given username and activates the account

#### Primary Operations
These endpoints will be used extensively by party guests as they are using the Rozaero mobile app.

* /close
    * Returns the parties with access regions including the user's current location
* /add_vote
    * Increments the vote total of the track associated with the given track ID and party ID
* /get_party
    * Returns the party associated with the party ID
* /my_parties
    * Returns a list of parties hosted by the user associated with the given RAT
* /tracks
    * Returns the tracks associated with the given PC
* /user_info
    * Returns information about the user associated with the given RAT
* /search_tracks
    * Returns general search results (for tracks) given a search string
    
#### Host Operations
These endpoints are to be used by hosts to create and manage their parties.

* /get_playlists
    * Returns a list of playlists owned by the Spotify user associated with the given display name
* /create_party
    * Creates a party given a number of inputs ranging from the name of the new party to its initialization playlist
* /play
    * Tells Spotify to play new song and updates internal tracking to reflect new currently playing song

#### Internal Operations
These endpoints are used by Rozaero's internal scripts to transition songs when they end.

* /refresh_track
    * Transitions to the next highest-priority song if the current one has ended
    
## Middleware

Rozaero uses three important middleware functions to ensure that requests are properly authenticated and carry the information
necessary to accomplish some tasks.

* guarantee_rozaero_token (`/routes/middleware/guarantee_rozaero_token.js`)
    * Ensures that only requests carrying a RAT can access routes behind this middleware
    * Guarantees protected routes have the user information associated with the given RAT
* guarantee_spotify_token (`/routes/middleware/guarantee_spotify_token.js`)
    * Ensures that only requests carrying a Spotify display name can access routes behind this middleware
    * Guarantees protected routes have a Spotify access token
* guarantee_party_code (`/routes/middleware/guarantee_party_code.js`)
    * Ensures that only requests carrying a valid PC can access routes behind this middleware
    * Guarantees protected routes have the party information associated with the given PC

## Notes

#### Modified Spotify API Node Driver

This application implements the Spotify Web API Node driver. However, important modifications have been made to this driver
to facilitate some Rozaero operations. Therefore, it should be noted that simply running `npm install` in this
project will not yield a runnable application. 

The modified Spotify API Node driver has been included in the node_modules folder. Anyone who would like to run this Node server for observation purposes must paste that file, `spotify-web-api.js`, into the `node_modules/spotify-web-api-node/src` folder after running `npm install`.

#### MongoDB Setup

Observers must also create and configure a MongoDB instance on his or her local machine. In addition to the normal setup
operations like creating a database folder (usually @ /data/db), observers must also create a Mongo database called "DJV" and
create collections with the following names: Accounts, Tokens, Parties, Tracks. Furthermore, observers must create
a Mongo user account to ensure that the database cannot be accessed by unauthorized users. Although this precaution is inconsequential on a local machine, it is good practice.

All database communications occur in `global_modules/dbs.js`. The following is the URL that describes the connection to the MongoDB instance.

`const url = 'mongodb://djvadmin:musical@localhost:27017/?authMechanism=SCRAM-SHA-1&authSource=DJV';`

* `djvadmin` is the username of the Mongo user used for database accesses
    * If you decide to name your user something different, you must replace the `djvadmin` substring with whatever your user's name is
* `musical` is the password of the Mongo user
    * If you decide to use a different password, you must replace the `musical` substring with whatever password you choose
    
The username and password fields are sensitive, so they should be held in environment variables, not in plain text strings like above setup shows. I included the connection string in this improper form to make the above explanation easier to convey.

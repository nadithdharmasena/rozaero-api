let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let dotenv = require('dotenv').config();

let guarantee_rozaero_token = require('./routes/middleware/guarantee_rozaero_token');
let guarantee_spotify_token = require('./routes/middleware/guarantee_spotify_token');
let guarantee_party_code = require('./routes/middleware/guarantee_party_code');

let spotify_login = require('./routes/host/spotify_login');
let spotify_callback = require('./routes/host/spotify_callback');

// For testing, include index
let index = require('./routes/index');

let login = require('./routes/noauth/login');
let register = require('./routes/noauth/register');

let get_party = require('./routes/guest/get_party');
let user_info = require('./routes/guest/user_info');
let close = require('./routes/guest/close');
let my_parties = require('./routes/guest/my_parties');
let tracks = require('./routes/guest/tracks');
let add_vote = require('./routes/guest/add_vote');

let create_party = require('./routes/host/create_party');
let get_playlists = require('./routes/host/get_playlists');
let search_tracks = require('./routes/guest/search_tracks');

let refresh_track = require('./routes/host/refresh_track');
let play = require('./routes/host/play');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// For testing, include index
app.use('/', index);

app.use('/login', login);
app.use('/register', register);

// The following Spotify routes allow users to grant Rozaero access to their Spotify accounts
app.use('/spotify_login', spotify_login);
app.use('/spotify_callback', spotify_callback);

// All routes below following middleware are protected by authorization
app.use(guarantee_rozaero_token);

app.use('/get_party', get_party);
app.use('/user_info', user_info);
app.use('/close', close);
app.use('/my_parties', my_parties);
app.use('/tracks', tracks);
app.use('/add_vote', add_vote);

// All routes below following middleware require a Spotify display name,
// Which will translate into an access token
app.use(guarantee_spotify_token);

app.use('/create_party', create_party);
app.use('/get_playlists', get_playlists);
app.use('/search_tracks', search_tracks);

// All routes below following middleware require a party code,
// Which will translate into a party object
app.use(guarantee_party_code);

app.use('/play', play);
app.use('/refresh_track', refresh_track);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

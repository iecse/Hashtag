const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const mongoose = require('mongoose');

const upload = require('./routes/upload');
const user = require('./routes/user');
const admin = require('./routes/admin');
const index = require('./routes/index');
const auth = require('./routes/auth')(passport);
const configDb = require('./config/database');

mongoose.connect(configDb.database);
mongoose.connection.on('connected', () => {
	console.log('Connected to database ' + configDb.database);
});

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(session({secret: 'blah'}));
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/', index);
app.use('/auth', auth);
app.use('/upload', upload);
app.use('/user', user);
app.use('/admin', admin);
app.use(redirectUnmatched);

function redirectUnmatched(req, res) {
  res.redirect('/');
}

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
	    console.log(err);
        res.send('error');
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send('Error occured');
});

const port = 3000;
app.listen(port, () => {
	console.log('Listening on port ' + port);
});

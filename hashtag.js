const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const mongoose = require('mongoose');

const upload = require('./routes/upload');
const user = require('./routes/user');
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

const port = 3000;
app.listen(port, () => {
	console.log('Listening on port ' + port);
});
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user');
const configAuth = require('./auth');

module.exports = passport => {

	passport.serializeUser((user, done) => {
		done(null, user._id);
	});

	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => {
			let nameConst = user._id;
			if(user['facebook']['name'])
				nameConst = user.facebook.name;
			else if(user['google']['name'])
				nameConst = user.google.name;
			done(err, {_id: user._id, name: user.name, nameConst: nameConst});
		});
	});

	passport.use('facebook', new FacebookStrategy({
			clientID: configAuth.fbAuth.clientID,
			clientSecret: configAuth.fbAuth.clientSecret,
			callbackURL: configAuth.fbAuth.callbackURL,
			profileFields: ['id', 'emails', 'displayName']
		},
		(token, refreshToken, profile, done) => {
			process.nextTick(() => {
				User.findOne({ 'facebook.id': profile.id }, (err, user) => {
					if (err)
						return done(err);
					if (user)
						return done(null, user);
					else {
						let newUser = new User();
						newUser.name = profile.displayName;
						newUser.email = profile.emails[0].value;
						newUser.facebook.id = profile.id;
						newUser.facebook.token = token;
						newUser.facebook.email = profile.emails[0].value;
						newUser.facebook.name = profile.displayName;
						newUser.save(err => {
							if (err) throw err;
							return done(null, newUser);
						});
					}
				});
			});
		}));
	 passport.use('google', new GoogleStrategy({
			clientID: configAuth.googleAuth.clientID,
			clientSecret: configAuth.googleAuth.clientSecret,
			callbackURL: configAuth.googleAuth.callbackURL
		},
		(token, refreshToken, profile, done) => {
			process.nextTick(() => {
				User.findOne({'google.id': profile.id}, (err, user) => {
					if(err)
						return done(err);
					if(user)
						return done(null, user);
					else{
						var newUser = new User();
						newUser.name = profile.displayName;
						newUser.email = profile.emails[0].value;
						newUser.google.id = profile.id;
						newUser.google.token = token;
						newUser.google.email = profile.emails[0].value;
						newUser.google.name = profile.displayName;
						newUser.save(function(err){
							if(err)	throw err;
							return done(null, newUser);
						});
					}
				});
			});
		}));

};
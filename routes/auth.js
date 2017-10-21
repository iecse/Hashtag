const express = require('express');
const router = express.Router();

module.exports = passport => {
	
	router.get('/facebook', passport.authenticate('facebook', {scope: 'email'}));

	router.get('/facebook/callback', passport.authenticate('facebook', {
		successRedirect: '/',
		failureRedirect: '/login'
	}));
	
	router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

	router.get('/google/callback', passport.authenticate('google', {
		successRedirect: '/',
		failureRedirect: '/login'
	}));

	return router;
};

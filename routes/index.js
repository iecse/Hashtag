const express = require('express');
const router = express.Router();

router.get('/', isLoggedIn, (req, res) => {
	res.sendfile('public/main.html');
});

router.get('/login', isNotLoggedIn, (req, res) => {
	res.sendfile('public/login.html');
});

router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/login');
});

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated() && req.user.admin)
		return res.redirect('/admin');
	else if (req.isAuthenticated())
		return next();
	res.redirect('/login');
};

function isNotLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		res.redirect('/');
	else return next();
};

module.exports = router;

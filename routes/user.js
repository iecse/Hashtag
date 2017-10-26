const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/details', isLoggedIn, (req, res) => {
	res.send({
		name: req.user.name,
		email: req.user.email,
		regNo: req.user.regNo,
		membershipNo: req.user.membershipNo
	});
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/login');
};

module.exports = router;
const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/details', isLoggedIn, (req, res) => {
	let _id = req.user._id;
	User.findById(_id, (err, user) => {
		if(err) throw err;
		if(user) res.send({
			success: true,
			data:{
				name: user.name,
				email: user.email,
				regNo: user.regNo,
				membershipNo: user.membershipNo
			}
		});
		else res.send({success: false});
	});
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/login');
};

module.exports = router;
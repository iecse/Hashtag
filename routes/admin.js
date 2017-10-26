const express = require('express');
const router = express.Router();
const User = require('../models/user');
const fs = require('fs');

router.get('/', isLoggedInAndAdmin, (req, res) => {
	res.sendfile('public/admin.html');
});

router.get('/users', isLoggedInAndAdmin, (req, res) => {
	User.find({admin: false}, (err, users) => {
		res.send(users.map(delExtra));
	});
});

router.get('/submissions/:nameConst/:id', isLoggedInAndAdmin, (req, res) => {
	const nameConst = req.params.nameConst;
	const id = req.params.id;
	const dir = __dirname + '/../uploads/' + nameConst + ' - ' + id;
	fs.readdir(dir, (err, file) => {
		if(err) throw err;
		if(file) {
			const f = nameConst + ' - ' + id + '/' + file;
			res.sendfile(f, {root: 'uploads/'});
		} else res.end();
	})
});

function delExtra(user) {
	let nameConst = user._id;
	if(user['facebook']['name'])
		nameConst = user.facebook.name;
	else if(user['google']['name'])
		nameConst = user.google.name;
	return {
		regNo: user.regNo,
		membershipNo: user.membershipNo,
		name: user.name,
		email: user.email,
		nameConst: nameConst,
		id: user._id,
		submitted: user.submitted
	};
}

function isLoggedInAndAdmin(req, res, next) {
	if(req.isAuthenticated() && req.user.admin) next();
	else res.redirect('/');
};

module.exports = router;
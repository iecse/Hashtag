const express = require('express');
const router = express.Router();
const formidable = require('formidable');
const fs = require('fs');
const User = require('../models/user');
const path = require('path');

router.post('/', isLoggedIn, (req, res) => {

	let form = new formidable.IncomingForm();
	let types = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.oasis.opendocument.tex'];

	form.parse(req, (err, fields, files) => {

		updateUser(req.user._id, fields, (err, user) => {
			if(err) throw err;

			console.log(req.user.name + ': ' + files['filetoupload']['type']);
			if(types.indexOf(files['filetoupload']['type']) === -1) res.sendfile('public/success-details.html');
			else if(files['filetoupload']['size'] > 0) {	
				let oldPath = files.filetoupload.path;
				let dir = __dirname + '/../uploads/' + req.user.nameConst + ' - ' + req.user._id;
				let extention = path.extname(files.filetoupload.name);
				let newPath = dir + '/' + req.user.nameConst + extention;

				if(!fs.existsSync(dir)) {
					fs.mkdir(dir, err => {
						if(err) throw err;
						uploadFile(oldPath, newPath, err => {
							if(err) throw err;
							User.findOneAndUpdate({_id: req.user._id}, {submitted: true}, (err, user) =>{
							 	if(err) throw err;
								res.sendfile('public/success-file.html');
							});
						});
					});
				} else {
					fs.readdir(dir, (err, files) => {
						if (err) throw err;
						let file = files[0];
						fs.unlink(path.join(dir, file), err => {
							if (err) throw err;
							uploadFile(oldPath, newPath, err => {
								if(err) throw err;
								else res.sendfile('public/success-file.html');
							});
						});
					});
				}
			} else res.sendfile('public/success-details.html');

		});
	});

});

function updateUser(_id, fields, done) {
	User.findOneAndUpdate({_id: _id}, {
		name: fields.name,
		email: fields.email,
		regNo: fields.regNo,
		membershipNo: fields.membershipNo
	}, done);
}

function uploadFile(oldPath, newPath, done) {
	fs.readFile(oldPath, (err, data) => {
		if(err) done(err);
		else
			fs.writeFile(newPath, data, err => {
				if(err) done(err);
				else
					fs.unlink(oldPath, err => {
						if(err) done(err);
						else done();
					});
			});
	});
};

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/login');
};

module.exports = router;

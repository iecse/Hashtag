const express = require('express');
const router = express.Router();
const formidable = require('formidable');
const fs = require('fs');
const User = require('../models/user');
const path = require('path');
const validator = require('validator');
const request = require('request');

router.post('/', isLoggedIn, (req, res) => {

	let form = new formidable.IncomingForm();
	let types = ['application/pdf', 'text/plain'];

	form.parse(req, (err, fields, files) => {

		let captcha = fields['g-recaptcha-response'];
		if(captcha === undefined || captcha === '' || captcha === null)
			 return res.redirect('/');

		const secretKey = '6LdALDYUAAAAAKwp_nPEq9MsWMGzLMxyNMTUwMCm';

		const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}&remoteip=${req.connection.remoteAddress}`;

		request(verifyUrl, (err, response, body) => {
			body = JSON.parse(body);
			if(body.success !== undefined && !body.success)
				return res.redirect('/');
	
			updateUser(req.user, fields, (err, user) => {
				if(err) throw err;
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

});

function updateUser(user, fields, done) {
	let name = user.nameConst;
	let email = '';
	let regNo = '';
	let membershipNo = '';

	if(validator.isAlpha(fields.name.replace(/ /g, '')) && validator.isLength(fields.name.toString(), {min: 0, max: 50})) name = fields.name;
	if(validator.isEmail(fields.email)) email = fields.email;
	if(validator.isNumeric(fields.regNo.toString()) && validator.isLength(fields.regNo.toString(), {min: 9, max: 9})) regNo = fields.regNo;
	if(validator.isNumeric(fields.membershipNo.toString()) && validator.isLength(fields.membershipNo.toString(), {min: 5, max: 5})) membershipNo = fields.membershipNo;
	
	User.findOneAndUpdate({_id: user._id}, {
		name: name,
		email: email,
		regNo: regNo,
		membershipNo: membershipNo
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

const express = require('express');
const router = express.Router();
const formidable = require('formidable');
const fs = require('fs');
const User = require('../models/user');
const path = require('path');

router.post('/', isLoggedIn, (req, res) => {

	let form = new formidable.IncomingForm();

	form.parse(req, (err, fields, files) => {

		updateUser(req.user._id, fields, (err, user) => {
			if(err) throw err;
		});

		let oldPath = files.filetoupload.path;
		let dir = __dirname + '/../uploads/' + req.user._id;
		let extention = path.extname(files.filetoupload.name);
		let newPath = dir + '/' + req.user.nameConst + extention;

		if(files.filetoupload.name != '') {		
			if(!fs.existsSync(dir)) {

				fs.mkdir(dir, err => {
					if(err) throw err;
					uploadFile(oldPath, newPath, () => {

						res.sendfile('public/upload-success.html');
						// res.send({success: true, data:{msg: 'File uploaded'}})
					});
				});
			} else {
				fs.readdir(dir, (err, files) => {
					if (err) throw err;
					let file = files[0];
					fs.unlink(path.join(dir, file), err => {
						if (err) throw err;
						uploadFile(oldPath, newPath, () => {
							res.sendfile('public/upload-success.html');
							// res.send({success: true, data:{msg: 'File uploaded'}})
						});
					});
				});
			}
		} else
			res.sendfile('public/upload-success.html');
		
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
		if(err) throw err;
		else
			fs.writeFile(newPath, data, err => {
				if(err) throw err;
				else
					fs.unlink(oldPath, err => {
						if(err) throw err;
						done();
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

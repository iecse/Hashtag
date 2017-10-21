const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	name: {type: String},
	email: {type: String},
	regNo: {type: String},
	membershipNo: {type: String},
	facebook: {
		name: {type: String},
		email: {type: String},
		id: {type: String},
		token: {type: String}
	},
	google: {
		name: {type: String},
		email: {type: String},
		id: {type: String},
		token: {type: String}
	}
});

const User = module.exports = mongoose.model('User', userSchema);
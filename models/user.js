const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	name: {type: String},
	email: {type: String},
	regNo: {type: String},
	admin: {type: Boolean, default: false},
	membershipNo: {type: String},
	submitted: {type: Boolean, default: false},
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

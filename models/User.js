const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

//Create Schema
const UserSchema = new Schema({
    firstName : {
        type: String,
		required: true        
    },
    lastName : {
        type: String,
		required: true        
    },
    gender : {
        type : String,
        enum : ['male', 'female'],
        required : true
    },
	dob: {
        type: Date,
        required: true
	},
	description : {
		type: String
    },
    password : {
        type : String,
        required : true
    },
	email : {
		type: String,
        required: true,
        unique: true
    },
    phone : {
        type : String,
        required :true
    },
    location : {
        type: String
    },
	bWalletId : {
        type: String,
        unique: true
	},
	bWalletBalance : {
        type: Number,
        default : 0
	},
	eWalletId : {
        type: String,
        unique: true
    },
    eWalletBalance : {
        type: Number,
        default : 0
	},
	maxAmountAllowed : {
		type: Number,
        required: true,
        default : 1000
	},
	dateRegistered : {
		type : Date,
		default : Date.now
	}
});

UserSchema.pre('save', async function(next) {
    if(!this.email || !this.password) {
        return next(new Error("email and password are mandatory fields"));
    }
    this.email = this.email.toLowerCase();
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});



module.exports = User = mongoose.model("users", UserSchema);
const mongoose = require("mongoose")
const Schema = mongoose.Schema

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
		required: true
    },
    phone : {
        type : Number,
        required :true
    },
    location : {
        type: String
    },
	bWalletId : {
		type: String
	},
	bWalletBalance : {
		type: Number
	},
	eWalletId : {
		type: String
    },
    eWalletBalance : {
		type: String
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
})



module.exports = User = mongoose.model("users", UserSchema);
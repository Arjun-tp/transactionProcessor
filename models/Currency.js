const mongoose = require("mongoose")
const Schema = mongoose.Schema

//Create Schema
const CurencySchema = new Schema({
    currencyName : {
        type: String,
		required: true        
    },
    currencyCode : {
        type: String,
		required: true        
	},
	country: {
        type: String,
        required: true
	}
})



module.exports = Currency = mongoose.model("currency", CurencySchema);
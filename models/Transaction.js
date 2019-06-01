const mongoose = require("mongoose")
const Schema = mongoose.Schema

//Create Schema
const TransactionSchema = new Schema({
    currencyAmount : {
        type: String,
		required: true        
    },
    currencyType : {
        type: String,
		required: true        
	},
	sourceUserId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    targetUserId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    dateCreated: {
        type: Date,
    },
    dateProcessed : {
        type: Date
    },
    transactionState : {
        type : String,
        enum : ['NEW', 'IN_PROCESS', 'PENDING', 'DONE', 'FAILED'],
        default : 'NEW'
    }
})



module.exports = Transaction = mongoose.model("transaction", TransactionSchema);
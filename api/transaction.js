const pQueue = require('p-queue');
const queue = new pQueue({ concurrency: 1 });
const express = require("express");
const router = express.Router();
const UserModel = require('../models/User');
const TransactionModel = require('../models/Transaction');
var uniqid = require('uniqid');

const transaction = async (data) => {
    try {
        const {currencyType, amount, senderId, recepientId} = data;
        var newTransaction = new TransactionModel({
            currencyAmount: amount,
            currencyType: currencyType,
            sourceUserId: senderId,
            targetUserId: recepientId,
            dateCreated: new Date(),
            dateProcessed: new Date(),
            transactionState: 'NEW',
            transactionId : uniqid('TR-')
        });
        await newTransaction.save();
        const senderDetails = await UserModel.findOne({_id: senderId}).select('bWalletId bWalletBalance eWalletId eWalletBalance').lean().exec();
        const recepientDetails = await UserModel.findOne({_id: recepientId}).select('bWalletId bWalletBalance eWalletId eWalletBalance').lean().exec();
        let errorMessage = null;
        let currencyIdKey = "bWalletId";
        let currencyBalanceKey = "bWalletBalance";
        if(currencyType == "etherium") {
            currencyIdKey = "eWalletId";
            currencyBalanceKey = "eWalletBalance";
        }
        if(!senderDetails[currencyIdKey]) {
            errorMessage = `You dont have a ${currencyType} id to make transaction`;
        } else if(!recepientDetails[currencyIdKey]) {
            errorMessage = `Recepient doesnt have a ${currencyType} id to make transaction`;
        } else if(senderDetails[currencyBalanceKey] < amount) {
            errorMessage = `You dont have enough balance in your ${currencyType} wallet to make transaction`;
        }
        if(errorMessage) {
            await TransactionModel.updateOne({_id: newTransaction._id}, {$set: {transactionState: "FAILED"}}).exec();
            throw new Error(errorMessage);
        }
        const sendersUpdatedBalance = (eval(senderDetails[currencyBalanceKey]) - eval(amount));
        const recepientsUpdatedBalance = (eval(recepientDetails[currencyBalanceKey]) + eval(amount));
        await UserModel.updateOne({_id: senderId}, {$set: {[currencyBalanceKey]: sendersUpdatedBalance}}).exec();
        await UserModel.updateOne({_id: recepientId}, {$set: {[currencyBalanceKey]: recepientsUpdatedBalance}}).exec();
        await TransactionModel.updateOne({_id: newTransaction._id}, {$set: {transactionState: "DONE"}}).exec();
        return newTransaction._id;
    } catch(err) {
        console.log("error: ", err);
        await TransactionModel.updateOne({_id: newTransaction._id}, {$set: {transactionState: "FAILED"}}).exec();
        throw new Error("Unexpected error occured while processing transaction");
    }
}

async function enqueueTransactions(data) {
    return queue.add(() => transaction(data));
}

router.post("/", async (req, res) => {
    try {
        const result = await enqueueTransactions(req.body);
        res.status(200).json({
            success: true,
            message: "transaction successful",
            result
        });
    } catch(err) {
        console.log("Error in processing transaction: ", err);
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
});

module.exports = router;
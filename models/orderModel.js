const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    storeLocation: {
        type: String,
        required: true
    },
    totalItems: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {  
        type: String,
        required: true
    },
    orderDate: {
        type: Date,
        default: Date.now, // Store the current date and time by default
        required:true
    },
    userId: {
        type: String,
        required: true
    },
    selectedProducts:{
        type: Array,
        required:true
    }
});

const ordersModel = mongoose.model("orders", orderSchema);  // Fixed: `model` should be lowercase
module.exports = ordersModel;

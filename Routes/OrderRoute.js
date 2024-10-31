const express = require('express');
const ordersModel = require('../models/orderModel');
const router = express.Router();

router.post("/orders", async (req, res) => {
    const { storeLocation, totalItems, totalAmount, status, userId,selectedProducts } = req.body;

    // Basic validation to check if required fields are provided
    if (!storeLocation || !totalItems || !totalAmount || !status || !userId || !selectedProducts) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const orderItems = new ordersModel({
            storeLocation,
            totalItems,
            totalAmount,
            status,
            userId, 
            selectedProducts
        });
        await orderItems.save();
        res.status(201).json(orderItems);  // Send response on success
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to create the order" });
    }
});


router.get("/orderitems/:id", async (req, res) => {
    const id = req.params.id;

    function formatDate(date) {
        const day = date.getDate();
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = months[date.getMonth()];
        const year = date.getFullYear();

        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // Convert hour '0' to '12'

        return `${day} ${month} ${year} ${hours}:${minutes}${ampm}`;
    }

    try {
        // Fetch all orderItems for the user
        const orderItems = await ordersModel.find({ userId: id });

        // Format order date for each item
        const formattedOrderItems = orderItems.map((order) => ({
            ...order._doc, // Spread other order properties
            orderDate: formatDate(new Date(order.orderDate)) // Format the orderDate
        }));

        // Send the formatted orderItems
        res.status(201).json(formattedOrderItems);
    } catch (error) {
        console.error('Error fetching order items:', error);
        res.status(500).json({ message: 'Internal error' });
    }
});

router.patch("/cancelorder/:id", async (req,res) => {
    const id = req.params.id
    const status = req.body
    try {
        const cancelledOrder = await ordersModel.findByIdAndUpdate(id, status,  { new: true, runValidators: true })
        res.status(201).json({cancelledOrder, status}) 

    } catch (error) {
        res.status(500).json({ message: 'Internal error' });
    }
})


module.exports = router;

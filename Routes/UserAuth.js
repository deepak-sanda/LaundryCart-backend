const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router();
const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken");
// const secretKey = 'deepak'

router.post('/register', async (req, res) => {
    const { name, phone, email, state, district, address, pincode, password } = req.body;

    try {
        const user = await userModel.findOne({ email });
        const PhoneNumber = await userModel.findOne({ phone });

        // Check if user or phone number exists and return early
        if (user || PhoneNumber) {
            return res.status(401).json({ message: "Email ID or Phone Number Already Exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({
            name,
            phone,
            email,
            state,
            district,
            address,
            pincode,
            password: hashedPassword
        });

        await newUser.save();
        res.status(200).json({ message: "User Registered Successfully" });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});





router.post('/login', async (req, res) => {
    const { userCredentials, password } = req.body;

    try {
        let user;

        if (userCredentials.includes('@')) {
            user = await userModel.findOne({ email: userCredentials });
        } else {
            user = await userModel.findOne({ phone: userCredentials });
        }

        if (!user) {
            return res.status(401).json({ message: "Email or phone number is not registered" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '5h' });

        res.json({ token, username: user.name, address: user.address, district: user.district, userId: user._id });

    } catch (error) {
        res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
});

router.patch("/resetpassword", async (req, res) => {
    const { email, password } = req.body
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const selectedUser = await userModel.findOneAndUpdate(
            { email }, 
            { password: hashedPassword },
            { new: true } // Return the updated document
        );

        if (!selectedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Password changed successfully", selectedUser });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
});



module.exports = router;
const express = require('express')
const mongoose = require("mongoose")
const cors = require("cors")
const user= require('./Routes/UserAuth')
const order= require('./Routes/OrderRoute')
require('dotenv').config();



const DATABASE_URI = process.env.DATABASE_URI
const PORT = process.env.PORT || 8090

const app = express()


mongoose.connect(DATABASE_URI)
    .then(() => {
        console.log("connected to mongoDB")
    })
    .catch((err) => {
        console.log(err)
    })


app.use(express.json())
app.use(cors())

app.use('/laundry/',user)
app.use('/laundry/',order)







app.listen(PORT, () => {
    console.log("server is up at 8090")
})



import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'

const app = express()
dotenv.config({ path: "./.env" })
const port = 4000

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cors())

// database connect
mongoose.connect(process.env.DATABASE)
    .then((res) => console.log("connected"))
    .catch((err) => console.log("database error", err))

// user schema
const userSchema = new mongoose.Schema(
    {
        firstName: { type: String },
        lastName: { type: String },
        email: { type: String },
        mobileNo: { type: Number },
        address1: { type: String },
        address2: { type: String },
        city: { type: String },
        zipCode: { type: Number },
        state: { type: String },
        country: { type: String },
        countryCode: { type: Number }
    },
)

const User = mongoose.model('User', userSchema)

// get all users
app.get('/', async (req, res) => {
    try {
        const usersInfo = await User.find({})
        if (usersInfo) {
            return res.status(200).json({ status: 200, message: "successfully fetched", usersInfo })
        }
        else {
            return res.status(400).json({ status: 400, message: "failed to get data" })
        }

    } catch (error) {
        return res.status(500).json({ message: "server error", error: error })
    }
})

// create suer
app.post('/user/create', async (req, res) => {
    const { firstName, lastName, email, mobileNo, address1, address2, city, zipCode, country, state, countryCode } = req.body
    try {
        const newUser = new User({ firstName, lastName, email, mobileNo, address1, address2, city, zipCode, country, state, countryCode })
        const createdUser = await newUser.save()
        if (createdUser) {
            return res.status(200).json({ status: 200, message: "successfully created the user" })
        }
        else {
            return res.status(400).json({ status: 400, message: "failed to create user" })
        }
    } catch (error) {
        return res.status(500).json({ message: "server error", error: error })
    }
})

// update user
app.put('/user/update/:id', async (req, res) => {
    const { firstName, lastName, email, mobileNo, address1, address2, city, zipCode, country, state, countryCode } = req.body
    try {
        const updateUser = await User.findOneAndUpdate({ _id: req.params.id }, { firstName, lastName, email, mobileNo, address1, address2, city, zipCode, country, state, countryCode })
        if (updateUser) {
            return res.status(200).json({ status: 200, message: "successfully updated the user" })
        }
        else {
            return res.status(400).json({ status: 400, message: "failed to update the user" })
        }
    } catch (error) {
        return res.status(500).json({ message: "server error", error: error })
    }
})

// delete user
app.delete('/user/delete/:id', async (req, res) => {
    try {
        const deleteUser = await User.findOneAndDelete({ _id: req.params.id })
        if (deleteUser) {
            return res.status(200).json({ status: 200, message: "successfully deleted the user" })
        }
        else {
            return res.status(400).json({ status: 400, message: "failed to delete the user" })
        }
    } catch (error) {
        return res.status(500).json({ message: "server error", error: error })
    }
})


app.listen(port, () => console.log("server is running on http://localhost/" + port))

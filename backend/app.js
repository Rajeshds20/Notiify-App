// Import necessary packages
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const Authentication = require('./middleware/Authentication')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('./models/User')

// config dotenv
dotenv.config()

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))

// Initialize express app
const app = express()
app.use(express.json())
app.use(cors())

const port = process.env.port || 5000;

app.get('/', (req, res) => res.send('Notes App Server Running...'))

// New User - Register User
app.post('/user/new', async (req, res) => {
    try {
        const { mailid, password } = req.body

        // Check if user exists
        const user = await User.findOne({ mailid: mailid })
        if (user) {
            return res.status(400).json({ message: "User already exists" })
        }

        // Create new user
        const newUser = await User({
            mailid: mailid,
            password: bcrypt.hashSync(password, 10),
        })

        // Save user
        await newUser.save()
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' })

        res.json({ message: "User Created Successfully", token: token })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// User Login - Authentication
app.post('/user/login', async (req, res) => {
    try {
        const { mailid, password } = req.body

        // Check if user exists
        const user = await User.findOne({ mailid: mailid })

        if (!user) {
            return res.status(400).json({ message: "User does not exist" })
        }

        // Check if password is correct
        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(400).json({ message: "Password is incorrect" })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })

        res.json({ message: "User Logged In Successfully", token: token })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Create a new Note
app.post('/notes/new', async (req, res) => {
    try {
        const { title, content } = req.body

        // Create new note
        const newNote = await Note({
            title: title,
            content: content,
            user: req.user._id,
        })

        const user = await User.findById(req.user._id)
        user.notes.push(newNote._id)

        // Save note
        await newNote.save()

        res.json({ message: "Note Created Successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Get all Notes of the user
app.get('/notes/all', Authentication, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('notes')
        res.json({ notes: user.notes })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))

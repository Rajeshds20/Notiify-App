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

const app = express()
app.use(express.json())
app.use(cors())

const port = process.env.port || 5000;

app.get('/', (req, res) => res.send('Hello World!'))

// Import Routes
app.post('/user/new', async (req, res) => {
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
})

app.post('/user/login', async (req, res) => {
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
})

app.post('/note/new', async (req, res) => {
    const { title, content } = req.body

    // Create new note
    const newNote = await Note({
        title: title,
        content: content,
        user: req.user._id,
    })

    // Save note
    await newNote.save()

    res.json({ message: "Note Created Successfully" })
})

app.get('/note/all', Authentication, async (req, res) => {
    const notes = await Note.find({ user: req.user._id })
    

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

require('dotenv').config()
const express = require('express')
const app = express()
const expHbs = require('express-handlebars')
const mongoose = require('mongoose')
const session = require('express-session')
const myStore = new session.MemoryStore()
const expressUpload = require('express-fileupload')

const port = process.env.PORT || 5000
const {DATABASE_URL} = process.env
const {SESSION_SECRET} = process.env
// const {seedDB} = require("./seed")
const userRouter = require('./routes/user')
const cartRouter = require('./routes/cart')
const booksRouter = require('./routes/books')
const checkoutRouter = require('./routes/checkout')

app.engine('hbs', expHbs({ extname:'hbs' }))
app.set('view engine', 'hbs')

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(expressUpload())

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 900000000
    },
    store: myStore
}))

mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, (err) => {
    if (err) throw err

    // seedDB()

    console.log('MongoDB Connected')
})

app.use('/', userRouter)
app.use('/', booksRouter)
app.use('/cart', cartRouter)
app.use('/checkout', checkoutRouter)

app.all('*', (req, res) => {
    res.status(404).render('error')
})

app.listen(port, () => {
    console.log(`Server Created at ${port}`)
})
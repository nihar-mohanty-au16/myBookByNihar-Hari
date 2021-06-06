// import packages and models

const cloudinary = require('cloudinary').v2
const {Base64} = require('js-base64')
const ReviewModel = require('../models/Review')
const BookModel = require('../models/Book')

//import api secret and configure cloudinary

const {API_SECRET} = process.env  
cloudinary.config({ 
    cloud_name: 'ehvenga', 
    api_key: '294617545215198', 
    api_secret: API_SECRET 
})

exports.getHome = async (req, res) => {
    try {
        const data = {books:[]}
        const fetchBooks = await BookModel.find({}).lean()
        for (const book in fetchBooks) {
                data.books.push(fetchBooks[book])
        }
        return res.status(200).render('home', data)
    } catch (error) {
        console.log(error)
        return res.status(400).render('error', {alert: 'Internal Error: Please Try Again Later'})
    }
}

exports.getAbout = (req, res) => {
    res.render('about')
}

exports.getSearchResults = async (req, res) => {
    try {
        const data = {books:[]}
        const fetchBooks = await BookModel.find(
            {$or:[
                {"title" : { '$regex' : req.query.search, '$options' : 'i'}},
                {"author" : { '$regex' : req.query.search, '$options' : 'i'}},
                {"isbn" : { '$regex' : req.query.search, '$options' : 'i'}},
                {"genre" : { '$regex' : req.query.search, '$options' : 'i'}}
            ]}
        ).lean()
        for (const book in fetchBooks) {
            data.books.push(fetchBooks[book])
        }
        return res.status(202).render('search', data)
    } catch (error) {
        console.log(error)
        return res.status(400).render('error', {alert: 'Internal Error: Please Try Again Later'})
    }
}

exports.getBookListing = async (req, res) => {
    try {
        const fetchBook = await BookModel.findById(req.params.bookid).populate('reviews').lean()
        let data = {books: fetchBook.reviews}
        res.status(200).render('listing', {
            bookid: fetchBook._id,
            cover: fetchBook.cover,
            title: fetchBook.title,
            author: fetchBook.author,
            genre: fetchBook.genre,
            description: fetchBook.description,
            price: fetchBook.price,
            inventory: fetchBook.inventory,
            isbn: fetchBook.isbn,
            data: data
    })
    } catch (error) {
        console.log(error)
        return res.status(400).render('error', {alert: 'Internal Error: Please Try Again Later'}) 
    }
}

exports.getReviewPage = (req, res) => {
    res.status(200).render('review', {
        bookid: req.params.bookid
    })
}

exports.postReview = async (req, res) => {
    let savedReviewDoc = {}
    const {bookid} = req.body
    console.log(bookid)

    let reviewData = {
        reviewTitle: req.body.reviewTitle,
        review: req.body.review,
        rating: req.body.rating,
        reviewer: {
            id: req.session.userid, 
            name: req.session.name
        }
    }
    console.log(reviewData)

    try {
        const newReviewDoc = new ReviewModel(reviewData)
        savedReviewDoc = await newReviewDoc.save()
    } catch (error) {
        console.log(error)
        return res.status(400).render('error', {alert: 'Internal Error: Please Try Again Later'})
    }

    try {
        await BookModel.findByIdAndUpdate(
            bookid,
            {
                $push: {"reviews": savedReviewDoc._id, "reviewed": req.session.userid}
            }
        )
    } catch (error) {
        console.log(error)
        return res.status(400).render('error', {alert: 'Internal Error: Please Try Again Later'})
    }

    res.status(201).redirect(`/listing/${bookid}`)
}

exports.getBookUpload = (req, res) => {
    res.status(200).render('upload')
}

exports.uploadBook = async (req, res) => {

    try {
        const base64String = Base64.encode(req.files.cover.data)
        const uploadResult = await cloudinary.uploader.upload(`data:${req.files.cover.mimetype};base64,${base64String}`,{
            folder: "mybooks/"
        })
        
        let bookData = {
            title: req.body.title,
            author: req.body.author,
            genre: req.body.genre,
            description: req.body.description,
            price: req.body.price,
            inventory: req.body.inventory,
            isbn: req.body.isbn,
            cover: uploadResult.url,
            uploader: {id: req.session.userid, name: req.session.name},
            reviews: [],
            reviewed: []
        }

        const newBookDoc = new BookModel(bookData)
        const savedBookDoc = await newBookDoc.save()
        return res.status(201).redirect(`listing/${savedBookDoc._id}`)

    } catch (error) {
        console.log(error)
        return res.status(400).render('error', {alert: 'Internal Error: Please Try Again Later'})
    }

}
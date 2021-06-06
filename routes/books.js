const router = require('express').Router()
const middleware = require('../middleware/authenticate')
const booksController = require('../controllers/books')

router.get('/', booksController.getHome)
router.get('/about', booksController.getAbout)
router.get('/search', booksController.getSearchResults)
router.get('/listing/:bookid', booksController.getBookListing)
router.get('/listing/:bookid/review', middleware.isLoggedIn, booksController.getReviewPage)
router.post('/review', middleware.isLoggedIn, booksController.postReview)
router.get('/upload', middleware.isLoggedIn, booksController.getBookUpload)
router.post('/upload', middleware.isLoggedIn, booksController.uploadBook)

module.exports = router
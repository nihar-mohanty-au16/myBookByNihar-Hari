const router = require('express').Router()
const middleware = require('../middleware/authenticate')
const cartController = require('../controllers/cart')

router.get('/', middleware.isLoggedIn, cartController.getCart)
router.get('/clear', middleware.isLoggedIn, cartController.clearCart)
router.post('/', middleware.isLoggedIn, cartController.addToCart)
router.post('/add', middleware.isLoggedIn, cartController.addItemCounter)
router.post('/remove', middleware.isLoggedIn, cartController.reduceItemCount)

module.exports = router
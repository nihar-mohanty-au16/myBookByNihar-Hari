const router = require('express').Router()
const middleware = require('../middleware/authenticate')
const userController = require('../controllers/user')

router.get('/signin', userController.getSignIn)
router.post('/signin', userController.userSignIn)
router.post('/signup', userController.userSignUp)
router.get('/logout', userController.userLogout)
router.get('/profile', middleware.isLoggedIn, userController.getOwnProfile)
router.get('/user/:userid', userController.getOtherUser)
router.get('/editprofile', middleware.isLoggedIn, userController.getEditUserDetails)
router.post('/updateprofile', middleware.isLoggedIn, userController.updateUserDetails)
  
module.exports = router
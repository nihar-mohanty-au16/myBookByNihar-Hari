const bcrypt = require('bcrypt')
const cloudinary = require('cloudinary').v2
const {Base64} = require('js-base64')

const UserModel = require('../models/User')

const {API_SECRET} = process.env  
cloudinary.config({ 
    cloud_name: 'ehvenga', 
    api_key: '294617545215198', 
    api_secret: API_SECRET 
})

exports.getSignIn = (req, res) => {
    res.render('signin')
}

exports.userSignUp = async (req, res) => {

    const {name, email, password} = req.body

    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        passcode = hashedPassword
    } catch (error) {
        console.log(error)
        return res.status(400).render('signin', {alert: 'Internal Error: User not created'})
    }

    userData = {
        name,
        email,
        passcode,
    }

    try {
        const newUserDoc = new UserModel(userData)
        const savedUserDoc = await newUserDoc.save()
        req.session.isLoggedIn = true
        req.session.userid = savedUserDoc._id
        req.session.name = savedUserDoc.name
        res.status(201).redirect('/profile')
    } catch (error) {
        const emailExists = await UserModel.findOne({ email: req.body.email })
        if (emailExists) {
            return res.status(400).render("signin", {alert: "Error: Email Already Exists"});
        }
        console.log(error)
        return res.status(400).render('signin', {alert: 'Internal Error: User not created'})
    }
} 

exports.userSignIn = async (req, res) => {
    
    const {email, password} = req.body

    try {
        const returnUser = await UserModel.findOne({'email':`${email}`})
        if (returnUser != null){
            const isMatching = await bcrypt.compare(password, returnUser.passcode)
            if (isMatching) {
                req.session.isLoggedIn = true
                req.session.userid = returnUser._id
                req.session.name = returnUser.name
                res.status(202).redirect('/profile')
            }
            else {
                console.log('Credentials Not Matching')
                return res.status(400).render('signin', {alert: 'Wrong Password'})
            }
        }
        else{
            console.log('Email Not Found')
            return res.status(400).render('signin', {alert: 'Email not an existing user'})
        }
    } catch (error) {
        console.log(error)
        return res.status(400).render('signin', {alert: 'Error: Please Try Again'})
    }
}

exports.userLogout = (req, res) => {
    res.clearCookie('connect.sid')
    res.status(202).redirect('/')
    console.log('Logout Success')
}

exports.getOwnProfile = async (req, res) => {
    try {
        const fetchUser = await UserModel.findById(req.session.userid)
        res.status(200).render('profile', {
            name: fetchUser.name,
            email: fetchUser.email,
            photo: fetchUser.photo,
            ownprofile: true
        })
    } catch (error) {
        console.log(error)
        return res.status(400).render('error', {alert: 'Internal Error: Please Try Again Later'}) 
    }
}

exports.getOtherUser = async (req, res) => {
    try {
        const fetchUser = await UserModel.findById(req.params.userid)
        if (req.session.userid == req.params.userid) {
            return res.status(200).redirect('/profile')
        }
        return res.render('profile', fetchUser)
    } catch (error) {
        console.log(error)
        return res.status(400).render('error', {alert: 'Internal Error: Please Try Again Later'}) 
    }
}

exports.getEditUserDetails = async (req, res) => {
    try {
        const fetchUser = await UserModel.findById(req.session.userid).lean()
        return res.status(200).render('editprofile', fetchUser)
    } catch (error) {
        console.log(error)
        return res.render('profile', {alert: 'Error: Please try again later'})
    }
    
}

exports.updateUserDetails = async (req, res) => {
    const {name,email,contact,address,pincode} = req.body
    
    try {
        const base64String = Base64.encode(req.files.photo.data)
        const uploadResult = await cloudinary.uploader.upload(`data:${req.files.photo.mimetype};base64,${base64String}`,{
            folder: "mybooks/"
        })
        await UserModel.updateOne({_id: req.session.userid},
            {   
                photo: uploadResult.url,
                name: name,
                email: email,
                contact: contact,
                address: address,
                pincode: pincode
            })
        return res.status(202).redirect('/profile')

    } catch (error) {
        console.log(error)
        return res.status(400).render('signin', {alert: 'Internal Error: User not created'})
    }
}
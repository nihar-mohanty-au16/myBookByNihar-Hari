const UserModel = require('../models/User')
const BookModel = require('../models/Book')

exports.checkoutFromCart = async (req, res) => {
    try {
        const fetchUser = await UserModel.findById(req.session.userid)
        let data = {
            name: fetchUser.name, 
            email: fetchUser.email,
            amount: req.body.amount,
            contact: fetchUser.contact
    }
    return res.status(200).render('checkout', data)
    } catch (error) {
        console.log(error)
        return res.status(400).render('error', {alert: 'Internal Error: Please Try Again Later'})
    }
}

exports.checkoutFromBuyNow = async (req, res) => {
    try {
        const fetchBook = await BookModel.findById(req.body.bookid)
        const fetchUser = await UserModel.findById(req.session.userid)
        let data = {
            name: fetchUser.name, 
            email: fetchUser.email,
            amount: fetchBook.price,
            contact: fetchUser.contact
    }
    return res.status(200).render('checkout', data)
    } catch (error) {
        console.log(error)
        return res.status(400).render('error', {alert: 'Internal Error: Please Try Again Later'})
    }
}

exports.payment = async (req, res) => {
    try {
        data = req.body
        await UserModel.updateOne(
            {_id: req.session.userid},
            {
                address: req.body.address,
                contact: req.body.contact,
                pincode: req.body.pincode
            }
        )
        return res.render('payment', data)
    } catch (error) {
        console.log(error)
        return res.status(400).render('error', {alert: 'Internal Error: Please Try Again Later'})
    }
}
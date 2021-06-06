const UserModel = require('../models/User')

exports.getCart = async (req, res) => {
    try {
        const fetchUser = await UserModel.findById(req.session.userid).populate('cart').lean()
        let data = {
            books: fetchUser.cart,
            items: 0,
            total: 0
        }
        let quantity= fetchUser.quantity

        if (data.books) {
            data.books = data.books.map((item, index) => {
                item.qty = quantity[index]
                return item
            })

            for (item in data.books) {
                data.items += data.books[item].qty
                data.total += data.books[item].qty * data.books[item].price
            }
        }
        return res.status(200).render('cart', {data})
    } catch (error) {
        console.log(error)
        return res.status(400).render('cart', {alert: 'Internal Error: Please Try Again Later'})
    }
}

exports.clearCart = async (req, res) => {
    try {
        await UserModel.updateOne({_id: req.session.userid},{$unset: {cart:1, quantity:1}},{multi:true})
        return res.status(202).redirect('/cart')
    } catch (error) {
        console.log(error)
        return res.status(400).render('cart', {alert: 'Internal Error: Please Try Again Later'})
    }
}

exports.addToCart = async (req, res) => {

    try {
        await UserModel.findByIdAndUpdate(
            req.session.userid,
            {
                $push: {
                    "cart": req.body.bookid,
                    "quantity": req.body.quantity
                }
            }
        )
    } catch (error) {
        console.log(error)
        return res.status(400).render('cart', {alert: 'Internal Error: Please Try Again Later'})
    }
    return res.status(202).redirect('/cart')
}

exports.addItemCounter = async (req, res) => {
    let removeBookId = req.body.bookid
    try {
        const fetchUser = await UserModel.findById(req.session.userid).lean()
        await UserModel.updateOne({_id: req.session.userid},{$unset: {cart:1, quantity:1}},{multi:true})

        let cart = fetchUser.cart
        let quantity = fetchUser.quantity
        let newCart = []
        let newQuantity = []

        for (index in cart) {
            if (removeBookId == cart[index]) {
                quantity[index] += 1
            }
            newCart.push(cart[index])
            newQuantity.push(quantity[index])

            try {
                await UserModel.findByIdAndUpdate(
                    req.session.userid,
                    {
                        $push: {
                            "cart": newCart[index],
                            "quantity": newQuantity[index]
                        }
                    }
                )
            } catch (error) {
                console.log(error)
                return res.status(400).render('cart', {alert: 'Internal Error: Please Try Again Later'})
            }

        }
        return res.status(201).redirect('/cart')

    } catch (error) {
        console.log(error)
        return res.status(400).render('cart', {alert: 'Internal Error: Please Try Again Later'})
    }
}

exports.reduceItemCount = async (req, res) => {
    let removeBookId = req.body.bookid
    try {
        const fetchUser = await UserModel.findById(req.session.userid).lean()
        await UserModel.updateOne({_id: req.session.userid},{$unset: {cart:1, quantity:1}},{multi:true})

        let cart = fetchUser.cart
        let quantity = fetchUser.quantity
        let newCart = []
        let newQuantity = []

        for (index in cart) {
            if (removeBookId == cart[index]) {
                quantity[index] -= 1
            }

            if (quantity[index] > 0) {
                newCart.push(cart[index])
                newQuantity.push(quantity[index])
            }
        }

        for (index in newCart) {
            try {
                await UserModel.findByIdAndUpdate(
                    req.session.userid,
                    {
                        $push: {
                            "cart": newCart[index],
                            "quantity": newQuantity[index]
                        }
                    }
                )
            } catch (error) {
                console.log(error)
                return res.status(400).render('cart', {alert: 'Internal Error: Please Try Again Later'})
            }
        }
        return res.status(201).redirect('/cart')

    } catch (error) {
        console.log(error)
        return res.status(400).render('cart', {alert: 'Internal Error: Please Try Again Later'})
    }
}
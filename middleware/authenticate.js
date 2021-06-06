middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.session.isLoggedIn == true) {
        next()
    }
    else
    res.status(401).render('signin', {alert: 'You must be logged in to do that'})
}

module.exports = middlewareObj;
const protect = (req, res, next) => {

    if (!req.session.user) {
        return res.status(401).json({
            status: 'fail',
            message: 'You are not logged in. Please log in to access this resource.'
        });
    }

    req.user = req.session.user; 
    next();
}

module.exports = protect;
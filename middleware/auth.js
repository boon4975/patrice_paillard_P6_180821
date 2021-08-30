const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'Tk7HnepakfcFNDn');
        const userId = decodedToken.userId;
        if (req.body.useriD && req.body.userId !== userId) {
            throw 'User ID incorrect'
        }else{
            next();
        }
    } catch ( error) {
        res.status(401).json({ error: error | 'Requête non authentifiée' })
    }
};
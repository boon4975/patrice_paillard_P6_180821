const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const db =
  {
    "token": process.env.TOKEN_AUTH
  };

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, `${db.token}`);
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
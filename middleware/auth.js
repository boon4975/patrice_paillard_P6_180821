const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const db =
  {
    "token": process.env.TOKEN_AUTH
  };

  /**
   * Authentification du TOKEN dans l'entête des requêtes:
   * const token récupère le token dans le headers.authorization (format: BEARER token)
   * decodage du TOKEN
   * on extrait le userId du token décodé
   * on compare ce userId avec celui dans la requête
   * on valide si tout est ok
   */
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, `${db.token}`);
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID incorrect'
        }else{
            next();
        }
    } catch ( error) {
        res.status(401).json({ error: error | 'Requête non authentifiée' })
    }
};
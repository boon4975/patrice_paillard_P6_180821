const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');
dotenv.config();
const db =
  {
    "token": process.env.TOKEN_AUTH
  };

  /**
   * Création de compte utilisateur:
   * vérifie si l'adresse saisie existe => retourne un message 'adresse déjà utilisé'
   * sinon HASH + SALT mot de passe
   * sauvegarde dans la BDD
   */
exports.signup = ((req, res, next) => {
    User.findOne({ email: req.body.email})
        .then( user => {
            if(user) {
                return res.status(401).json({ message: 'Adresse email déjà utilisé' });
            }
            let regex = /((?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[.:'!@#$%&*_+=|(){}[?\-\]\/\\])(?!.*[<>`])).{8,}/
            if(req.body.password.match(regex)){
                bcrypt.hash(req.body.password, 10)
                    .then(hash => {
                        const user = new User({
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                        .then( () => res.status(201).json({ message: 'Utilisateur créé' }))
                        .catch(error => res.status(400).json({ error }))
                    })
                    .catch(error => res.status(500).json({ error }));
            }else{
                return res.status(401).json({ message: 'Le mot de passe doit comporter au moins 8 caractères dont 1 chiffre, 1 minuscule, 1 majuscule, 1 caractère spéciale '})
            }
            })
        
        .catch((error => res.status(500).json({ error })));
});

/**
 * Connexion utilisateur:
 * vérifie si l'email saisi existe => si non : retourne erreur de connexion
 * si oui compare le HASH saisis au HASH enregistre dans la BDD
 * retourne le userId et un Token d'authentification valable 24h
 */
exports.login = ((req, res, next) => {
    User.findOne({ email: req.body.email})
        .then( user => {
            if(!user) {
                return res.status(401).json({ message: 'Utilisateur non trouvé' });
            }
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if(!valid) {
                    return res.status(401).json({ message: 'Mot de passe incorrect' });
                }
                res.status(200).json({
                    userId: user._id,
                    token: jwt.sign(
                        { userId: user._id},
                        `${db.token}`,
                        {expiresIn: '24h'}
                    )
                });
            })
            .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
});
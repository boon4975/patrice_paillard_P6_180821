const User = require('../models/User');

exports.signup = ((req, res, next) => {
    const user = new User({
        email: req.body.email,
        password: req.body.password
    });
    user.save()
        .then( () => res.status(201).json({ message: 'Utilisateur créé'}))
        .catch(error => res.status(400).json({ error }))
});

exports.login = ((req, res, next) => {
    User.findOne({ email: req.body.email})
        .then( user => {
            if(!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé'});
            }
            res.status(200).json({ user });
        })
        .catch(error => res.status(500).json({ error }));
});
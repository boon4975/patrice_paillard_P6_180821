const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = ((req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
        .then( () => res.status(201).json({ message: 'sauce créée'}))
        .catch(error => res.status(400).json({ error }))
});

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    if (!req.file) {
        const sauceObject = { ...req.body};
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'sauce modifiée' }))
        .catch(error => res.status(404).json( { error }));
    }else{
        Sauce.findOne({_id: req.params.id})
            .then(sauce => {
                const filename = sauce.imageUrl.split('/images/')[1];
                const sauceObject = {
                    ...JSON.parse(req.body.sauce),
                    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                    };
                fs.unlink(`images/${filename}`, () => {
                    
                    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'sauce modifiée' }))
                        .catch(error => res.status(404).json( { error }));
                });
            })
            .catch( error => res.status(500).json({ error }));
    }
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.userLike = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            userLike = req.body.userId;
            actionLike = req.body.like;
            listUserLike = sauce.usersLiked;
            listUserDislike = sauce.usersDisliked;

            if(actionLike == 1 && !listUserLike.includes(userLike)){ // User like la sauce
                sauce.likes += 1;
                sauce.usersLiked.push(req.body.userId);
                sauce.save();
                res.status(200).json({ message: 'like sauce'});
            }else if(actionLike == -1 && !listUserDislike.includes(userLike)){ // User Dislike la sauce
                sauce.dislikes += 1;
                sauce.usersDisliked.push(req.body.userId);
                sauce.save();
                res.status(200).json({ message: 'dislike ok'});
            }else if(actionLike == 0 && listUserLike.includes(userLike)){ // User annule son like
                sauce.likes -= 1;
                let delpos = listUserLike.indexOf(userLike);
                listUserLike.splice(delpos,1);
                sauce.save();
                res.status(200).json({ message: 'User annule son like'});
            }else if(actionLike == 0 && listUserDislike.includes(userLike)){ //User annule son Dislike
                sauce.dislikes -= 1;
                let delpos = listUserDislike.indexOf(userLike);
                listUserDislike.splice(delpos,1);
                sauce.save();
                res.status(200).json({ message: 'User annule son Dislike'});
            }
        })
        .catch((error) => res.status(500).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'sauce supprimée'}))
                    .catch((error) => res.status(404).json({ error }));
            });
        })
        .catch((error) => res.status(500).json({ error }));
};

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

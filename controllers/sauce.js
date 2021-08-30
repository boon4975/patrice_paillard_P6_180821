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
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'sauce modifiée' }))
        .catch(error => res.status(404).json( { error }));
};

exports.usersLiked = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            userLike = req.body.userId;
            listUser = sauce.usersLiked;
            if(!listUser.includes(userLike)){
                sauce.likes += 1;
                sauce.usersLiked.push(req.body.userId)
                sauce.save();
                res.status(200).json({ message: 'like ok'});
            }else{
                sauce.likes -= 1;
                let delpos = listUser.indexOf(userLike);
                listUser.splice(delpos,1);
                sauce.save();
                res.status(200).json({ message: 'like déjà fait'});
            };
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

/*
exports.modifySauce = (req, res, next) => {
    if (!req.file) {
        const sauceObject = { ...req.body};
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'sauce modifiée' }))
        .catch(error => res.status(404).json( { error }));
    }else{
        sauceDelImg(req.body)
            .then
};

function sauceDelImg(id){
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`);
            alert('old img supp');
            res.status(204).json({ message: 'ancienne image supprimée'})
        })
        .catch(error => res.status(400).json({ error }));
}*/
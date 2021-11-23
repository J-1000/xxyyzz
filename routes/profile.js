const router = require('express').Router();
const Editor = require('../models/Editor')
const bcrypt = require('bcrypt')

const isLoggedOut = require('../middleware/isLoggedOut')
const isLoggedIn = require('../middleware/isLoggedIn')
const {fileUploader, cloudinary} = require('../config/cloudinary');


router.get('/profile', isLoggedIn,(req,res,next) => {


    const id = req.session.user._id;
    
    Editor.findById(id)
        .then(foundUser => {
            res.render('editor/profile', foundUser)
        })
})

router.get('/logout', isLoggedIn, (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            next(err)
        } else {
            res.redirect('/')
        }
    })
})

router.get('/profile/edit',isLoggedIn,(req, res, next) => {
    const id = req.session.user._id;

    Editor.findById(id)
        .then(foundEditor => {
            res.render('editor/edit-profile', foundEditor)
        })

});

router.post('/profile/edit', fileUploader.single('profile-image'),(req, res, next) => {
    const id = req.session.user._id;
    const {bio, email, password} = req.body;

    const imageUrl = req.session.user.imageUrl;
    const imgName = req.session.user.imgName;
    const publicId = req.session.user.publicId;

    const salt = bcrypt.genSaltSync()
    const hash = bcrypt.hashSync(password, salt)

    if (password.length < 8 || password.length === 0) {
        res.render('editor/edit-profile', {...req.session.user,errorMessage: 'Password must have at least 8 characters'});
        return
    }

    if (email.length === 0 || bio.length === 0) { 
        res.render('editor/edit-profile', {...req.session.user,errorMessage: 'Bio and Email cannot be empty'});
        return
    }
    
    if (req.file){
        imageUrl = req.file.path;
        imgName = req.file.originalname;
        publicId = req.file.filename;
    }
    console.log(req.file)
    console.log(imageUrl, imgName, publicId)

    // Editor.findByIdAndUpdate(id, {
    //     bio: bio,
    //     email: email,
    //     password: hash,
    //     imageUrl: imageUrl,
    //     imgName: imgName,
    //     publicId: publicId
    // },{
    //     new:true
    // })
    //     .then(updatedEditor => {
    //         res.redirect('/profile')
    //     })
});



module.exports = router;
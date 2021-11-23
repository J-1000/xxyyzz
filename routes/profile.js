const router = require('express').Router();
const Editor = require('../models/Editor')
const isLoggedIn = require('../middleware/isLoggedIn');
const bcrypt = require('bcrypt')


router.get('/profile', isLoggedIn,(req,res,next) => {
    const id = req.session.user._id;
    
    Editor.findById(id)
        .then(foundUser => {
            res.render('editor/profile', foundUser)
        })
})

router.get('/logout', (req, res, next) => {
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

router.post('/profile/edit',(req, res, next) => {
    const id = req.session.user._id;
    const {bio, email, password} = req.body;

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
    
    Editor.findByIdAndUpdate(id, {
        bio: bio,
        email: email,
        password: hash
    },{
        new:true
    })
        .then(updatedEditor => {
            res.redirect('/profile')
        })
});



module.exports = router;
const router = require('express').Router()

// ℹ️ Handles password encryption
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10

// Require the User model in order to interact with the database
const User = require('../models/User.model')

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require('../middleware/isLoggedOut')
const isLoggedIn = require('../middleware/isLoggedIn')
const Editor = require('../models/Editor')


router.get("/signup", (req, res, next) => {
  res.render('signUp');
});

router.post('/signup', (req, res, next) => {
  const { username, password, bio, email } = req.body
  if (password.length < 8) {
    res.render('signUp', { errorMessage: 'Your password needs to be at least 8 characters long.' })
    return
  }
  if (username.length === 0) {
    res.render('signUp', { errorMessage: 'Your username cannot be empty.' })
    return
  }
  Editor.findOne({ username: username })
    .then(editorFromDB => {
      if (editorFromDB !== null) {
        res.render('signUp', ({ errorMessage: 'Your username is already taken' }))
      } else {
        const salt = bcrypt.genSaltSync()
        const hash = bcrypt.hashSync(password, salt)
        Editor.create({ username:username, password:hash, bio:bio, email:email })
          .then(editorFromDB => {
          req.session.user = editorFromDB;
          res.redirect('/profile')
          })
          .catch(err => next(err))
      }
    })
})



// router.post('/signup', (req, res, next) => {
// 	const { username, password } = req.body
// 	if (password.length < 8) {
// 		res.render('signup', { errorMessage: 'Your password needs to be 8 chars min' })
// 		return
// 	}

// 	if (username.length === 0) {
// 		res.render('signup', { errorMessage: 'Your username cannot be empty' })
// 		return
// 	}

// 	Editor.findOne({ username: username })
// 		.then(editorFromDB => {
// 			if (editorFromDB !== null) {
// 				res.render('signup', { errorMessage: 'Your username is already taken' })
// 			} else {

// 				const salt = bcrypt.genSaltSync();
// 				const hash = bcrypt.hashSync(password, salt)

// 				Editor.create({ username: username, password: hash })
// 					.then(createdEditor => {
// 						res.redirect('/profile')
// 					})
// 					.catch(err => next(err))
// 			}
// 		})
// });






router.get('/login', (req, res, next) => {
  res.render('logIn')
})

router.post('/login', isLoggedOut, (req, res, next) => {
  const { username, password } = req.body

  if (!username) {
    return res
      .status(400)
      .render('logIn', { errorMessage: 'Please provide your username.' })
  }

  // - either length based parameters or we check the strength of a password
  if (password.length < 8) {
    return res.status(400).render('logIn', {
      errorMessage: 'Your password needs to be at least 8 characters long.',
    })
  }

  // Search the database for a user with the username submitted in the form
  User.findOne({ username })
    .then((user) => {
      // If the user isn't found, send the message that user provided wrong credentials
      if (!user) {
        return res
          .status(400)
          .render('logIn', { errorMessage: 'Wrong credentials.' })
      }

      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcrypt.compare(password, user.password).then((isSamePassword) => {
        if (!isSamePassword) {
          return res
            .status(400)
            .render('logIn', { errorMessage: 'Wrong credentials.' })
        }
        req.session.user = user
        // req.session.user = user._id; // ! better and safer but in this case we saving the entire user object
        return res.redirect('/profile')
      })
    })

    .catch((err) => {
      next(err)
    })
})

module.exports = router

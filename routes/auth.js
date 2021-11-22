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

router.get('/login', (req, res, next) => {
  res.render('logIn')
})

router.post('/login', isLoggedOut, (req, res, next) => {
  const { username, password } = req.body

  if (!username) {
    return res
      .status(400)
      .render('login', { errorMessage: 'Please provide your username.' })
  }

  // - either length based parameters or we check the strength of a password
  if (password.length < 8) {
    return res.status(400).render('login', {
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
          .render('login', { errorMessage: 'Wrong credentials.' })
      }

      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcrypt.compare(password, user.password).then((isSamePassword) => {
        if (!isSamePassword) {
          return res
            .status(400)
            .render('login', { errorMessage: 'Wrong credentials.' })
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

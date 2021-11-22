module.exports = (req, res, next) => {
  // if an already logged in user tries to access the login page it
  // redirects the user to the profile page
  if (req.session.user) {
    return res.redirect('/profile')
  }
  next()
}

const router = require("express").Router();
const isLoggedOut = require('../middleware/isLoggedOut')
const isLoggedIn = require('../middleware/isLoggedIn')

/* GET home page */
router.get("/", isLoggedOut, (req, res, next) => {
  res.render("index");
});

router.get('/create', isLoggedIn, (req, res, next) => {
  res.render('createBlogPost')
})

module.exports = router;

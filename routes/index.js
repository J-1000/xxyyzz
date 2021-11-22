const router = require('express').Router()

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index')
})

router.get('/create', (req, res, next) => {
  res.render('createBlogPost')
})

module.exports = router

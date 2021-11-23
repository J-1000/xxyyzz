const router = require('express').Router()
const isLoggedOut = require('../middleware/isLoggedOut')
const isLoggedIn = require('../middleware/isLoggedIn')
const Post = require('../models/Post')
const Editor = require('../models/Editor')

/* GET home page */
router.get('/', isLoggedOut, (req, res, next) => {
  res.render('index')
})

// View Blog Posts Route
router.get('/view', (req, res, next) => {
  Post.find()
    .populate('editorId')
    .then((postFromDB) => {
      res.render('viewBlogPosts', { post: postFromDB })
    })
})

// Create Edit Post Routes
router.get('/edit/:id', (req, res, next) => {
  const id = req.params.id

  Post.findById(id)
    .then((postFromDB) => {
      res.render('editBlogPost', { post: postFromDB })
    })
    .catch((err) => next(err))
})

router.post('/edit/:id', (req, res, next) => {
  const { title, content } = req.body
  // const editorId = req.session.user._id

  Post.findByIdAndUpdate(req.params.id, { title, content }, { new: true })
    .then((updatedPost) => {
      // console.log(updatedPost)
      res.redirect(`/details/${updatedPost._id}`)
    })
    .catch((err) => next(err))
})

router.get('/details/:id', isLoggedIn, (req, res, next) => {
  Post.findById(req.params.id)
    .populate('editorId')
    .then((postFromDb) => {
      // console.log(postFromDb)
      res.render('details', { post: postFromDb })
    })
    .catch((err) => next(err))
})

// Create Blog Post Route
router.get('/create', isLoggedIn, (req, res, next) => {
  console.log(req.session.user)
  res.render('createBlogPost')
})

router.post('/create', (req, res, next) => {
  const { title, content } = req.body
  const editorId = req.session.user._id
  // console.log(req.session.user)

  Post.create({ title, content, editorId })
    .then((createdPost) => {
      console.log(createdPost)
      res.redirect(`/details/${createdPost._id}`)
    })
    .catch((err) => next(err))
})

router.get('/details/:id', isLoggedIn, (req, res, next) => {
  Post.findById(req.params.id)
    .populate('editorId')
    .then((postFromDb) => {
      console.log(postFromDb)
      res.render('details', { post: postFromDb })
    })
    .catch((err) => next(err))
})

// Delete Post Route
router.get('/details/delete/:id', (req, res, next) => {
  const id = req.params.id
  Post.findByIdAndDelete(id)
    .then(() => {
      res.redirect('/profile')
    })
    .catch((err) => {
      next(err)
    })
})

module.exports = router

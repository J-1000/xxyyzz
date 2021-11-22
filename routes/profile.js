const router = require('express').Router();
const Editor = require('../models/Editor')

router.get('/profile',(req,res,next) => {
    
    res.send('editor/profile', )
})

module.exports = router;
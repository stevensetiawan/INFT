"use strict"
const router = require('express').Router()
const user = require('../controllers/user')
const passport = require('passport')
const { register, auth } = require('../middlewares/passport')

router.post('/signup', register)
router.post('/login', auth)

router.use(passport.authenticate('jwt', { session: true }))
router.get('/:id', user.getUserId)
router.get('/', user.getUsers)
router.put('/:id', user.updateUser)
router.delete('/:id', user.deleteUser)

module.exports = router
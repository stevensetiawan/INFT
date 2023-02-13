"use strict"
const router = require('express').Router()
const passport = require('passport')
const user = require('./user')
const referral_code = require('./referral_code')

router.use('/user', user)

router.use(passport.authenticate('jwt', { session: true }))
router.use('/referral-code', referral_code)


module.exports = router


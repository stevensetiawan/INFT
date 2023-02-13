"use strict"
const router = require('express').Router()
const referral_code = require('../controllers/referral_code')

router.get('/', referral_code.getReferralCodesAndFilter)
router.get('/:id', referral_code.getReferralCodeById)
router.post('/', referral_code.createReferralCode)
router.put('/:id', referral_code.updateReferralCode)
router.delete('/:id', referral_code.deleteReferralCode)

module.exports = router
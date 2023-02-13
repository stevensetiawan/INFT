"use strict"
const {
  ReferralCode
} = require('../models')

exports.createReferralCode = async (req, res) => {
  try {
    console.log("masuk ga?")
    const referral_code = new ReferralCode({
      referral_code: req.body.referral_code,
      description: req.body.description,
      type: req.body.type,
      added_by: req.user.id,
    })

    const result = await ReferralCode.create(referral_code)
    return res.status(201).send(result)
  } catch (err) {
    return res.status(409).send({
      message: err.message || "Error to create package"
    })
  }
}

exports.getReferralCodeById = async (req, res) => {
  try {
    const id = req.params.id
    const result = await ReferralCode.findById(id)
    if (!result) {
      return res.status(404).send({
        message: "Package is not found"
      })
    } else {
      return res.status(200).send(result)
    }
  } catch (err) {
    return res.status(500).send({
      message: err.message || "Error while retrieve data by id"
    })
  }
}

exports.getReferralCodesAndFilter = async (req, res) => {
  try {
    if(req.query.referral_code && req.query.referral_code.replace(/\s/g,'').length > 0){
    const result = await ReferralCode.find({referral_code: {$regex: new RegExp(`${req.query.referral_code.replace(/\s/g,'')}`, 'i')}}).populate(
      {
        path: 'added_by',
        select: 'name -_id'
      }
    ).sort({
      updatedAt: -1
    })
    return res.status(200).send(result)
  } else {
    const result = await ReferralCode.find().populate(
      {
        path: 'added_by',
        select: 'name -_id'
      }
    ).sort({
      updatedAt: -1
    })
    return res.status(200).send(result)
  }
  } catch (err) {
    return res.status(500).send({
      message: err.message || "Error while retrieve data"
    })
  }
}

exports.updateReferralCode = async (req, res) => {
  try {
    const id = req.params.id
    let referral_code  = {
      referral_code: req.body.referral_code,
      description: req.body.description,
      type: req.body.type,
      added_by: req.user.id,
    }
    
    const result = await ReferralCode.findByIdAndUpdate(
      id, referral_code, {
        returnOriginal: false
      }
    )
    if (!result) {
      return res.status(404).send({
        message: "Referral Code is not found"
      })
    } else {
      return res.status(200).send({
        message: "Referral Code is updated",
        data: result
      })
    }
  } catch (err) {
    return res.status(409).send({
      message: err.message || "Error while update referral code"
    })
  }
}

exports.deleteReferralCode = async (req, res) => {
  try {
    const id = req.params.id
    const result = await ReferralCode.findByIdAndRemove(id)

    if (!result) {
      return res.status(404).send({
        message: "Referral Code is not found"
      })
    } else {
      return res.status(200).send({
        message: "Referral Code is deleted"
      })
    }
  } catch (err) {
    return res.status(409).send({
      message: err.message || "Error to delete referral code"
    })
  }
}
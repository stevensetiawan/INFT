"use strict"
const { User } = require('../models')
const bcrypt = require("../helpers/bcrypt")

exports.getUserId = async (req, res) => {
  try {
    const id = req.params.id
    const result = await User.findById(id)
    if (!result) {
      return res.status(404).send({
        message: "User is not found"
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

exports.getUsers = async (req, res) => {
  try {
    const result = await User.find().sort({
      updatedAt: -1
    })
    return res.status(200).send(result)
  } catch (err) {
    return res.status(500).send({
      message: err.message || "Error while retrieve data"
    })
  }
}

exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id
    let hashed = ''
    if(req.body.password && req.body.password.trim().length > 0) {
      hashed = await bcrypt.hasher(req.body.password)
    }       
    const payload = {
      name: req.body.name,
      password: hashed,
      email: req.body.email,
    }
    const result = await User.findByIdAndUpdate(
      id, payload, {
        returnOriginal: false
      }
    )
    if (!result) {
      return res.status(404).send({
        message: "User is not found"
      })
    } else {
      return res.status(200).send({
        message: "User is updated",
        data: result
      })
    }
  } catch (err) {
    return res.status(409).send({
      message: err.message || "Error to update User"
    })
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id
    const result = await User.findByIdAndRemove(id)

    if (!result) {
      return res.status(404).send({
        message: "User is not found"
      })
    } else {
      return res.status(200).send({
        message: "User is deleted"
      })
    }
  } catch (err) {
    return res.status(409).send({
      message: err.message || "Error to delete User"
    })
  }
}
"use strict"
const mongoose = require('mongoose')
const { Schema } = mongoose
module.exports = (mongoose) => {
  const schema = Schema(
    {
      referral_code: {
        type: String,
        required: true,
        index: {
          unique: true,
          sparse: true
        }
      },
      description: {
        type: String,
        required: true
      },
      type: {
        type: String,
        required: true
      },
      added_by: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users'
      }
    },
    {timestamps: true}
  )

  schema.method("toJSON", function(){
    const{__v, _id, ...object} = this.toObject()
    object.id = _id
    return object
  })

  const RefferalCode = mongoose.model("refferal_codes", schema)
  return RefferalCode
}
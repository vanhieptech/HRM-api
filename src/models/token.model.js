var mongoose = require("mongoose");

var tokenSchema = new mongoose.Schema(
  {
    user_id: String,
    token: String,
    expires_in: Number,
    create_at: Date,
    updated_at: Date,
    is_deleted: Boolean,
  },
  { versionKey: false }
);

var Tokens = mongoose.model("Tokens", tokenSchema, "tokens");

module.exports = {
  findByLambda: async function (lambda) {
    return await Tokens.find(lambda);
  },
  createByLambda: async function (lambda) {
    return await Tokens.insertMany(lambda);
  },
  updateByLambda: async function (id, lambda) {
    return await Tokens.updateOne(id, lambda);
  },
  deleteByLambda: async function (lambda) {
    return await Tokens.deleteOne(lambda);
  },
};

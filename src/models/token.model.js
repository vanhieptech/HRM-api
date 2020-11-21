var mongoose = require("mongoose");

var tokenSchema = new mongoose.Schema(
  {
    user_id: String,
    token: String,
    expires_in: Number,
    updated_at: Date,
    is_deleted: Boolean,
  },
  { versionKey: false }
);

var Tokens = mongoose.model("Tokens", tokenSchema, "tokens");

module.exports = {
  findByLamda: async function (lamda) {
    return await Tokens.find(lamda);
  },
  createByLamda: async function (lamda) {
    return await Tokens.insertMany(lamda);
  },
  updateByLamda: async function (id, lamda) {
    return await Tokens.updateOne(id, lamda);
  },
  deleteByLamda: async function (lamda) {
    return await Tokens.deleteOne(lamda);
  },
};

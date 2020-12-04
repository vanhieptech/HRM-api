var mongoose = require("mongoose");

var tokenSchema = new mongoose.Schema(
  {
    user_id: String,
    result: String,
    create_at: Date,
    is_deleted: Boolean,
  },
  { versionKey: false }
);

var Histories = mongoose.model("Histories", tokenSchema, "histories");

module.exports = {
  findByLamda: async function (lambda) {
    lambda = {
      ...lambda,
      is_deleted: false,
    };
    return await Histories.find(lambda);
  },
  createByLamda: async function (lambda) {
    return await Histories.insertMany(lambda);
  },
  updateByLamda: async function (id, lambda) {
    return await Histories.updateOne(id, lambda);
  },
  deleteByLamda: async function (lambda) {
    return await Histories.deleteOne(lambda);
  },
};

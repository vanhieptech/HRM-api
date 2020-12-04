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
  findByLambda: async function (lambda) {
    lambda = {
      ...lambda,
      is_deleted: false,
    };
    return await Histories.find(lambda);
  },
  createByLambda: async function (lambda) {
    return await Histories.insertMany(lambda);
  },
  updateByLambda: async function (id, lambda) {
    return await Histories.updateOne(id, lambda);
  },
  deleteByLambda: async function (lambda) {
    return await Histories.deleteOne(lambda);
  },
};

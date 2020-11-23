const mongoose = require("mongoose");

let userSchema = new mongoose.Schema(
  {
    phone: String,
    name: String,
    email: String,
    password: String,
    avatar: String,
    is_deleted: Boolean,
    updated_at: Date,
  },
  { versionKey: false }
);

let User = mongoose.model("User", userSchema, "users");

module.exports = {
  findByLambda: async function (lambda) {
    lambda = {
      ...lambda,
      is_deleted: false || undefined,
    };
    return await User.find(lambda);
  },
  findByEmailPassword: async function (lambda) {
    lambda = {
      ...lambda,
      is_deleted: false,
    };
    return await User.aggregate([
      {
        $match: lambda,
      },
      // {
      //   $lookup: {
      //     from: 'permissions',
      //     localField: 'permissions_id',
      //     foreignField: '_id',
      //     as: 'permissions'
      //   }
      // }
    ]);
  },
  createByLambda: async function (lambda) {
    return await User.insertMany(lambda);
  },
  updateByLambda: async function (id, lambda) {
    return await User.updateOne(id, lambda);
  },
};

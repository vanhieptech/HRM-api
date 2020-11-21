const User = require("../models/user.model");
const Token = require("../models/token.model");
const resSuccess = require("../response/res-success");
const resFail = require("../response/res-fail");

const sha256 = require("crypto-js/sha256");

module.exports = {
  postLogin: async function (req, res) {
    console.log("chay cai nay");
    try {
      console.log("body:" + req.body);
      let email = req.body.email;
      console.log("email: " + email);
      let password = sha256(req.body.password).toString();
      console.log("password: " + password);
      let user = await User.findByEmailPassword({
        email: email,
        password: password,
      });
      console.log("user: " + JSON.stringify(user));
      if (user.length === 0 || user[0].is_deleted === true) {
        throw {
          detail: "Invalid login",
        };
      }
      let token = await Token.findByLamda({ user_id: user[0]._id });
      console.log("token:" + JSON.stringify(token));
      delete user[0]["password"];
      res.json(
        resSuccess({
          user: user[0],
          token: token[0].token,
        })
      );
    } catch (error) {
      data = {
        ...error,
        message: error.message,
        detail: error.detail,
      };
      res.json(resFail({ data: data }));
    }
  },
  postRegister: async function (req, res, next) {
    try {
      let password = sha256(req.body.password).toString();
      let entity = {
        phone: req.body.phone || undefined,
        name: req.body.name || undefined,
        email: req.body.email || undefined,
        password: password || undefined,
        avatar: req.body.avatar || undefined,
        updated_at: moment().now,
        is_deleted: false,
      };
      let users = await User.createByLambda(entity);
      // create token return token and expires_in
      let valueToken = await createToken(users[0]);
      let token_schema = {
        user_id: users[0]._id,
        token: valueToken.token,
        expires_in: +valueToken.expires_in,
        updated_at: moment.now(),
      };
      let tokens = await Token.createByLamda(token_schema);
      user[0]["password"] = "******";
      res.json(
        resSuccess({
          user: users[0],
          token: tokens[0].token,
        })
      );
    } catch (error) {
      next(error);
    }
  },
};

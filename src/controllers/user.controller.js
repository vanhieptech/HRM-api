let user = require("../models/user.model");
const Token = require("../models/token.model");
const resSuccess = require("../response/res-success");
const resFail = require("../response/res-fail");
const { createToken, intDate } = require("../util");

const { omitBy, isNil } = require("lodash");
const moment = require("moment");
const sha256 = require("crypto-js/sha256");

module.exports = {
  listUser: async function (req, res, next) {
    let data = await user.findByLambda();
    res.json(resSuccess({ data: data }));
  },

  findById: async function (req, res) {
    let id = req.params.id;
    let data = await user.findByLambda({ _id: id });
    res.json(resSuccess({ data: data[0] }));
  },

  postCreate: async function (req, res, next) {
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

  patchUpdate: async function (req, res, next) {
    try {
      let id = req.params.id;
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

      let entityLast = omitBy(entity, isNil);

      let result = await user.updateByLambda({ _id: id }, entityLast);
      res.json(resSuccess({ data: result }));
    } catch (error) {
      data = {
        ...error,
        message: error.message,
        detail: error.detail,
      };
      res.json(resFail({ data: data }));
    }
  },

  delete: async function (req, res) {
    try {
      let id = req.params.id;
      let entity = {
        is_deleted: true,
      };
      let result = await user.updateByLambda({ _id: id }, entity);
      res.json(resSuccess({ data: result }));
    } catch (error) {
      data = {
        ...error,
        message: error.message,
        detail: error.detail,
      };
      res.json(resFail({ data: data }));
    }
  },
};

let User = require("../models/user.model");
const Token = require("../models/token.model");
const resSuccess = require("../response/res-success");
const resFail = require("../response/res-fail");
const { createToken, intDate } = require("../util");
const { omitBy, isNil } = require("lodash");
const moment = require("moment");
const sha256 = require("crypto-js/sha256");

module.exports = {
  listUser: async function (req, res, next) {
    let data = await User.findByLambda();
    console.log(JSON.stringify(data));
    for (let item of data) {
      item.password = "******";
      console.log("item: ", JSON.stringify(item));
    }
    res.json(resSuccess({ data: data }));
  },

  findById: async function (req, res) {
    let id = req.params.id;
    let data = await User.findByLambda({ _id: id });
    let us = data[0];
    data[0].password = "******";
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
        create_at: moment.now(),
        updated_at: moment().now,
        is_deleted: false,
      };
      let user = await User.createByLambda(entity);
      console.log("password: ", password);

      // create token return token and expires_in
      let valueToken = await createToken(user[0]);
      let token_schema = {
        user_id: user[0]._id,
        token: valueToken.token,
        expires_in: +valueToken.expires_in,
        updated_at: moment.now(),
      };
      let tokens = await Token.createByLamda(token_schema);
      let us = user[0];
      us.password = "******";
      delete us.password;
      res.json(
        resSuccess({
          user: us,
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
      };

      let entityLast = omitBy(entity, isNil);

      let result = await User.updateByLambda({ _id: id }, entityLast);
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
      let result = await User.updateByLambda({ _id: id }, entity);
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

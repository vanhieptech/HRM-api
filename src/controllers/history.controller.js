let History = require("../models/history.model");
const resSuccess = require("../response/res-success");
const resFail = require("../response/res-fail");
const moment = require("moment");

module.exports = {
  listHistory: async function (req, res, next) {
    let data = await History.findByLambda();
    res.json(resSuccess({ data: data }));
  },

  findById: async function (req, res) {
    let id = req.params.id;
    let data = await History.findByLambda({ _id: id });
    res.json(resSuccess({ data: data[0] }));
  },

  postCreate: async function (req, res, next) {
    try {
      let entity = {
        user_id: req.body.user_id,
        result: req.body.result,
        create_at: moment().now,
        is_deleted: false,
      };
      let history = await History.createByLambda(entity);

      res.json(
        resSuccess({
          data: history,
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

  delete: async function (req, res) {
    try {
      let id = req.params.id;
      let entity = {
        is_deleted: true,
      };
      let result = await History.updateByLambda({ _id: id }, entity);
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

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateOne = exports.getOne = void 0;

var _driver = require("./driver.model");

const getOne = (req, res) => {
  res.status(200).json({
    data: req.driver
  });
};

exports.getOne = getOne;

const updateOne = (req, res) => {};

exports.updateOne = updateOne;
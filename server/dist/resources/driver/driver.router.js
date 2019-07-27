"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _driver = require("./driver.controllers");

const router = (0, _express.Router)();
router.get('/', _driver.getOne);
router.put('/', _driver.updateOne);
var _default = router;
exports.default = _default;
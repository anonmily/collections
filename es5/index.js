'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _collections = require('./collections');

Object.keys(_collections).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _collections[key];
    }
  });
});
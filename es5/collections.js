"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Collection = undefined;

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _simplyIs = require("simply-is");

var _simplyIs2 = _interopRequireDefault(_simplyIs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Representation of an array of objects
// [ {}, {}, {}, ... ]
var Collection = exports.Collection = function Collection(arr) {
	var sort_settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	_classCallCheck(this, Collection);

	_initialiseProps.call(this);

	this._data = _lodash2.default.cloneDeep(arr);
	this.data = _lodash2.default.cloneDeep(arr);
	this.sort_settings = sort_settings;
	this.length = this.data.length;
	this.handlers = {
		"change": [],
		"sort": [],
		"filter": [],
		"map": [],
		"unique": [],
		"merge": [],
		"reset": []
	};
}

// returns an array of the data


// Expects object of key --> sort type mappings
// e.g. { "a" : "desc", "b": "asc" }


// Expects either:
//   (1) a function that returns true or false for each element (e.g. x => x.a > 2 )
//   (2) object of key --> value mappings (e.g. { "a": 1 })
// https://lodash.com/docs/4.16.4#filter


// Expects a lambda function to run for every element
// https://lodash.com/docs/4.16.4#map


// Removes duplicates from the collection


// Clones this current Collection


// Is there an element that matches?


// Resets the data of the collection to match the original


// Merges collection data with the provided array based on the values of an ID key/column (used to determine uniqueness of the value)


// Aggregates the counts for various values of a particular key. Read-only. Does not mutate the dataset.


// Adds event handlers


// Emit event
;

var _initialiseProps = function _initialiseProps() {
	var _this = this;

	this.get = function () {
		return _lodash2.default.cloneDeep(_this.data);
	};

	this.value = function () {
		return _this.get();
	};

	this.sort = function (sort_settings) {
		_this.sort_settings = _lodash2.default.assign({}, _this.sort_settings, sort_settings);
		var sort_columns = [],
		    sort_directions = [];
		_lodash2.default.forEach(Object.keys(_this.sort_settings), function (column) {
			sort_columns.push(column);
			sort_directions.push(_this.sort_settings[column]);
		});
		_this.data = _lodash2.default.orderBy(_this.data, sort_columns, sort_directions);
		return _this.emit("change").emit("sort");
	};

	this.filter = function (filters) {
		if (_simplyIs2.default.array(filters)) {
			filters.forEach(function (filter) {
				console.log('filtering', filter);
				_this.data = _lodash2.default.filter(_this.data, filter);
				console.log(_this.data);
			});
		} else {
			_this.data = _lodash2.default.filter(_this.data, filters);
		}
		return _this.emit("change").emit("filter");
	};

	this.map = function (lambda) {
		_this.data = _lodash2.default.map(_this.data, lambda);
		return _this.emit("change").emit("map");
	};

	this.unique = function () {
		if (_simplyIs2.default.object(_this.data[0])) {
			_this.data = _lodash2.default.uniqWith(_this.data, _lodash2.default.isEqual);
		} else {
			_this.data = _lodash2.default.uniq(_this.data);
		}
		return _this.emit("change").emit("unique");
	};

	this.clone = function () {
		return _lodash2.default.cloneDeep(_this);
	};

	this.has = function (filters) {
		return !!_lodash2.default.filter(_this.data, filters).length;
	};

	this.reset = function () {
		_this.data = _lodash2.default.cloneDeep(_this._data);
		return _this.emit("change").emit("reset");
	};

	this.merge = function (new_data, id_key) {
		var current_values = _this.data.map(function (x) {
			return x[id_key];
		}).sort();
		new_data.forEach(function (x) {
			var new_val = x[id_key],
			    exists = current_values.indexOf(new_val) > 0,
			    not_exists = !exists;
			if (not_exists) {
				_this.data.push(x);
			} else {
				_this.data[id_key] = _lodash2.default.assign({}, _this.data[id_key], x);
			}
		});
		var sortby = {};
		sortby[id_key] = "asc";
		_this.sort(sortby); // will already emit change and sort events
		return _this.emit("merge");
	};

	this.count = function (field) {
		var counter = {};
		_this.data.forEach(function (x) {
			var value = x[field];
			if (counter[value]) {
				counter[value]++;
			} else {
				counter[value] = 1;
			}
		});
		return counter;
	};

	this.on = function (event, handler) {
		if (!_this.handlers[event]) {
			_this.handlers[event] = [];
		}
		_this.handlers[event].push(handler);
	};

	this.emit = function (event) {
		if (_this.handlers[event]) {
			_this.handlers[event].forEach(function (handler) {
				handler(_this);
			});
		} else {
			console.error("No handlers for event=" + event + " found on collection.");
		}
		return _this;
	};
};

exports.default = Collection;
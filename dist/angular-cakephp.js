'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ActiveRecord = exports.BaseModel = exports.RestApi = undefined;

var _restApi = require('./rest-api/rest-api');

var _restApi2 = _interopRequireDefault(_restApi);

var _baseModel = require('./base-model/base-model');

var _baseModel2 = _interopRequireDefault(_baseModel);

var _activeRecord = require('./active-record/active-record');

var _activeRecord2 = _interopRequireDefault(_activeRecord);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// IE Hack
if (Function.prototype.name === undefined && Object.defineProperty !== undefined) {
    Object.defineProperty(Function.prototype, 'name', {
        get: function get() {
            var funcNameRegex = /function\s([^(]{1,})\(/;
            var results = funcNameRegex.exec(this.toString());
            return results && results.length > 1 ? results[1].trim() : "";
        },
        set: function set(value) {}
    });
}

exports.RestApi = _restApi2.default;
exports.BaseModel = _baseModel2.default;
exports.ActiveRecord = _activeRecord2.default;
import RestApi from './rest-api/rest-api';
import BaseModel from './base-model/base-model';
import ActiveRecord from './active-record/active-record';

// IE Hack
if (Function.prototype.name === undefined && Object.defineProperty !== undefined) {
    Object.defineProperty(Function.prototype, 'name', {
        get: function() {
            var funcNameRegex = /function\s([^(]{1,})\(/;
            var results = (funcNameRegex).exec((this).toString());
            return (results && results.length > 1) ? results[1].trim() : "";
        },
        set: function(value) {}
    });
}

export {
    RestApi as RestApi,
    BaseModel as BaseModel,
    ActiveRecord as ActiveRecord
};

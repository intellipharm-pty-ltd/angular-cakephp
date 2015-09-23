System.register(['./rest-api/rest-api', './base-model/base-model', './active-record/active-record'], function (_export) {
    'use strict';

    var RestApi, BaseModel, ActiveRecord;
    return {
        setters: [function (_restApiRestApi) {
            RestApi = _restApiRestApi['default'];
        }, function (_baseModelBaseModel) {
            BaseModel = _baseModelBaseModel['default'];
        }, function (_activeRecordActiveRecord) {
            ActiveRecord = _activeRecordActiveRecord['default'];
        }],
        execute: function () {
            _export('RestApi', RestApi);

            _export('BaseModel', BaseModel);

            _export('ActiveRecord', ActiveRecord);
        }
    };
});
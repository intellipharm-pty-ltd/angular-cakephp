import _ from "lodash";

export default class HttpParamSerializer {

    static sayHello() {
        return "hello";
    }

    /**
     * serialize
     *
     * @param params
     * @returns {Array}
     */
    static serialize(params) {

        var result = [];

        _.forEach(params, (item, key) => {

            if (key !== 'fields') {

                // TODO: fix HttpParamSerializer (it is currently splitting fields & doing something to contain)
                var key_str = !_.isUndefined(key) && !_.isNull(key) ? key : '';
                var param = HttpParamSerializer.transformUrlParam(item, key_str, '');

                result.push(param.substring(1, param.length));
            } else {
                result.push('fields=' + item);
            }
        });

        return result;
    }

    /**
     * HttpParamSerializer.transformUrlParam
     *
     * @param data
     * @param key_str
     * @param result
     * @param caseA
     * @returns {*}
     */
    static transformUrlParam(data, key_str, result, caseA) {
        if (_.isNull(data)) {
            return '';
        }

        if (_.isNumber(data) || _.isBoolean(data)) {
            data = data.toString();
        }

        var is_string = _.isString(data);

        caseA = _.isUndefined(caseA) ? false : caseA;

        if (is_string) {
            data = data.split(',');
        }

        for (var key in data) {
            if (_.isArray(data[key])) {
                result = HttpParamSerializer.transformArray(data, key, key_str, caseA, result);
            } else if (_.isArray(data) && _.isObject(data[key])) {
                result = HttpParamSerializer.transformUrlParam(data[key], key_str, result);
            } else if (_.isObject(data[key])) {
                result += '&' + key_str + '[' + key + ']';
                result = HttpParamSerializer.transformUrlParam(data[key], key_str, result, true);
            } else if (data.length > 1) {
                result = HttpParamSerializer.transformString(data, key, key_str, caseA, false, result);
            } else {
                result = HttpParamSerializer.transformString(data, key, key_str, caseA, is_string, result);
            }
        }

        return result;
    }

    static transformArray(data, key, key_str, caseA, result) {
        // TODO: make HttpParamSerializer part recursive
        for (var i = 0; i < data[key].length; i++) {

            if (_.isObject(data[key][i])) {
                result = HttpParamSerializer.transformArrayObject(data, key, key_str, i, result);
            } else {
                if (caseA) {
                    result += '[' + key + '][' + i + ']=' + data[key][i];
                } else {
                    result += '&' + key_str + '[' + key + '][' + i + ']=' + data[key][i];
                }
            }
        }

        return result;
    }

    static transformArrayObject(data, key, key_str, i, result) {
        for (var sub_key in data[key][i]) {
            if (_.isArray(data[key][i][sub_key]) || _.isObject()) {
                result = HttpParamSerializer.transformUrlParam(data[key][i][sub_key], key_str + '[' + key + ']' + '[' + sub_key + ']', result);
            } else {
                result += '&' + key_str + '[' + key + '][' + sub_key + '][' + i + ']=' + data[key][i][sub_key];
            }
        }

        return result;
    }

    static transformString(data, key, key_str, caseA, is_string, result) {
        if (caseA) {
            result += '[' + key + ']=' + data[key];
        } else {
            if (is_string) {
                result += '&' + key_str + '=' + data[key];
            } else {
                result += '&' + key_str + '[' + key + ']=' + data[key];
            }
        }

        return result;
    }
}

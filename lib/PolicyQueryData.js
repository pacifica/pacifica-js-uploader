var PolicyQueryData = function (js_obj) {
    'use strict';
    if (js_obj === undefined) {
        js_obj = '{}';
    }
    if (typeof js_obj === 'string') {
        js_obj = JSON.parse(js_obj);
    }
    [
        'user',
        'columns',
        'from',
        'where'
    ].forEach(function (attr_name) {
        if (!js_obj.hasOwnProperty(attr_name)) {
            js_obj[attr_name] = '';
        }
    });
    return js_obj;
};
module.exports = PolicyQueryData;

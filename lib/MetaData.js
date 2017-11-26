var MetaData = function (js_obj) {
    'use strict';
    if (js_obj === undefined) {
        js_obj = '[]';
    }
    if (typeof js_obj === 'string') {
        js_obj = JSON.parse(js_obj);
    }
    var ret_obj = [], MetaObj = require('./MetaObj');
    js_obj.forEach(function (meta_obj) {
        ret_obj.push(new MetaObj(meta_obj));
    });
    ret_obj.byMetaID = function (metaID) {
        var result = ret_obj.filter(function (obj) {
            return obj.metaID === metaID;
        });
        if (result.length) {
            return result[0];
        }
        return undefined;
    };
    ret_obj.isValid = function () {
        var result = ret_obj.filter(function (obj) {
            return obj.value === '';
        });
        return result.length === 0;
    };
    return ret_obj;
};
module.exports = MetaData;

var MetaData = function (jsonstr) {
    'use strict';
    if (jsonstr === undefined) {
        jsonstr = '[]';
    }
    var passed_objs = JSON.parse(jsonstr);
    var ret_obj = [];
    var MetaObj = require('./MetaObj');
    passed_objs.forEach(function (meta_obj) {
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

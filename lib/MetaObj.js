var MetaObj = function (jsonstr) {
    'use strict';
    if (jsonstr === undefined) {
        jsonstr = '{}';
    }
    var ret_obj = JSON.parse(jsonstr);
    [
        'sourceTable',
        'destinationTable',
        'metaID',
        'displayType',
        'displayTitle',
        'queryDependency',
        'valueField',
        'queryFields',
        'displayFormat',
        'key',
        'value',
        'directoryOrder',
        'query_results'
    ].forEach(function (attr_name) {
        if (!ret_obj.hasOwnProperty(attr_name)) {
            ret_obj[attr_name] = '';
        }
    });
    return ret_obj;
};
module.exports = MetaObj;

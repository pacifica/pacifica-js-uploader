var FileObj = function (jsonstr) {
    'use strict';
    if (jsonstr === undefined) {
        jsonstr = '{}';
    }
    var ret_obj = JSON.parse(jsonstr);
    [
        'destinationTable',
        'name',
        'subdir',
        'size',
        'hashtype',
        'hashsum',
        'mimetype',
        'ctime',
        'mtime'
    ].forEach(function (attr_name) {
        if (!ret_obj.hasOwnProperty(attr_name)) {
            ret_obj[attr_name] = '';
        }
    });
    return ret_obj;
};
module.exports = FileObj;

exports.testFileObj = function (test) {
    'use strict';
    var FileObj = require('../lib/FileObj');
    var test_obj = new FileObj();
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
        test.ok(test_obj.hasOwnProperty(attr_name), 'FileObj should have ' + attr_name + ' property.');
    });
    test_obj = new FileObj('{"name": "blarg"}');
    test.equal(test_obj.name, 'blarg', 'passing json to fileobj sets the properties.');
    var new_obj = {};
    new_obj['name'] = 'blarg';
    test_obj = new FileObj(new_obj);
    test.equal(test_obj.name, 'blarg', 'passing json to fileobj sets the properties.');
    test.done();
};


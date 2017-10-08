exports.testMetaObj = function (test) {
    'use strict';
    var MetaObj = require('../lib/MetaObj');
    var test_obj = new MetaObj();
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
        test.ok(test_obj.hasOwnProperty(attr_name), 'MetaObj should have ' + attr_name + ' property.');
    });
    test_obj = new MetaObj('{"metaID": "blarg"}');
    test.equal(test_obj.metaID, 'blarg', 'passing json to metaobj sets the properties.');
    test.done();
};


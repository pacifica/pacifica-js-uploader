exports.testMetaObj = function (test) {
    'use strict';
    var MetaObj = require('../lib/MetaObj'), test_obj = new MetaObj(), new_obj = {};
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
    new_obj.metaID = 'blarg';
    test_obj = new MetaObj(new_obj);
    test.equal(test_obj.metaID, 'blarg', 'passing json to metaobj sets the properties.');
    test.done();
};


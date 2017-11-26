exports.testMetaUpdate = function (test) {
    'use strict';
    var MetaUpdate = require('../lib/MetaUpdate'),
        test_obj = new MetaUpdate();
    test.ok(test_obj, 'MetaUpdate returned something.');
    test_obj = new MetaUpdate('username', '[]');
    test.ok(test_obj, 'MetaUpdate returned something.');
    test_obj = new MetaUpdate('username', []);
    test.ok(test_obj, 'MetaUpdate returned something.');
    test.done();
};
exports.testMetaUpdateAsync = function (test) {
    'use strict';
    test.expect(4);
    var MetaUpdate = require('../lib/MetaUpdate'),
        fs = require('fs');
    fs.readFile('./test_data/uploader.json', 'utf8', function (err, data) {
        if (err) throw err;
        var test_obj = new MetaUpdate('dmlb2001', data);
        test_obj.update_parents('instrument').then(function () {
            var meta_obj = test_obj.byMetaID('instrument');
            test.equal(meta_obj.query_results.length, 2, 'length of the result is 2.');
            test.equal(meta_obj.value, 54, 'id of the instrument we want is 54.');
            test.equal(meta_obj.query_results[0].name_short, 'Nittany Liquid Prob\u00e9s', 'name of the instrument is known.');
            test_obj.update_parents('proposal').then(function () {
                var meta_obj = test_obj.byMetaID('proposal');
                test.equal(meta_obj.value, '1234a', 'id of the proposal we want is 1234a.');
            });
        }, function (err) { throw err; });
    });
    setTimeout(function () {
        test.done();
    }, 3000);
};

exports.testMetaUpdateDirectory = function (test) {
    'use strict';
    var MetaUpdate = require('../lib/MetaUpdate'),
        MetaObj = require('../lib/MetaObj'),
        meta_obj = new MetaUpdate('dmlb2001');
    meta_obj.push(new MetaObj({
        'directoryOrder': 0,
        'displayFormat': 'Proposal ID <%= _id %>',
        'metaID': 'directory-proposal',
        'query_results': [{
            '_id': '1234a'
        }]
    }));
    meta_obj.push(new MetaObj({
        'directoryOrder': 1,
        'displayFormat': 'Instrument ID <%= _id %>',
        'metaID': 'directory-instrument',
        'query_results': [{
            '_id': '54'
        }]
    }));
    test.equal(meta_obj.directory_prefix(), 'Proposal ID 1234a/Instrument ID 54', 'directory prefix is rendered.');
    test.done();
};

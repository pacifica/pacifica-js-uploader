exports.testMetaData = function (test) {
    'use strict';
    var MetaData = require('../lib/MetaData');
    var test_obj = new MetaData();
    test.ok(test_obj.hasOwnProperty('byMetaID'), 'MetaObj should have indexMetaID property.');
    test_obj = new MetaData('[{"metaID": "blarg"}]');
    test.equal(test_obj[0].metaID, 'blarg', 'passing json to metaobj sets the properties.');
    test.done();
};

exports.testMetaDataID = function (test) {
    'use strict';
    var MetaData = require('../lib/MetaData');
    var test_obj = new MetaData('[{"metaID": "blarg"}]');
    test.equal(test_obj.byMetaID('blarg').metaID, 'blarg', 'finding metaobj by metaID works.');
    test.equal(test_obj.byMetaID('blah'), undefined, 'finding metaobj by unknown metaID works.');
    test.done();
};


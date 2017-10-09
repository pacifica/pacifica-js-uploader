exports.testPolicyQueryData = function (test) {
    'use strict';
    var PolicyQueryData = require('../lib/PolicyQueryData');
    var test_obj = new PolicyQueryData();
    [
        'user',
        'columns',
        'from',
        'where'
    ].forEach(function (attr_name) {
        test.ok(test_obj.hasOwnProperty(attr_name), 'PolicyQueryData should have ' + attr_name + ' property.');
    });
    test_obj = new PolicyQueryData('{"user": "blarg"}');
    test.equal(test_obj.user, 'blarg', 'passing json to PolicyQueryData sets the properties.');
    var new_obj = {};
    new_obj['user'] = 'blarg';
    test_obj = new PolicyQueryData(new_obj);
    test.equal(test_obj.user, 'blarg', 'passing json to PolicyQueryData sets the properties.');
    test.done();
};


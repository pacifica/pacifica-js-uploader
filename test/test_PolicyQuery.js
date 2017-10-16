exports.testPolicyQuery = function (test) {
    'use strict';
    test.expect(3);
    var PolicyQuery = require('../lib/PolicyQuery');
    var pq_data = {
        columns: ['_id'],
        from: 'instruments',
        where: { _id: 54 }
    };
    var test_obj = new PolicyQuery('dmlb2001', { pq_data: pq_data });
    test_obj.setUser(function() {
        test.equal(test_obj.pq_data.user, 10, 'Make sure user is now set to number not name.');
        test.equal(test_obj.pq_data.from, 'instruments', 'Make sure the original query was not changed.');
        test_obj.get_results(function(test_obj, results) {
            test.equal(results[0]['_id'], 54, 'instrument ID should be 54');
        });
    });
    setTimeout(function () {
        test.done();
    }, 2000);
};
exports.testPolicyQueryBad = function (test) {
    'use strict';
    test.expect(2);
    var PolicyQuery = require('../lib/PolicyQuery');
    var test_obj = PolicyQuery();
    test.equal(test_obj, undefined, 'This is an invalid object.');
    test_obj = PolicyQuery('dmlb2001', {});
    test.equal(test_obj, undefined, 'No policy query data can not query on nothing.');
    test.done();
};

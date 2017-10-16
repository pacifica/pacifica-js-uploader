exports.testUtilsServerURL = function (test) {
    'use strict';
    var Utils = require('../lib/Utils');
    var test_obj = {};
    test_obj.addr = '127.0.0.1';
    process.env['METADATA_PATH'] = '/md_path';
    Utils.ServerURL(
        test_obj,
        [
            ['port', '8121'],
            ['addr', '1.2.3.4']
        ],
        'METADATA'
    );
    [
        'addr',
        'port',
        'path',
        'proto',
        'url'
    ].forEach(function (attr_name) {
        test.ok(test_obj.hasOwnProperty(attr_name), 'Test obj should have ' + attr_name + ' property.');
    });
    test_obj = {};
    Utils.ServerURL(
        test_obj,
        [
            ['port', '8121'],
            ['url', 'https://1.2.3.4:8121/blarg']
        ],
        'METADATA'
    );
    test.equal(test_obj.url, 'https://1.2.3.4:8121/blarg');
    test.done();
};


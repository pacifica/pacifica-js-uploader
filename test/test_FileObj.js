exports.testFileObj = function(test) {
    var FileObj = require('../lib/FileObj');
    test_obj = new FileObj();
    attrs = [
	            'destinationTable',
	            'name',
	            'subdir',
	            'size',
	            'hashtype',
	            'hashsum',
	            'mimetype',
	            'ctime',
	            'mtime'
    ];
    for(i = 0; i < attrs.length; i++) {
        test.ok(test_obj.hasOwnProperty(attrs[i]), 'FileObj should have '+attrs[i]+' property.');
    }
    test_obj = new FileObj('{"name": "blarg"}');
    test.equal(test_obj.name, 'blarg', 'passing json to fileobj sets the properties.');
    test.done();
};


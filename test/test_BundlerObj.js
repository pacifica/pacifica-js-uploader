exports.testBundlerObj = function (test) {
    'use strict';
    var BundlerObj = require('../lib/BundlerObj'),
        fs = require('fs'),
        MetaData = require('../lib/MetaData'),
        md_obj = new MetaData();
    test.expect(1);
    fs.stat('README.md', function (err, stats) {
        var mytar = fs.createWriteStream('mytar.tar'),
            test_obj = new BundlerObj(md_obj, [
                {
                    'tarEntryArgs': {
                        'name': 'data/README.md',
                        'size': stats.size,
                        'mtime': stats.mtimeMs/1000
                    },
                    'readStream': fs.createReadStream('README.md')
                },
                {
                    'tarEntryArgs': {
                        'name': 'blarg/package.json',
                        'size': stats.size,
                        'mtime': stats.mtimeMs/1000
                    },
                    'readStream': fs.createReadStream('package.json')
                }
            ],
            'sha1');
        test_obj.stream(mytar, function () {
            mytar.on('close', function() {
                test.equal('blarg', 'blarg', 'passing json to fileobj sets the properties.');
            });
            mytar.flush();
            mytar.end();
        });
    });
    setTimeout(function () {
        test.done();
    }, 2000);
};


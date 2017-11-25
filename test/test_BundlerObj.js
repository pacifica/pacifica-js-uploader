exports.testBundlerObj = function (test) {
    'use strict';
    var BundlerObj = require('../lib/BundlerObj'),
        fs = require('fs'),
        tar = require('tar-stream'),
        tempfile = require('tempfile'),
        temptar = tempfile('.tar'),
        MetaData = require('../lib/MetaData'),
        Promise = require('promise'),
        md_obj = new MetaData(),
        file_promises = [];
    test.expect(5);
    [
        ['README.md', 'data/README.md'],
        ['package.json', 'blarg/package.json']
    ].forEach(function (part) {
        file_promises.push(new Promise( function (resolve, reject) {
            var filepath = part[0], archpath = part[1];
            fs.stat(filepath, function (err, stats) {
                if(err) { reject(err); }
                resolve({
                    'tarEntryArgs': {
                        'name': archpath,
                        'size': stats.size,
                        'mtime': stats.mtime
                    },
                    'readStream': fs.createReadStream(filepath)
                });
            });
        }));
    });
    Promise.all(file_promises).then( function (file_data) {
        var mytar = fs.createWriteStream(temptar),
            test_obj = new BundlerObj(md_obj, file_data, 'sha1');
        test_obj.stream(mytar).then(function () {
            mytar.on('finish', function () {
                var extract = tar.extract(),
                    names = ['data/README.md', 'blarg/package.json', 'metadata.txt'];
                test.ok(true, 'Got to end the tarfile.');
                extract.on('entry', function(header, stream, next) {
                    test.equal(header.name, names[0], 'names for header matches.');
                    names.shift();
                    stream.on('end', function() {
                        next();
                    });
                    stream.resume();
                });
                extract.on('finish', function() {
                    test.ok(true, 'Finished extracting the tar.');
                });
                fs.createReadStream(temptar).pipe(extract);
            });
            mytar.flush();
            mytar.end();
        });
    });
    setTimeout(function () {
        test.done();
    }, 3000);
};


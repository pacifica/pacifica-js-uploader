exports.testUploaderObj = function (test) {
    'use strict';
    var UploaderObj = require('../lib/UploaderObj'),
        test_obj_a = new UploaderObj({'port': 8192}),
        test_obj_b = new UploaderObj({'upload_url': 'something we know'}),
        test_obj_c = new UploaderObj({'status_url': 'something else we know'});
    test.equal(test_obj_a.port, 8192, 'port got set right');
    test.equal(test_obj_a.upload_url, 'http://127.0.0.1:8192/upload', 'set port in url correctly');
    test.equal(test_obj_b.upload_url, 'something we know', 'upload url can be set to something we know');
    test.equal(test_obj_c.status_url, 'something else we know', 'status url can be set to something else we know');
    test.done();
};
exports.testUploaderObjFull = function (test) {
    'use strict';
    var BundlerObj = require('../lib/BundlerObj'),
        fs = require('fs'),
        tempfile = require('tempfile'),
        temptar = tempfile('.tar'),
        MetaUpdate = require('../lib/MetaUpdate'),
        Promise = require('promise'),
        MetaObj = require('../lib/MetaObj'),
        md_obj = new MetaUpdate('dmlb2001'),
        file_promises = [];
    md_obj.push(new MetaObj({
        'destinationTable': 'Transactions.submitter',
        'value': 10
    }));
    md_obj.push(new MetaObj({
        'destinationTable': 'Transactions.project',
        'value': '1234a'
    }));
    md_obj.push(new MetaObj({
        'destinationTable': 'Transactions.instrument',
        'value': 54
    }));
    test.expect(7);
    [
        ['README.md', 'data/README.md'],
        ['package.json', 'data/package.json']
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
                fs.stat(temptar, function (err, stats) {
                    if (err) { throw err; }
                    var Uploader = require('../lib/UploaderObj'),
                        up_obj = new Uploader();
                    up_obj.upload(fs.createReadStream(temptar), stats.size).then( function (js_obj) {
                        test.ok(js_obj, 'return statement is something');
                        test.ok(js_obj.hasOwnProperty('job_id'), 'return object has a job_id');
                        setTimeout(function () {
                            up_obj.getstate(js_obj.job_id).then( function (res) {
                                test.ok(res, 'valid response is returned');
                                test.ok(res.hasOwnProperty('exception'), 'object has exception attr');
                                test.ok(res.hasOwnProperty('task'), 'object has task attr');
                                test.equal(res.exception, '', 'exception is not set.');
                                test.equal(res.task, 'ingest metadata', 'task should be ingest files.');
                            });
                        }, 2000);
                    });
                });
            });
            mytar.flush();
            mytar.end();
        });
    });
    setTimeout(function () {
        test.done();
    }, 4000);
};

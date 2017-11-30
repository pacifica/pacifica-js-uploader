var UploaderObj = function (js_obj) {
    'use strict';
    if (js_obj === undefined) {
        js_obj = {};
    }
    var Promise = require('promise'),
        Utils = require('./Utils');
    Utils.ServerURL(
        js_obj,
        [
            ['port', 8066],
            ['addr', '127.0.0.1'],
            ['upload_path', '/upload'],
            ['status_path', '/get_state'],
            ['proto', 'http'],
            ['upload_url', undefined],
            ['status_url', undefined]
        ],
        'ingest'
    );
    if (js_obj.upload_url === undefined) {
        js_obj.upload_url = js_obj.proto + '://' + js_obj.addr + ':' + js_obj.port + js_obj.upload_path;
    }
    if (js_obj.status_url === undefined) {
        js_obj.status_url = js_obj.proto + '://' + js_obj.addr + ':' + js_obj.port + js_obj.status_path;
    }

    js_obj.upload = function (read_stream, content_length) {
        return new Promise( function (resolve, reject) {
            var http = require(js_obj.proto),
                options = {
                    protocol: js_obj.proto+':',
                    hostname: js_obj.addr,
                    port: js_obj.port,
                    method: 'POST',
                    path: js_obj.upload_path,
                    headers: {
                        'Content-Type': 'application/octet-stream',
                        'Content-Length': content_length
                    }
                },
                req = http.request(options, function (res) {
                    var body_content = '';
                    res.setEncoding('utf8');
                    res.on('data', function (chunk) {
                        body_content += chunk;
                    });
                    res.on('end', function () {
                        resolve(JSON.parse(body_content));
                    });
                }).on('error', reject);
            req.on('error', reject);
            read_stream.pipe(req);
        });
    };

    js_obj.getstate = function (job_id) {
        return new Promise( function (resolve, reject) {
            var http = require(js_obj.proto),
                options = {
                    protocol: js_obj.proto+':',
                    hostname: js_obj.addr,
                    port: js_obj.port,
                    method: 'GET',
                    path: js_obj.status_path+'?job_id='+job_id
                },
                req = http.request(options, function (res) {
                    var body_content = '';
                    res.setEncoding('utf8');
                    res.on('data', function (chunk) {
                        body_content += chunk;
                    });
                    res.on('end', function () {
                        resolve(JSON.parse(body_content));
                    });
                }).on('error', reject);
            req.end();
        });
    };
    return js_obj;
};
module.exports = UploaderObj;

var PolicyQuery = function (user, js_obj) {
    'use strict';
    if (js_obj === undefined) {
        js_obj = {};
    }
    if (user === undefined) {
        return undefined;
    }
    var Promise = require('promise'),
        Utils = require('./Utils'),
        PolicyQueryData = require('./PolicyQueryData'),
        protos = {
            http: require('http'),
            https: require('https')
        };
    Utils.ServerURL(
        js_obj,
        [
            ['port', 8181],
            ['addr', '127.0.0.1'],
            ['proto', 'http'],
            ['uploader_path', '/uploader'],
            ['ingest_path', '/ingest'],
            ['uploader_url', undefined],
            ['ingest_url', undefined]
        ],
        'policy'
    );

    js_obj.setUser = function () {
        return new Promise( function (resolve, reject) {
            var user_pqd = {
                    user: -1,
                    columns: ['_id'],
                    from: 'users',
                    where: {network_id: user}
                }, user_pq = {pq_data:{}};
            [
                'port',
                'addr',
                'proto',
                'uploader_path',
                'ingest_path',
                'uploader_url',
                'ingest_url'
            ].forEach(function (prop) {
                user_pq[prop] = js_obj[prop];
            });
            console.log(user_pq);
            user_pq = new PolicyQuery(-1, user_pq);
            user_pq.pq_data = user_pqd;
            console.log(user_pq);
            user_pq.get_results().then(function (results) {
                js_obj.pq_data.user = results[0]._id;
                resolve();
            }, reject);
        });
    };

    js_obj._generic_policy = function (path_part, send_obj) {
        return new Promise( function (resolve, reject) {
            var http = protos[js_obj.proto], options = {
                    protocol: js_obj.proto+':',
                    hostname: js_obj.addr,
                    port: js_obj.port,
                    method: 'POST',
                    path: js_obj[path_part+'_path'],
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': JSON.stringify(send_obj).length
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
            req.write(JSON.stringify(send_obj));
            req.end();
        });
    };
    js_obj.valid_metadata = function (md_obj) {
        return js_obj._generic_policy('ingest', md_obj);
    };
    js_obj.get_results = function () {
        return js_obj._generic_policy('uploader', js_obj.pq_data);
    };

    if (!js_obj.hasOwnProperty('pq_data')) {
        return undefined;
    }
    js_obj.pq_data = new PolicyQueryData(js_obj.pq_data);
    return js_obj;
};
module.exports = PolicyQuery;

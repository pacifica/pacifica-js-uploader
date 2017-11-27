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
        PolicyQueryData = require('./PolicyQueryData');
    Utils.ServerURL(
        js_obj,
        [
            ['port', 8181],
            ['addr', '127.0.0.1'],
            ['path', '/uploader'],
            ['proto', 'http'],
            ['url', undefined]
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
                }, user_pq = {
                    pq_data: user_pqd,
                    auth: js_obj.auth
                }, user_pq_obj = new PolicyQuery(-1, user_pq);
            user_pq_obj.get_results().then(function (results) {
                js_obj.pq_data.user = results[0]._id;
                resolve();
            }, reject);
        });
    };

    js_obj.get_results = function () {
        return new Promise( function (resolve, reject) {
            var http = require(js_obj.proto), options = {
                    protocol: js_obj.proto+':',
                    hostname: js_obj.addr,
                    port: js_obj.port,
                    method: 'POST',
                    path: js_obj.path,
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': JSON.stringify(js_obj.pq_data).length
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
            req.write(JSON.stringify(js_obj.pq_data));
            req.end();
        });
    };

    if (!js_obj.hasOwnProperty('pq_data')) {
        return undefined;
    }
    js_obj.pq_data = new PolicyQueryData(js_obj.pq_data);
    return js_obj;
};
module.exports = PolicyQuery;

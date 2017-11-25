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
            var Client = require('node-rest-client').Client, args = {
                    data: js_obj.pq_data,
                    headers: {'Content-Type': 'application/json'}
                }, client = new Client();
            client.post(js_obj.url, args, function (data) {
                resolve(data);
            }).on('error', reject);
        });
    };

    if (!js_obj.hasOwnProperty('pq_data')) {
        return undefined;
    }
    js_obj.pq_data = new PolicyQueryData(js_obj.pq_data);
    return js_obj;
};
module.exports = PolicyQuery;

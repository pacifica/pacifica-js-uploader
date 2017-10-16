/*jslint unparam: true */
var PolicyQuery;
PolicyQuery = function (user, js_obj) {
    'use strict';
    if (js_obj === undefined) {
        js_obj = {};
    }
    if (user === undefined) {
        return undefined;
    }
    var Utils = require('./Utils');
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

    var PolicyQueryData = require('./PolicyQueryData');
    js_obj.setUser = function (got_user_callback) {
        var user_pqd = {
            user: -1,
            columns: ['_id'],
            from: 'users',
            where: {network_id: user}
        };
        var user_pq = {
            pq_data: user_pqd,
            auth: js_obj.auth
        };
        var user_pq_obj = new PolicyQuery(-1, user_pq);
        user_pq_obj.get_results(function (user_pq_obj, results) {
            js_obj.pq_data.user = results[0]._id;
            got_user_callback();
        });
    };

    js_obj.get_results = function (results_callback) {
        var Client = require('node-rest-client').Client;
        var client = new Client();
        var args = {
            data: js_obj.pq_data,
            headers: {'Content-Type': 'application/json'}
        };
        client.post(js_obj.url, args, function (data) {
            results_callback(js_obj, data);
        });
    };

    if (!js_obj.hasOwnProperty('pq_data')) {
        return undefined;
    }
    js_obj.pq_data = new PolicyQueryData(js_obj.pq_data);
    return js_obj;
};
module.exports = PolicyQuery;

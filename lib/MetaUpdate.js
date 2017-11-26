var MetaUpdate = function (user, js_obj) {
    'use strict';
    if (js_obj === undefined) {
        js_obj = '[]';
    }
    if (typeof js_obj === 'string') {
        js_obj = JSON.parse(js_obj);
    }
    var PolicyQuery = require('./PolicyQuery'),
        MetaData = require('./MetaData'),
        Promise = require('promise'),
        ejs = require('ejs');
    js_obj = new MetaData(js_obj);
    js_obj._user = user;

    js_obj.query_results = function (meta_id) {
        var where_clause = {}, meta_obj = js_obj.byMetaID(meta_id), pq_obj;
        Object.keys(meta_obj.queryDependency).forEach(function (key) {
            where_clause[key] = meta_obj.queryDependency[key];
        });
        pq_obj = new PolicyQuery(user, {pq_data: {
            'user': user,
            'columns': meta_obj.queryFields,
            'from': meta_obj.sourceTable,
            'where': where_clause
        }});
        return new Promise( function (resolve, reject) {
            pq_obj.get_results().then(resolve, reject);
        });
    };
    js_obj.dependent_meta_id = function (meta_id) {
        return Object.values(js_obj.byMetaID(meta_id).queryDependency).filter(function (value) {
            return meta_id != value;
        });
    };
    js_obj.update_parents = function (meta_id) {
        var meta_obj;
        js_obj.dependent_meta_id(meta_id).forEach(js_obj.update_parents);
        meta_obj = js_obj.byMetaID(meta_id);
        return new Promise( function (resolve, reject) {
            js_obj.query_results(meta_id).then(function (data) {
                meta_obj.query_results = data;
                if (meta_obj.query_results && !meta_obj.value) {
                    meta_obj.value = meta_obj.query_results[0][meta_obj.valueField];
                }
                resolve();
            }, reject);
        });
    };
    js_obj.directory_prefix = function () {
        var dirs = [],
            dir_md_objs = js_obj.filter(function (meta_obj) {
                return meta_obj.directoryOrder !== undefined;
            });
        dir_md_objs.sort(function (meta_obj_a, meta_obj_b) {
            return meta_obj_a.directoryOrder - meta_obj_b.directoryOrder;
        });
        dir_md_objs.forEach(function (meta_obj) {
            dirs.push(ejs.render(meta_obj.displayFormat, meta_obj.query_results[0]));
        });
        return dirs.join('/');
    };
    return js_obj;
};
module.exports = MetaUpdate;

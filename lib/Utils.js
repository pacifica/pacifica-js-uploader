var ServerURL = function (js_obj, parts, env_prefix) {
    'use strict';
    parts.forEach(function (element) {
        var attr_name = element[0];
        var def_val = element[1];
        if (!js_obj.hasOwnProperty(attr_name)) {
            js_obj[attr_name] = def_val;
        }
    });
    [
        ['addr', '127.0.0.1'],
        ['port', 8080],
        ['path', '/'],
        ['proto', 'http'],
        ['url', undefined]
    ].forEach(function (element) {
        var attr_name = element[0];
        var def_value = element[1];
        var env_name = env_prefix + '_' + attr_name;
        env_name = env_name.toUpperCase();
        if (!js_obj.hasOwnProperty(attr_name) && process.env.hasOwnProperty(env_name)) {
            js_obj[attr_name] = process.env[env_name];
        }
        if (!js_obj.hasOwnProperty(attr_name)) {
            js_obj[attr_name] = def_value;
        }
    });
    if (js_obj.url === undefined) {
        js_obj.url = js_obj.proto + '://' + js_obj.addr + ':' + js_obj.port + js_obj.path;
    }
};
module.exports.ServerURL = ServerURL;

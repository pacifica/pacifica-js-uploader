var ServerURL = function (js_obj, parts, env_prefix) {
    parts.forEach(function (element) {
        var part = element[0];
        var def_val = element[1];
        var attr_name = '_' + part;
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
        var attr_name = '_'+element[0];
        var def_value = element[1];
        var env_name = (env_prefix + attr_name).toUpperCase();
        if (!js_obj.hasOwnProperty(attr_name) && process.env.hasOwnProperty(env_name)) {
            js_obj[attr_name] = process.env[env_name];
        }
        if(!js_obj.hasOwnProperty(attr_name)) {
            js_obj[attr_name] = def_value;
        }
    });
    if (js_obj._url === undefined) {
        js_obj._url = js_obj._proto+'://'+js_obj._addr+':'+js_obj._port+js_obj._path;
    }
};
module.exports.ServerURL = ServerURL;

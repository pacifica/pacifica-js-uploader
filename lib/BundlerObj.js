/*
 * file_data should be a list of objects like the following:
 * file_data = [
 *   {
 *     'tarEntryArgs': {},
 *     'readStream': 'file read stream',
 *   },
 *   ...
 * ]
 */
var BundlerObj = function (md_obj, file_data, hash_func) {
    'use strict';
    var ret_obj = {}, path = require('path'), tar = require('tar-stream'), crypto = require('crypto'), mime = require('mime'), StreamMultiplexer = require('stream-multiplexer'), Promise = require('promise');
    ret_obj.stream = function (write_obj, complete_func) {
        var pack = tar.pack(), filePromises = [];
        file_data.forEach(function (arch_obj) {
            var mux = new StreamMultiplexer(),
            entry = pack.entry(arch_obj.tarEntryArgs),
            hash = crypto.createHash(hash_func);
            filePromises.push(new Promise( function (resolve, reject) {
                console.log("I ran this part");
                entry.on('finish', function () {
                    console.log("got end2");
                    resolve(arch_obj.hashsum);
                });
                entry.on('error', reject);
            }));
            arch_obj.readStream.on('data', function (chunk) {
                console.log("got data");
                entry.write(chunk);
                hash.update(chunk);
            });
            arch_obj.readStream.on('end', function () {
                console.log("got end");
                arch_obj.hashsum = hash.digest('hex');
                entry.end();
            });
        });
        console.log(filePromises);
        Promise.all(filePromises).then(function (res) {
            console.log("Done with promises");
            console.log(res);
            file_data.forEach(function (arch_obj) {
                var tarch_obj = arch_obj.tarEntryArgs,
                dirname = path.dirname(tarch_obj.name),
                subdir_parts = dirname.split('/'),
                subdir = "",
                date = new Date(tarch_obj.mtime * 1000);
                subdir_parts = subdir_parts.filter(function (part) {
                    return part.length > 0;
                });
                if (subdir_parts[0] == 'data') {
                    subdir_parts.shift();
                }
                subdir = subdir_parts.join('/');
                console.log(subdir);
                md_obj.push({
                    'size': tarch_obj.size,
                    'name': path.basename(tarch_obj.name),
                    'subdir': subdir,
                    'mimetype': mime.getType(tarch_obj.name),
                    'mtime': date.toUTCString(),
                    'ctime': date.toUTCString(),
                    'destinationTable': 'Files',
                    'hashtype': hash_func,
                    'hashsum': arch_obj.hashsum
                });
            });
            pack.entry({name: 'metadata.txt'}, JSON.stringify(md_obj));
            pack.finalize();
            pack.pipe(write_obj);
            complete_func();
        }, function () {
            console.log("Error rejecting");
        });
    };
    return ret_obj;
};
module.exports = BundlerObj;

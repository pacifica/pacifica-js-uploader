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
    var ret_obj = {}, path = require('path'), tar = require('tar-stream'), crypto = require('crypto'), mime = require('mime'), Promise = require('promise');
    ret_obj.stream = function (write_obj) {
        var pack = tar.pack(),
            recursive_promises = function (i) {
                var arch_obj = file_data[i],
                    entry = pack.entry(arch_obj.tarEntryArgs),
                    hash = crypto.createHash(hash_func);
                return new Promise(function (resolve, reject) {
                    arch_obj.readStream.on('data', function (chunk) {
                        entry.write(chunk);
                        hash.update(chunk);
                    }).on('end', function () {
                        arch_obj.hashsum = hash.digest('hex');
                        entry.end();
                        if(i+1 < file_data.length) {
                            recursive_promises(i+1).then(function (msg) {
                                resolve(msg+' done '+arch_obj.tarEntryArgs.name);
                            }, reject);
                        } else {
                            resolve('done '+arch_obj.tarEntryArgs.name);
                        }
                    }).on('error', reject);
                });
            };
        return recursive_promises(0).then(function () {
            file_data.forEach(function (arch_obj) {
                var tarch_obj = arch_obj.tarEntryArgs,
                    dirname = path.dirname(tarch_obj.name),
                    subdir_parts = dirname.split('/'),
                    subdir = '',
                    date = new Date(tarch_obj.mtime * 1000);
                subdir_parts = subdir_parts.filter(function (part) {
                    return part.length > 0;
                });
                if (subdir_parts[0] === 'data') {
                    subdir_parts.shift();
                }
                subdir = subdir_parts.join('/');
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
        });
    };
    return ret_obj;
};
module.exports = BundlerObj;

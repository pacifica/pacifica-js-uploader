/*jshint esversion: 6 */
function FileObj(jsonstr='{}') {
    passedObj = JSON.parse(jsonstr);
    attrs = [
	'destinationTable',
	'name',
	'subdir',
	'size',
	'hashtype',
	'hashsum',
	'mimetype',
	'ctime',
	'mtime'
    ];
    for(i = 0; i < attrs.length; i++) {
	this[attrs[i]] = '';
	if(passedObj[attrs[i]]) {
	    this[attrs[i]] = passedObj[attrs[i]];
	}
    }
}
module.exports = FileObj;

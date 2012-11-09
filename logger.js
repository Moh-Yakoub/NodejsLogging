var fs = require("fs");
var os = require("os");
var crypto = require("crypto");
var colors = require("colors");
var globalstream;

var globaldir;
var globallength;
var globalshasum;
var globallastwritten;
var globalwritestream;

exports.Logger = function(dir,length){
globaldir = dir;
globallength = length;
globalshasum = crypto.createHash('sha1');
lastwritten = 0;
var now = new Date();
globalshasum.update(now.toJSON());

globalwritestream = fs.createWriteStream(dir+"/"+globalshasum.digest('hex'),{'mode':0666});
globalstream = globalwritestream;
console.log("created stream".red.bold);
}
exports.log = function(s){
console.log("logged".red.bold);

globalwritestream.write(new Date()+":"+s);
globalwritestream.write(os.EOL);
if(Math.abs(globallastwritten - globalwritestream.bytesWritten) >= (1024*1024)){//1 Mb then flush
globallastwritten=0;
globalwritestream.flush();
}
if(globalwritestream.bytesWritten == globallength){
var now = new Date();
globalwritestream.end();
globalshasum.update(now);
globalwritestream = fs.createWriteStream(globaldir+"/"+shasum.digest('hex'),{'mode':0666});
globallastwritten=0;
}
}
process.on('exit',function(){
globalstream.end();
});
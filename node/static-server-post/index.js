#!/usr/bin/env node
/*
 *  index.js
 *
 *   start server.js of static-server-post with settings for this project folder
 *
 *   ex: ( $ node index.js 8080 )
 *
 *   which is short for: ( $ node server.js ../../ ../../public 8080 ) from this working folder
 *
 */

let spawn = require('child_process').spawn,
path = require('path'),

uri_root = path.join(__dirname, '../../'),
uri_public = path.join(uri_root, 'public'),
uri_server = path.join(__dirname, 'server.js')

let ls = spawn('node', [uri_server, uri_root, uri_public, process.argv[2] || 8080]);

ls.stdout.on('data', function(data){
    console.log(data.toString());
});

ls.stderr.on('data', function(data){
    console.log(data.toString());
});

ls.on('exit', function (code) {
  console.log('Child process exited with exit code ' + code);
});

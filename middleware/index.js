let http = require('http'),
os = require('os'),
fs = require('fs'),
path = require('path'),
promisify = require('util').promisify,
lstat = promisify(fs.lstat),
readFile = promisify(fs.readFile),
readdir = promisify(fs.readdir);

// the public folder
let dir_public = path.join(__dirname, '../public'),
// path to the map.json file
uri_map = path.join( dir_public, 'map.json' );

module.exports = (req, res, next) => {

    console.log('for now I just log this message');
    console.log(req.body);   // the parsed body from the client
    console.log(res.resObj); // the response object that will be sent

    // read map
    readFile(uri_map)
    // if all goes well reading map
    .then((mapText)=>{
        try{
            res.resObj.map = JSON.parse(mapText);
        }catch(e){
            res.resObj.map = {};
        }
        next(req, res);
    })
    // error reading map
    .catch((e)=>{
        console.log('error reading map.json: ' + e.message);
        res.resObj.map = {};
        next(req, res);
    });



};
/*
 *  server.js
 *
 *   This just provides a simple static server for the project.
 *
 *   ex: $ node server ./ 8080
 *
 */

let http = require('http'),
os = require('os'),
fs = require('fs'),
path = require('path'),
promisify = require('util').promisify,
lstat = promisify(fs.lstat),
readFile = promisify(fs.readFile),
readdir = promisify(fs.readdir);

// THE MAX BODY SIZE
let BODY_MAX_SIZE = 1024;

// the root folder of the project
let dir_root = process.argv[2] || path.join(__dirname, '../..');

// the folder to look for middware to know what to do for post requests
let dir_middleware = path.join(dir_root, 'middleware');

// default middleware is noop
let middleware = function(){}; 

// public folder to serve
let dir_public = process.argv[3] || path.join(__dirname, '../../public');

// set port with argument or hard coded default
let port = process.argv[4] || 8080; // port 8888 for now

// host defaults to os.networkInterfaces().lo[0].address
let netInter = os.networkInterfaces();
let host = process.argv[5] || netInter.lo[0].address; 

// create path info object
let createPathInfoObject = (url) => {
    // remove any extra / ( /foo/bar/  to /foo/bar )
    let urlArr = url.split('');
    if(urlArr[urlArr.length - 1] === '/'){
        urlArr.pop();
        url = urlArr.join('');
    }  
    // starting state
    let pInfo = {
        url : url,
        uri : path.join(dir_public, url),
        encoding: 'utf-8',
        mime: 'text/plain',
        ext: '',
        contents: [],
        html: ''
    };
    //return pInfo;
    return lstat(pInfo.uri)
    .then((stat)=>{
        pInfo.stat = stat;
        if(pInfo.stat.isFile()){
            pInfo.ext = path.extname(pInfo.uri).toLowerCase();
            pInfo.ext = path.extname(pInfo.uri).toLowerCase();
            pInfo.mime = pInfo.ext === '.html' ? 'text/html' : pInfo.mime;
            pInfo.mime = pInfo.ext === '.css' ? 'text/css' : pInfo.mime;
            pInfo.mime = pInfo.ext === '.js' ? 'text/javascript' : pInfo.mime;
            pInfo.mime = pInfo.ext === '.json' ? 'application/json' : pInfo.mime;
             // images
            pInfo.mime = pInfo.ext === '.png' ? 'image/png' : pInfo.mime;
            pInfo.mime = pInfo.ext === '.ico' ? 'image/x-icon' : pInfo.mime;
            // binary encoding if...
            pInfo.encoding = pInfo.ext === '.png' || pInfo.ext === '.ico' ? 'binary' : pInfo.encoding;
            return pInfo;
        }
        if(pInfo.stat.isDirectory()){
            pInfo.ext = '';
            pInfo.mime = 'text/plain';
            pInfo.encoding = 'utf-8';
        }
        return createDirInfo(pInfo);
    });
};

// create an html index of a folder
let createHTML = (pInfo) => {
    var html = '<html><head><title>Index of - ' + pInfo.url + '</title>'+
    '<style>body{padding:20px;background:#afafaf;font-family:arial;}div{display: inline-block;padding:10px;}</style>' +
    '</head><body>';
    html += '<h3>Contents of : ' + pInfo.url + '</h3>'
    pInfo.contents.forEach((itemName)=>{
        let itemURL = pInfo.url + '/' + itemName;
        html += '<div> <a href=\"' + itemURL + '\" >' +  itemName + '</a> </div>'
    });
    html += '</body></html>';
    return html;
};

// create dir info for a pInfo object
let createDirInfo = (pInfo) => {
    // first check for an index.html
    let uriIndex = path.join( pInfo.uri, 'index.html' );
    return readFile(uriIndex)
    // if all goes file we have an indrex file call createPathInfoObject with new uri
    .then((file)=>{
        pInfo.uri = uriIndex;
        pInfo.ext = '.html';
        pInfo.mime = 'text/html';
        return pInfo;
    })
    // else we do not get contents
    .catch(()=>{
        return readdir(pInfo.uri);
    }).then((contents)=>{
        if(contents && pInfo.ext === ''){
            pInfo.contents = contents;
            pInfo.mime = 'text/html';
            pInfo.html = createHTML(pInfo);
        }
        return pInfo;
    });
};

// parse a body for a post request
let parseBody = (req, res, next) => {
    let bodyStr = '';
    req.body = {};
    req.on('data', function (chunk) {
        bodyStr += chunk.toString();
        // do some basic sanitation
        if (bodyStr.length >= BODY_MAX_SIZE) {
            // if body char length is greater than
            // or equal to 200 destroy the connection
            res.connection.destroy();
        }
    });
    // once the body is received
    req.on('end', function () {
        try{
            req.body = JSON.parse(bodyStr);
        }catch(e){
            req.body = bodyStr;
        }
        next(req, res);
    });
};

// create server object
let server = http.createServer();


let forRequest = {};

// for ALL GET requests
forRequest.GET = (req, res) => {
    // create path info object for req.url
    createPathInfoObject(req.url)
    // if we have a pinfo object without any problems
    .then((pInfo)=>{
        // if we have html send that
        if(pInfo.html != ''){
            res.writeHead(200, {
                'Content-Type': pInfo.mime
            });
            res.write(pInfo.html, pInfo.encoding);
            res.end();
        }else{
            // else we are sending a file
            readFile(pInfo.uri, pInfo.encoding).then((file)=>{
                res.writeHead(200, {
                    'Content-Type': pInfo.mime
                });
                res.write(file, pInfo.encoding);
                res.end();
            }).catch((e)=>{
                // send content
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });
                res.write(e.message, 'utf8');
                res.end();
            });
        }
    }).catch((e)=>{
        // send content
        res.writeHead(500, {
            'Content-Type': 'text/plain'
        });
        res.write(e.message, 'utf8');
        res.end();
    });
};

// for any post request
forRequest.POST = (req, res) => {
    // parse the given body
    parseBody(req, res, function(req, res){
        // when done send a response
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        // send back this object as a response
        res.write(JSON.stringify({
            body: req.body,
            mess: 'this is dog'
        }), 'utf8');
        res.end();
    });
};

// on request
server.on('request', (req, res)=>{
    // call method for request method
    var method = forRequest[req.method];
    if(method){ 
        method.call(this, req, res);
    }else{
        // send content
        res.writeHead(500, {
            'Content-Type': 'text/plain'
        });
        res.write('unsupported http method ' + req.method, 'utf8');
        res.end();
    }
});

// start server
server.listen(port, host, () => {
    console.log('server is up: ');   
    console.log('dir_root: ' + dir_root);
    console.log('dir_public: ' + dir_public);
    console.log('port: ' + port);
    console.log('host: ' + host);
    // try to set up middelware
    try{
        middleware = require(path.join(dir_middleware, 'index.js') );
    }catch(e){
        console.log('no /middleware/index.js found.');
    }
});

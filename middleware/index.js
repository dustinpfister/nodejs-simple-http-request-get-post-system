let http = require('http'),
os = require('os'),
fs = require('fs'),
path = require('path'),
promisify = require('util').promisify,
lstat = promisify(fs.lstat),
readFile = promisify(fs.readFile),
writeFile = promisify(fs.writeFile),
readdir = promisify(fs.readdir);

// the public folder
let dir_public = path.join(__dirname, '../public'),
// path to the map.json file
uri_map = path.join( dir_public, 'map.json' );

// create new map object helper
let createNewMap = () => {
    let map = { cells:[], w: 8, h: 8 };
    let i = 0, cell, len = map.w * map.h;
    while(i < len){
        cell = {
            i : i,
            x: i % map.w,
            y: Math.floor(i / map.w),
            typeIndex: 0
        };
        map.cells.push(cell);
        i += 1;
    }
    // start off map cell 0 with type index 1
    map.cells[0].typeIndex = 1;
    return map;
};

let updateMap = (map, body) => {
    if(body.action === 'setCellType'){
        var cellIndex = body.cellIndex,
        typeIndex = body.typeIndex;
        map.cells[cellIndex].typeIndex = typeIndex;
    }
};

module.exports = (req, res, next) => {
    // read map
    readFile(uri_map)
    // if all goes well reading map
    .then((mapText)=>{
        let map = {};
        try{
            map = JSON.parse(mapText);
        }catch(e){
            map = {};
        }

        // apply any actions to map
        updateMap(map, req.body);

        // write map
        writeFile(uri_map, JSON.stringify(newMap), 'utf8')
        .then(()=>{
            res.resObj.map = map;
            next(req, res);
        })
        .catch((e)=>{
            res.resObj.mess = 'error updating map.json: ' + e.message;
            res.resObj.map = map;
            next(req, res);
        });

    })
    // error reading map
    .catch((e)=>{
        res.resObj.map = {};
        // write a new map
        var newMap = createNewMap();
        // apply any actions to new map
        updateMap(newMap, req.body);
        // write map
        writeFile(uri_map, JSON.stringify(newMap), 'utf8')
        .then((map)=>{
            res.resObj.map = newMap;
            next(req, res);
        })
        .catch((e)=>{
            res.resObj.mess = 'error making new map.json: ' + e.message;
            res.resObj.map = newMap;
            next(req, res);
        });
    });
};



var setCellType = function (cellIndex, typeIndex, done) {
    utils.http({
        url: '/',
        method: 'POST',
        body: JSON.stringify({
            mess: 'hello',
            action: 'setCellType',
            cellIndex: 1,
            typeIndex: 1
        }),
        onDone: function (res) {
            done(res, null);
        },
        onError: function (e) {
            done(null, e);
        }
    });
};

// get the current state of the map
var getMap = function (done) {
    utils.http({
        url: '/map.json',
        method: 'GET',
        onDone: function (res) {
            try {
                var obj = JSON.parse(res);
                done(obj, null);
            } catch (e) {
                done(null, e);
            }
        }
    });
};

getMap(function (map, e) {
    if (e) {
        console.log(e);
    } else {
        console.log(map)
    }
});

/*
// set cell type
setCellType(1, 1, function (res, e) {
if (e) {
console.log(e);
} else {
console.log(res);
}
});
*/

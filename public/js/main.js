
var state = {
    map: {}
};

var setCellType = function (cellIndex, typeIndex, done) {
    utils.http({
        url: '/',
        method: 'POST',
        body: JSON.stringify({
            mess: 'hello',
            action: 'setCellType',
            cellIndex: cellIndex,
            typeIndex: typeIndex
        }),
        onDone: function (res) {
            done(JSON.parse(res), null);
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

// draw the state of the map
var drawMap = function (map) {
    var el = document.querySelector('#map_disp'),
    html = '<table>',
    cell,
    y = 0,
    x;
    while (y < map.h) {
        x = 0;
        html += '<tr>';
        while (x < map.w) {
            cell = map.cells[y * map.h + x];
            html += '<td>' + cell.typeIndex + '</td>';
            x += 1;
        }
        html += '</tr>';
        y += 1;
    }
    el.innerHTML = html + '</table>';
};

// call get map for the first time
getMap(function (map, e) {
    if (e) {
        console.log(e);
    } else {
        console.log('GET map');
        state.map = map;
        drawMap(state.map);
    }
});

document.getElementById('input_set_typeindex').addEventListener('click', function () {
    var x = document.getElementById('input_x').value,
    y = document.getElementById('input_y').value,
    cellIndex = parseInt(y) * state.map.w + parseInt(x),
    typeIndex = parseInt(document.getElementById('input_typeindex').value);
    // set cell type
    setCellType(cellIndex, typeIndex, function (res, e) {
        if (e) {
            console.log(e);
        } else {
            state.map = res.map;
            drawMap(state.map);
        }
    });
});

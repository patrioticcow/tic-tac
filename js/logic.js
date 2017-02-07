function createGrid(g, h, w) {
    var a = Math.round(w / g);
    var b = Math.round(h / g);
    return [a * b, a, b];
}

function createHtml(grid) {
    var html = '';

    var css = '<style>';
    css += '.tic-btn { width: ' + (100 / grid[2]) + '%; height: ' + (100 / grid[1]) + '% }';
    css += '</style>';

    html += '<div>';
    for (var i = 0; i < grid[0]; i++) {
        if (i % grid[2] === 0) html += '</div><div class="db" id="r' + i + '">';
        html += '<div class="tic-btn tic-btn-sec" id="' + i + '"><div class="text"></div></div>';
    }
    html += '</div>';

    return css + html;
}

function getRowIds(el) {
    var curr     = el;
    var prev     = el.prev();
    var next     = el.next();
    var prevPrev = el.prev().prev();
    var nextNext = el.next().next();

    var currId     = curr.attr('id');
    var prevId     = prev.attr('id');
    var nextId     = next.attr('id');
    var prevPrevId = prevPrev.attr('id');
    var nextNextId = nextNext.attr('id');

    return [prevPrevId, prevId, currId, nextId, nextNextId];
}

function getArrays(el, grid) {
    var rowIds = getRowIds(el);

    var id            = el.attr('id');
    var prevPrevRowId = parseInt(id, 10) - (parseInt(grid[2], 10) * 2);
    var prevRowId     = parseInt(id, 10) - parseInt(grid[2], 10);
    var nextRowId     = parseInt(id, 10) + parseInt(grid[2], 10);
    var nextNextRowId = parseInt(id, 10) + (parseInt(grid[2], 10) * 2);

    var prevPrevRowIds = getRowIds($('#' + prevPrevRowId));
    var prevRowIds     = getRowIds($('#' + prevRowId));
    var nextRowIds     = getRowIds($('#' + nextRowId));
    var nextNextRowIds = getRowIds($('#' + nextNextRowId));

    return [prevPrevRowIds, prevRowIds, rowIds, nextRowIds, nextNextRowIds];
}

function blockHover(matrix) {
    $('.tic-btn').removeClass('tic-hovered');

    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            $('#' + matrix[i][j]).addClass('tic-hovered');
        }
    }
}

function removeFromArray(matrix, value) {
    if (!isset(value)) return matrix;

    // if the clicked id is in the matrix, remove it
    for (var i = 0; i < matrix.length; i++) {
        var index = matrix[i].indexOf(value.toString());

        if (index !== -1) matrix[i][index] = undefined;
    }

    return matrix;
}

function addToArray(id) {
    var newIds = getItem('newIds');
    var ids    = [];

    if (newIds === null) {
        ids.push(id);

        setItem('newIds', ids);
    } else {
        if (newIds.indexOf(id) === -1) newIds.push(id);

        setItem('newIds', newIds);
    }
}

function isset(i) {
    return !(i === undefined || i === null);
}

function matrixToArray(matrix) {
    var newArr = [];
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) newArr.push(matrix[i][j]);
    }

    return newArr;
}

function clearBlocks(rId, matrix) {
    for (var i = 0; i < rId.length; i++) {
        matrix = removeFromArray(matrix, matrix[rId[i][0]][rId[i][1]]);
    }

    return matrix;
}

function getMatrixKey(matrix, id) {
    var newArr = matrixToArray(matrix);

    for (var k = 0; k < newArr.length; k++) {
        if (id.toString() === newArr[k]) return k;
    }

    return null;
}

function buildMatrixToRemove(arr) {
    var rId = [
        // 0      1      2      3      4
        [0, 0], [0, 1], [0, 2], [0, 3], [0, 4],
        // 5      6      7      8      9
        [1, 0], [1, 1], [1, 2], [1, 3], [1, 4],
        // 10     11     12     13     14
        [2, 0], [2, 1], [2, 2], [2, 3], [2, 4],
        // 15     16     17     18     19
        [3, 0], [3, 1], [3, 2], [3, 3], [3, 4],
        // 20     21     22     23     24
        [4, 0], [4, 1], [4, 2], [4, 3], [4, 4]
    ];

    for (var i = 0; i < arr.length; i++) delete rId[arr[i]];

    return rId.filter(function () {
        return true;
    });
}

function rules(matrix, mKey) {
    var rId = null;

    if (mKey === 0) rId = buildMatrixToRemove([0, 1, 2, 5, 6, 7, 10, 11, 12]);
    if (mKey === 1) rId = buildMatrixToRemove([0, 1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13]);
    if (mKey === 2) rId = buildMatrixToRemove([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
    if (mKey === 3) rId = buildMatrixToRemove([1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 14]);
    if (mKey === 4) rId = buildMatrixToRemove([2, 3, 4, 7, 8, 9, 12, 13, 14]);

    if (mKey === 5) rId = buildMatrixToRemove([0, 1, 2, 5, 6, 7, 10, 11, 12, 15, 16, 17]);
    if (mKey === 6) rId = buildMatrixToRemove([0, 1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18]);
    if (mKey === 7) rId = buildMatrixToRemove([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
    if (mKey === 8) rId = buildMatrixToRemove([1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 14, 16, 17, 18, 19]);
    if (mKey === 9) rId = buildMatrixToRemove([2, 3, 4, 7, 8, 9, 12, 13, 14, 17, 18, 19]);

    if (mKey === 10) rId = buildMatrixToRemove([0, 1, 2, 5, 6, 7, 10, 11, 12, 15, 16, 17, 20, 21, 22]);
    if (mKey === 11) rId = buildMatrixToRemove([0, 1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 22, 23]);
    if (mKey === 13) rId = buildMatrixToRemove([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]);
    if (mKey === 13) rId = buildMatrixToRemove([1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 14, 16, 17, 18, 19, 21, 22, 23, 24]);
    if (mKey === 14) rId = buildMatrixToRemove([2, 3, 4, 7, 8, 9, 12, 13, 14, 17, 18, 19, 22, 23, 24]);

    if (mKey === 15) rId = buildMatrixToRemove([5, 6, 7, 10, 11, 12, 15, 16, 17, 20, 21, 22]);
    if (mKey === 16) rId = buildMatrixToRemove([5, 6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 22, 23]);
    if (mKey === 17) rId = buildMatrixToRemove([5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]);
    if (mKey === 18) rId = buildMatrixToRemove([6, 7, 8, 9, 11, 12, 13, 14, 16, 17, 18, 19, 21, 22, 23, 24]);
    if (mKey === 19) rId = buildMatrixToRemove([7, 8, 9, 12, 13, 14, 17, 18, 19, 22, 23, 24]);

    if (mKey === 20) rId = buildMatrixToRemove([10, 11, 12, 15, 16, 17, 20, 21, 22]);
    if (mKey === 21) rId = buildMatrixToRemove([10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 22, 23]);
    if (mKey === 22) rId = buildMatrixToRemove([10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]);
    if (mKey === 23) rId = buildMatrixToRemove([11, 12, 13, 14, 16, 17, 18, 19, 21, 22, 23, 24]);
    if (mKey === 24) rId = buildMatrixToRemove([12, 13, 14, 17, 18, 19, 22, 23, 24]);

    // clear blocks
    if (rId !== null) clearBlocks(rId, matrix);
}

/////////////////////////////////////////////////////////////
///////////////////////// START /////////////////////////////
/////////////////////////////////////////////////////////////

var c = $('#board');

c.html('');
removeItem('leftIds');
removeItem('newIds');

var h = c.width();
var w = c.height();
var g = 60;

var grid = createGrid(g, h, w);
var html = createHtml(grid);

c.html(html);

// get username
$('#username').val(getItem('username'));
$('#myUsername').html(getItem('username'));

$(document).on('mouseover', '.tic-btn', function () {
    var matrix  = getArrays($(this), grid);
    var leftIds = getItem('leftIds');

    if (leftIds === null) leftIds = matrix;

    blockHover(leftIds);
});

$(document).on('click', '.tic-btn', function () {
    var gameStatus = getItem('game_status');
    var id         = parseInt($(this).attr('id'), 10);
    var leftIds    = getItem('leftIds');
    var matrix     = getArrays($(this), grid);

    // get allIds
    var allIds = leftIds === null ? matrix : leftIds;

    // add clicked ids to array
    if (allIds.indexOf(id.toString()) !== -1) addToArray(id);

    // get matrix key
    var mKey = getMatrixKey(allIds, id);

    // remove id from array
    leftIds = removeFromArray(allIds, id);

    // remove unneeded blocks
    rules(leftIds, mKey);

    if (mKey === null) {
        // highlight bad clock
        $('#' + id).removeClass('whiteBgAnimated').addClass('redBg');
        setTimeout(function () {
            $('#' + id).removeClass('redBg').addClass('whiteBgAnimated');
        }, 100);
    } else {
        $('#' + id + ' .text').html('X');
    }

    console.log(id);
    console.log(mKey);
    console.log(gameStatus);

    // set new array
    setItem('leftIds', leftIds);
});

// new session
$(document).on('click', '#newSession', function () {
    c.html('');
    removeItem('leftIds');
    removeItem('newIds');

    var grid = createGrid(g, h, w);
    var html = createHtml(g, grid, h, w);

    c.html(html);
});
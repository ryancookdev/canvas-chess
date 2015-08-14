var CHESS = CHESS || {};

CHESS.Math = (function () {

    var changeFile = function (sq, diff) {
        var rank = getRank(sq),
            file = getFile(sq),
            newSquare = fileToChar(file + diff) + rank;
        return (isValidSquare(newSquare) ? newSquare : false);
    };

    var changeRank = function (sq, diff) {
        var rank = getRank(sq),
            file = getFile(sq),
            newSquare = fileToChar(file) + (rank + diff);
        return (isValidSquare(newSquare) ? newSquare : false);
    };

    var compareFile = function (sq1, sq2) {
        return getFile(sq2) - getFile(sq1);
    };

    var compareRank = function (sq1, sq2) {
        return getRank(sq2) - getRank(sq1);
    };

    var fileToChar = function (file) {
        return String.fromCharCode(x + 96);
    };

    var getFile = function (sq) {
        var file = false;
        if (isValidSquare(sq)) {
            file = sq.substr(0, 1).toLowerCase();
            file = file.charCodeAt(0) - 96;
        }
        return file;
    };

    var getRank = function (sq) {
        var rank = false;
        if (isValidSquare(sq)) {
            rank = parseInt(sq.substr(1, 1), 10);
        }
        return rank;
    };

    var isSameFile = function (sq1, sq2) {
        return getFile(sq1) === getFile(sq2);
    };

    var isSameRank = function (sq1, sq2) {
        return getRank(sq1) === getRank(sq2);
    };

    var isBishopMove = function (sq1, sq2) {
        var rank1 = getRank(sq1),
            file1 = getFile(sq1),
            rank2 = getRank(sq2),
            file2 = getFile(sq2);
        return Math.abs(rank1 - rank2) === Math.abs(file1 - file2);
    };

    var isKingMove = function (sq1, sq2) {
        return Math.abs(compareRank(sq1, sq2)) < 2 && Math.abs(compareFile(sq1, sq2)) < 2
    };

    var isKnightMove = function (sq1, sq2) {
        return (Math.abs(compareRank(sq1, sq2)) === 1 && Math.abs(compareFile(sq1, sq2)) === 2) ||
            (Math.abs(compareRank(sq1, sq2)) === 2 && Math.abs(compareFile(sq1, sq2)) === 1);
    };

    var isRookMove = function (sq1, sq2) {
        return isSameRank(sq1, sq2) || isSameFile(sq1, sq2);
    };

    var isQueenMove = function (sq1, sq2) {
        return isRookMove(sq1, sq2) || isBishopMove(sq1, sq2);
    };

    var isValidSquare = function (sq) {
        return /[a-h][1-8]/.test(sq);
    };

    var setFile = function (sq, file) {
        var newSquare = file + getRank(sq);
        return (isValidSquare(newSquare) ? newSquare : false);
    };

    var setRank = function (sq, rank) {
        var newSquare = getFile(sq) + rank;
        return (isValidSquare(newSquare) ? newSquare : false);
    };

    return {
        changeFile: changeFile,
        changeRank: changeRank,
        compareFile: compareFile,
        compareRank: compareRank,
        isBishopMove: isBishopMove,
        isKingMove: isKingMove,
        isKnightMove: isKnightMove,
        isQueenMove: isQueenMove,
        isRookMove: isRookMove,
        isSameFile: isSameFile,
        isSameRank: isSameRank,
        setFile: setFile,
        setRank: setRank,
    };

})();

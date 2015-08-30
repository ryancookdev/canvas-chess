var CHESS = CHESS || {};

CHESS.Position = function ($) {

/**
 * Stores parsed FEN information and provides methods for working with it.
 *
 * @constructor
 * @param {String} fen
 */
return function (fen) {
    var castleWK = false,
        castleWQ = false,
        castleBK = false,
        castleBQ = false,
        colorToMove = '',
        enPassant = '-',
        positionArray = [];

    /**
     * @returns {Boolean}
     */
    this.canBlackCastleKingside = function () {
        return castleBK;
    };

    /**
     * @returns {Boolean}
     */
    this.canBlackCastleQueenside = function () {
        return castleBQ;
    };

    /**
     * @returns {Boolean}
     */
    this.canWhiteCastleKingside = function () {
        return castleWK;
    };

    /**
     * @returns {Boolean}
     */
    this.canWhiteCastleQueenside = function () {
        return castleWQ;
    };

    this.clearEnPassantSquare = function () {
        enPassant = '-';
    };

    /**
     * @param {String} type
     * @param {String} color
     * @returns {String} square
     */
    this.findPiece = function (type, color) {

    };

    /**
     * @returns {String} 
     */
    this.getColorToMove = function () {
        return colorToMove;
    };

    var getEmptyPositionArray = function () {
        return [
            ['-', '-', '-', '-', '-', '-', '-', '-'],
            ['-', '-', '-', '-', '-', '-', '-', '-'],
            ['-', '-', '-', '-', '-', '-', '-', '-'],
            ['-', '-', '-', '-', '-', '-', '-', '-'],
            ['-', '-', '-', '-', '-', '-', '-', '-'],
            ['-', '-', '-', '-', '-', '-', '-', '-'],
            ['-', '-', '-', '-', '-', '-', '-', '-'],
            ['-', '-', '-', '-', '-', '-', '-', '-']
        ];
    };

    /**
     * @returns {String} Letter and number of the square.
     */
    this.getEnPassantSquare = function () {
        return enPassant;
    };

    /**
     * @returns {string}
     */
    this.getFen = function () {
        return [
            dataToFenPosition(),
            colorToMove,
            dataToFenCastling(),
            enPassant,
            '0 1'
        ].join(' ');
    };

    var dataToFenCastling = function () {
        var castling = '';
        if (castleWK) {
            castling += 'K';
        }
        if (castleWQ) {
            castling += 'Q';
        }
        if (castleBK) {
            castling += 'k';
        }
        if (castleBQ) {
            castling += 'q';
        }
        return (castling === '' ? '-' : castling);
    };

    var dataToFenPosition = function () {
        var rowNumber,
            rows = [];

        for (rowNumber = 0; rowNumber < positionArray.length; rowNumber += 1) {
            rows.push(dataToFenPositionRow(rowNumber));
        }

        return rows.join('/');
    };

    var dataToFenPositionRow = function (rowNumber) {
        var columnNumber,
            piece,
            row = '';

        for (columnNumber = 0; columnNumber < positionArray[rowNumber].length; columnNumber += 1) {
            piece = dataToFenPiece(positionArray[rowNumber][columnNumber]);
            row = updateOrAppendToFenPositionRow(row, piece);
        }

        return row;
    };

    var updateOrAppendToFenPositionRow = function (row, piece) {
        var emptySquares = 0;

        if (piece === '') {
            if (row.length > 0) {
                emptySquares = row.slice(-1);
                if (/[1-7]/.test(emptySquares)) {
                    emptySquares = parseInt(emptySquares, 10);
                } else {
                    emptySquares = 0;
                }
                if (emptySquares > 0) {
                    row = row.slice(0, row.length - 1);
                }
            }
            row += (++emptySquares + '');
        } else {
            row += piece;
        }

        return row;
    };

    var dataToFenPiece = function (dataPiece) {
        var color = dataPiece.substr(0, 1),
            fenPiece = dataPiece.substr(1, 1);
        if (color === 'w') {
            fenPiece = fenPiece.toUpperCase();
        }
        return fenPiece;
    };

    var getFenSegmentCastling = function (fen) {
        return fen.split(' ')[2];
    };

    var getFenSegmentColorToMove = function (fen) {
        return fen.split(' ')[1];
    };

    var getFenSegmentEnPassant = function (fen) {
        return fen.split(' ')[3];
    };

    var getFenSegmentPosition = function (fen) {
        return fen.split(' ')[0];
    };

    /**
     * @returns {String} Piece abbreviation.
     */
    this.getPiece = function (y, x) {
        // TODO: Replace y, x params with square
        if (/[a-h][1-8]/.test(y)) {
            var sq = y;
            x = sq.substr(0, 1).toLowerCase();
            y = sq.substr(1, 1);
            x = x.charCodeAt(0) - 97;
            y = 8 - y;
        }

        if (y === false || y < 0 || x < 0 || y >= positionArray.length || x >= positionArray[y].length) {
            return new $.Piece();
        }
        return new $.Piece(positionArray[y][x]);
    };

    /**
     * @returns {Boolean} 
     */
    this.isWhiteToMove = function () {
        return colorToMove === 'w';
    };

    this.rangeContainsPiece = function (piece, color) {

    };

    /**
     * @param {Boolean} canCastle
     */
    this.setBlackCastleKingside = function (canCastle) {
        castleBK = (canCastle === true);
    };

    /**
     * @param {Boolean} canCastle
     */
    this.setBlackCastleQueenside = function (canCastle) {
        castleBQ = (canCastle === true);
    };

    this.setBlackToMove = function () {
        colorToMove = 'b';
    };

    var setData = function (fen) {
        var castling;

        enPassant = getFenSegmentEnPassant(fen);
        colorToMove = getFenSegmentColorToMove(fen);

        castling = getFenSegmentCastling(fen);
        castleWK = (castling.indexOf('K') >= 0);
        castleWQ = (castling.indexOf('Q') >= 0);
        castleBK = (castling.indexOf('k') >= 0);
        castleBQ = (castling.indexOf('q') >= 0);
    };

    /**
     * @param {String} square - Letter and number of the square.
     */
    this.setEnPassantSquare = function (square) {
        if (/[a-h][36]/.test(square)) {
            enPassant = square;
        } else {
            enPassant = '-';
        }
    };

    /**
     * @param {Integer} y
     * @param {Integer} x
     * @param {String} pieceAbbrev - Color [w|b] and type [p|r|n|b|k|q] (with file letter for pawns).
     */
    this.setPiece = function (y, x, pieceAbbrev) {
        // TODO: Replace y, x params with square
        if (/[a-h][1-8]/.test(y)) {
            var sq = y;
            x = sq.substr(0, 1).toLowerCase();
            y = sq.substr(1, 1);
            x = x.charCodeAt(0) - 97;
            y = 8 - y;
        }

        positionArray[y][x] = pieceAbbrev;
    };

    var setPieces = function (fen) {
        var alphaConversion = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
            i = 0,
            j = 0,
            k = 0,
            fewRows = [],
            file,
            rowItem = '',
            startingIndex = 0;

        positionArray = getEmptyPositionArray();

        if (fen === undefined || typeof fen !== 'string' && !(fen instanceof String)) {
            return;
        }

        fenRows = getFenSegmentPosition(fen).split('/');

        for (i = 0; i < fenRows.length; i += 1) {
            for (j = 0; j < fenRows[i].length; j += 1) {
                rowItem = fenRows[i].charAt(j);
                // Get starting index
                for (k = 0; k < positionArray[i].length; k += 1) {
                    if (positionArray[i][k] === '-') {
                        startingIndex = k;
                        k = positionArray[i].length; // break
                    }
                }
                if (/[0-9]/.test(rowItem)) {
                    // Empty square(s)
                    for (k = 0; k < parseInt(rowItem, 10); k += 1) {
                        positionArray[i][k + startingIndex] = '';
                    }
                } else {
                    file = alphaConversion[startingIndex];
                    positionArray[i][startingIndex] = fenToDataPiece(rowItem, file);
                }
            }
        }
    };

    var fenToDataPiece = function (piece, file) {
        var color = 'w'
            file = '';

        if (/[kqrbnp]/.test(piece)) {
            color = 'b';
        }
        piece = piece.toLowerCase();
        if (piece === 'p') {
            // TODO Remove file
            piece += file;
        }

        return color + piece;
    };

    var setPosition = function (fen) {
        if (!validateFen(fen)) {
            return false;
        }
        setData(fen);
        setPieces(fen);
    };

    /**
     * @param {Boolean} canCastle
     */
    this.setWhiteCastleKingside = function (canCastle) {
        castleWK = (canCastle === true);
    };

    /**
     * @param {Boolean} canCastle
     */
    this.setWhiteCastleQueenside = function (canCastle) {
        castleWQ = (canCastle === true);
    };

    this.setWhiteToMove = function () {
        colorToMove = 'w';
    };

    var validateFen = function (fen) {
        return /\s+([wbWB])\s+([-kqKQ]+)\s+([-\w]{1,2})\s+(\d+)\s+(\d+)\s*$/.test(fen);
    };

    setPosition(fen);
};

}(CHESS);

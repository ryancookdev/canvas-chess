var CHESS = CHESS || {};

/**
 * Stores parsed FEN information and provides methods for working with it.
 *
 * @constructor
 * @param {String} fen
 */
CHESS.Position = function (fen) {
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
        var fenArr = [],
            position,
            castling = '',
            rowArray = [],
            color = '',
            piece = '',
            i = 0,
            j = 0,
            emptyRows = 0;

        // Piece placement
        for (i = 0; i < positionArray.length; i += 1) {
            rowArray[i] = '';
            for (j = 0; j < positionArray[i].length; j += 1) {
                piece = positionArray[i][j];
                if (piece === '') {
                    emptyRows += 1;
                } else {
                    // Append number of empty rows
                    if (emptyRows > 0) {
                        rowArray[i] += (emptyRows + '');
                        emptyRows = 0;
                    }
                    // Append piece
                    color = piece.substr(0, 1);
                    piece = piece.substr(1, 1);
                    if (color === 'w') {
                        piece = piece.toUpperCase();
                    }
                    rowArray[i] += piece;
                }
            }
            // Append number of empty rows
            if (emptyRows > 0) {
                rowArray[i] += (emptyRows + '');
                emptyRows = 0;
            }
        }
        position = rowArray.join('/');
        fenArr.push(position);

        // Active color
        fenArr.push(colorToMove);

        // Castling
        castling = '';
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
        if (castling === '') {
            castling = '-';
        }

        fenArr.push(castling);
        fenArr.push(enPassant);
        fenArr.push('0 1');

        return fenArr.join(' ');
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
            return new CHESS.Piece();
        }
        return new CHESS.Piece(positionArray[y][x]);
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
            color = '',
            file = '',
            piece = '',
            rowArray = [],
            rowItem = '',
            startingIndex = 0,
            i = 0,
            j = 0,
            k = 0;

        if (typeof fen !== 'string' && !(fen instanceof String)) {
            return;
        }

        positionArray = getEmptyPositionArray();

        if (fen === undefined) {
            return;
        }

        rowArray = getFenSegmentPosition(fen).split('/');

        for (i = 0; i < rowArray.length; i += 1) {
            for (j = 0; j < rowArray[i].length; j += 1) {
                rowItem = rowArray[i].charAt(j);
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
                    // Uppercase = white, lowercase = black
                    color = 'w';
                    if (/[a-z]/.test(rowItem)) {
                        color = 'b';
                    }
                    piece = rowItem.toLowerCase();
                    file = '';
                    if (piece === 'p') {
                        file = alphaConversion[startingIndex];
                    }
                    positionArray[i][startingIndex] = color + piece + file;
                }
            }
        }
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

var CHESS = CHESS || {};

/**
 * Util
 */
CHESS.util = function ($) {

    $.util = {};

    $.util.getLongNotation = function (position, short_notation) {
        var i,
            j,
            long_move = '',
            sq1,
            sq2 = short_notation.replace(/[#+=xKQRBN]/g, ''),
            colorToMove = (position.isWhiteToMove() ? 'w' : 'b'),
            piece = short_notation.substring(0, 1),
            sq1_info = '',
            sq1_info_type = '';
        // Check for castling first
        if (short_notation === 'O-O') {
            if (position.isWhiteToMove()) {
                return 'e1-g1';
            } else {
                return 'e8-g8';
            }
        } else if (short_notation === 'O-O-O') {
            if (position.isWhiteToMove()) {
                return 'e1-c1';
            } else {
                return 'e8-c8';
            }
        }
        // Get sq1 letter or number if included
        if (sq2.length === 3) {
            sq1_info = sq2.substr(0, 1);
            sq2 = sq2.substr(sq2.length - 2, 2);
            if (/[0-9]/.test(sq1_info)) {
                sq1_info_type = 'rank';
            } else if (/[a-z]/.test(sq1_info)) {
                sq1_info = sq1_info.charCodeAt(0) - 97;
                sq1_info_type = 'file';
            }
        }
        if (piece !== 'K' && piece !== 'Q' && piece !== 'W' && piece !== 'R' && piece !== 'B' && piece !== 'N') {
            piece = 'p';
        }
        piece = piece.toLowerCase();
        for (i = 0; i < 8; i++) {
            for (j = 0; j < 8; j++) {
                // Use sq1 info if it was included
                if (sq1_info_type === 'rank' && parseInt(sq1_info, 10) !== (8 - i)) {
                    continue;
                } else if (sq1_info_type === 'file' && parseInt(sq1_info, 10) !== j) {
                    continue;
                }
                // Locate a potential piece
                if (position.getPiece(i, j).toString() === colorToMove + piece) {
                    sq1 = this.reverseArrayPosition(i + '' + j);
                    var startSquare = new $.Square(sq1);
                    var endSquare = new $.Square(sq2);
                    var move = new $.Move(startSquare, endSquare);
                    if ($.Engine.isLegal(position, move)) {
                        long_move = sq1 + '-' + sq2;
                    }
                }
            }
        }
        return long_move;
    };

    $.util.reverseArrayPosition = function (xy) {
        var x = parseInt(xy.substr(1, 1), 10),
            y = parseInt(xy.substr(0, 1), 10);
        x = String.fromCharCode(x + 97);
        y = 8 - y;
        return x + '' + y;
    };

    return $.util;

}(CHESS);

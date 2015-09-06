var CHESS = CHESS || {};

/**
 * Engine
 */
CHESS.util = function ($) {

$.util = {};

$.util.isStalemate = function (position) {
    var is_stalemate = !this.getLegalMoves(position, true);
    return is_stalemate;
};

$.util.getLegalMoves = function (position, return_bool) {
    var i,
        j,
        sq1,
        sq2,
        move = '',
        move_list = [],
        dir,
        sq = 0,
        en_passant_x,
        piece;

    for (i = 0; i < 8; i++) {
        for (j = 0; j < 8; j++) {
            piece = position.getPiece(i, j);
            if (!piece.isColor(position.getColorToMove())) {
                continue;
            }

            sq1 = this.reverseArrayPosition (i + '' + j);
            if (piece.isKing()) {
                // N
                if (i > 0) {
                    sq2 = this.reverseArrayPosition((i - 1) + '' + j);
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                }
                // NE
                if (i > 0 && j < 7) {
                    sq2 = this.reverseArrayPosition((i - 1) + '' + (j + 1));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                }
                // E
                if (j < 7) {
                    sq2 = this.reverseArrayPosition(i + '' + (j + 1));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                }
                // SE
                if (i < 7 && j < 7) {
                    sq2 = this.reverseArrayPosition((i + 1) + '' + (j + 1));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                }
                // S
                if (i < 7) {
                    sq2 = this.reverseArrayPosition((i + 1) + '' + j);
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                }
                // SW
                if (i < 7 && j > 0) {
                    sq2 = this.reverseArrayPosition((i + 1) + '' + (j - 1));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                }
                // W
                if (j > 0) {
                    sq2 = this.reverseArrayPosition(i + '' + (j - 1));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                }
                // NW
                if (i > 0 && j > 0) {
                    sq2 = this.reverseArrayPosition((i - 1) + '' + (j - 1));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                }
                // Castling
                // Do not need to implement right now, since this is only called to check
                // for stalement. If the king can castle, he can also move one square.
            }

            if (piece.isPawn()) {
                dir = (position.isWhiteToMove() ? -1 : 1);
                // One square
                sq2 = this.reverseArrayPosition((i + dir) + '' + j);
                move = sq1 + '-' + sq2;
                move_list.push(move);
                // Two squares
                if ((position.isWhiteToMove() && i === 6) || (position.isBlackToMove() && i === 1)) {
                    sq2 = this.reverseArrayPosition((i + (dir * 2)) + '' + j);
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                }
                // Capture
                // ...
                // En Passant
                if (/^[a-h][1-8]$/.test(position.getEnPassantSquare().getName())) {
                    en_passant_x = parseInt(this.getArrayPosition(position.getEnPassantSquare().getName()).substr(0, 1), 10);
                }
                if (position.isWhiteToMove() && i === 3) {
                    if (en_passant_x === (j - 1)) {
                        sq2 = this.reverseArrayPosition((i - 1) + '' + (j - 1));
                        move = sq1 + '-' + sq2;
                        move_list.push(move);
                    }
                    if (en_passant_x === (j + 1)) {
                        sq2 = this.reverseArrayPosition((i - 1) + '' + (j + 1));
                        move = sq1 + '-' + sq2;
                        move_list.push(move);
                    }
                }
                if (position.isBlackToMove() && i === 4) {
                    if (en_passant_x === (j - 1)) {
                        sq2 = this.reverseArrayPosition((i + 1) + '' + (j - 1));
                        move = sq1 + '-' + sq2;
                        move_list.push(move);
                    }
                    if (en_passant_x === (j + 1)) {
                        sq2 = this.reverseArrayPosition((i + 1) + '' + (j + 1));
                        move = sq1 + '-' + sq2;
                        move_list.push(move);
                    }
                }
            }

            if (piece.isQueen()) {
                // N
                sq = 1;
                while (i - sq >= 0) {
                    sq2 = this.reverseArrayPosition((i - sq) + '' + j);
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                    sq++;
                }
                // NE
                sq = 1;
                while (i - sq >= 0 && j + sq <= 7) {
                    sq2 = this.reverseArrayPosition((i - sq) + '' + (j + sq));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                    sq++;
                }
                // E
                sq = 1;
                while (j + sq <= 7) {
                    sq2 = this.reverseArrayPosition(i + '' + (j + sq));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                    sq++;
                }
                // SE
                sq = 1;
                while (j + sq <= 7 && i + sq <= 7) {
                    sq2 = this.reverseArrayPosition((i + sq) + '' + (j + sq));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                    sq++;
                }
                // S
                sq = 1;
                while (i + sq <= 7) {
                    sq2 = this.reverseArrayPosition((i + sq) + '' + j);
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                    sq++;
                }
                // SW
                sq = 1;
                while (i + sq <= 7 && j - sq >= 0) {
                    sq2 = this.reverseArrayPosition((i + sq) + '' + (j - sq));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                    sq++;
                }
                // W
                sq = 1;
                while (j - sq >= 0) {
                    sq2 = this.reverseArrayPosition(i + '' + (j - sq));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                    sq++;
                }
                // NW
                sq = 1;
                while (j - sq >= 0 && i - sq >= 0) {
                    sq2 = this.reverseArrayPosition((i - sq) + '' + (j - sq));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                    sq++;
                }
            }

            if (piece.isRook()) {
                // N
                sq = 1;
                while (i - sq >= 0) {
                    sq2 = this.reverseArrayPosition((i - sq) + '' + j);
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                    sq++;
                }
                // E
                sq = 1;
                while (j + sq <= 7) {
                    sq2 = this.reverseArrayPosition(i + '' + (j + sq));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                    sq++;
                }
                // S
                sq = 1;
                while (i + sq <= 7) {
                    sq2 = this.reverseArrayPosition((i + sq) + '' + j);
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                    sq++;
                }
                // W
                sq = 1;
                while (j - sq >= 0) {
                    sq2 = this.reverseArrayPosition(i + '' + (j - sq));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                    sq++;
                }
            }

            if (piece.isBishop()) {
                var fromSquare = new $.Square(sq1);
                var bishopMoves = $.Engine.getBishopPotentialMoves(position, fromSquare);
                move_list.push.apply(move_list, bishopMoves);
            }

            if (piece.isKnight()) {
                // NNE
                if (i >= 2 && j <= 6) {
                    sq2 = this.reverseArrayPosition((i - 2) + '' + (j + 1));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                }
                // NEE
                if (i >= 1 && j <= 5) {
                    sq2 = this.reverseArrayPosition((i - 1) + '' + (j + 2));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                }
                // SEE
                if (i <= 6 && j <= 5) {
                    sq2 = this.reverseArrayPosition((i + 1) + '' + (j + 2));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                }
                // SSE
                if (i <= 5 && j <= 6) {
                    sq2 = this.reverseArrayPosition((i + 2) + '' + (j + 1));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                }
                // SSW
                if (i <= 5 && j >= 1) {
                    sq2 = this.reverseArrayPosition((i + 2) + '' + (j - 1));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                }
                // SWW
                if (i <= 6 && j >= 2) {
                    sq2 = this.reverseArrayPosition((i + 1) + '' + (j - 2));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                }
                // NWW
                if (i >= 1 && j >= 2) {
                    sq2 = this.reverseArrayPosition((i - 1) + '' + (j - 2));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                }
                // NNW
                if (i >= 2 && j >= 1) {
                    sq2 = this.reverseArrayPosition((i - 2) + '' + (j - 1));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                }
            }
        }
    }
    for (i = 0; i < move_list.length; i++) {
        sq1 = move_list[i].split('-')[0];
        sq2 = move_list[i].split('-')[1];
        var startSquare = new $.Square(sq1);
        var endSquare = new $.Square(sq2);
        var move = new $.Move(startSquare, endSquare);
        if (!$.Engine.isLegal(position, move)) {
            move_list.splice(i, 1);
            i--;
        } else if (return_bool) {
            // Stop as soon as one legal move is found
            // and report that legal moves do exist
            return true;
        }
    }
    if (return_bool) {
        // There are no legal moves
        return false;
    }

    // Here are the legal moves
    return move_list;
};

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

$.util.getArrayPosition = function (sq) {
    var x,
        y,
        xy = false;

    if (/^[a-h][1-8]$/.test(sq)) {
        x = sq.substr(0, 1).toLowerCase();
        y = sq.substr(1, 1);
        x = x.charCodeAt(0) - 97;
        y = 8 - y;
        xy = x + '' + y;
    }
    return xy;
};

$.util.reverseArrayPosition = function (xy) {
    var x = parseInt(xy.substr(1, 1), 10),
        y = parseInt(xy.substr(0, 1), 10);
    x = String.fromCharCode(x + 97);
    y = 8 - y;
    return x + '' + y;
};

$.util.moveTemp = function (position, sq1, sq2) {
    this.move(position, sq1, sq2);
};

$.util.move = function (position, sq1, sq2, promotion) {
    var w_sq1,
        w_sq2,
        w_xy1,
        w_xy2,
        w_x1,
        w_y1,
        w_x2,
        w_y2,
        b_sq1,
        b_sq2,
        b_xy1,
        b_xy2,
        b_x1,
        b_y1,
        b_x2,
        b_y2,
        pawn_sq,
        captured_piece = '',
        piece;

    var startSquare = new $.Square(sq1);
    var endSquare = new $.Square(sq2);
    var move = new $.Move(startSquare, endSquare);
    if (!$.Engine.isLegal(position, move)) {
        return false;
    }

    if (promotion !== undefined) {
        promotion = promotion.toLowerCase();
    }

    // Update game values
    position.last_move = {'sq1':this.getArrayPosition(sq1), 'sq2':this.getArrayPosition(sq2)};

    if (position.isWhiteToMove()) {
        w_sq1 = sq1;
        w_sq2 = sq2;
        w_xy1 = this.getArrayPosition(w_sq1);
        w_xy2 = this.getArrayPosition(w_sq2);
        w_x1 = parseInt(w_xy1.substr(0, 1), 10);
        w_y1 = parseInt(w_xy1.substr(1, 1), 10);
        w_x2 = parseInt(w_xy2.substr(0, 1), 10);
        w_y2 = parseInt(w_xy2.substr(1, 1), 10);
        captured_piece = position.getPiece(w_y2, w_x2);
        piece = position.getPiece(w_y1, w_x1);
        position.setPiece(w_y2, w_x2, piece.toString());
        position.setPiece(w_y1, w_x1, '');
        // Pawn is eligible to be captured en passant
        w_xy1 = this.getArrayPosition(w_sq1);
        if (piece.isWhite() && piece.isPawn() && w_y2 - w_y1 === -2) {
            position.setEnPassantSquare(new $.Square(this.reverseArrayPosition((w_y2 + 1) + '' + w_x2)));
        } else {
            position.setEnPassantSquare();
        }
        // En passant
        if (piece.isWhite() && piece.isPawn() && w_x2 !== w_x1 && captured_piece.isNull()) {
            position.setPiece(w_y1, w_x2, '');
            pawn_sq = w_sq2.substr(0, 1) + w_sq1.substr(1, 1);
        }
        // Pawn promotion
        if (piece.isWhite() && piece.isPawn() && w_y2 === 0) {
            if (promotion === 'r') {
                position.setPiece(w_y2, w_x2, 'wq');
            } else if (promotion === 'b') {
                position.setPiece(w_y2, w_x2, 'wb');
            } else if (promotion === 'n') {
                position.setPiece(w_y2, w_x2, 'wn');
            } else {
                position.setPiece(w_y2, w_x2, 'wq');
            }
        }
        // Castling
        if (piece.isWhite() && piece.isKing() && w_sq1 === 'e1') {
            if (w_sq2 === 'g1') {
                position.setPiece(7, 5, 'wrk');
                position.setPiece(7, 7, '');
            } else if (w_sq2 === 'c1') {
                position.setPiece(7, 3, 'wrq');
                position.setPiece(7, 0, '');
            }
        }
        // Lose castling ability
        if (piece.isWhite() && piece.isKing()) {
            position.setWhiteCastleKingside(false);
            position.setWhiteCastleQueenside(false);
        } else if (piece.isWhite() && piece.isRook() && w_sq1 === 'h1') {
            position.setWhiteCastleKingside(false);
        } else if (piece.isWhite() && piece.isRook() && w_sq1 === 'a1') {
            position.setWhiteCastleQueenside(false);
        } else if (captured_piece.isBlack() && captured_piece.isRook() && w_sq2 === 'a8') {
            position.setBlackCastleQueenside(false);
        } else if (captured_piece.isBlack() && captured_piece.isRook() && w_sq2 === 'h8') {
            position.setBlackCastleKingside(false);
        }
        position.setBlackToMove();
    } else {
        // Black's turn
        b_sq1 = sq1;
        b_sq2 = sq2;
        b_xy1 = this.getArrayPosition(b_sq1);
        b_xy2 = this.getArrayPosition(b_sq2);
        b_x1 = parseInt(b_xy1.substr(0, 1), 10);
        b_y1 = parseInt(b_xy1.substr(1, 1), 10);
        b_x2 = parseInt(b_xy2.substr(0, 1), 10);
        b_y2 = parseInt(b_xy2.substr(1, 1), 10);
        captured_piece = position.getPiece(b_y2, b_x2);
        piece = position.getPiece(b_y1, b_x1);
        position.setPiece(b_y2, b_x2, position.getPiece(b_y1, b_x1).toString());
        position.setPiece(b_y1, b_x1, '');
        // Pawn is eligible to be captured en passant
        b_xy1 = this.getArrayPosition(b_sq1);
        if (piece.isBlack() && piece.isPawn() && b_y2 - b_y1 === 2) {
            position.setEnPassantSquare(new $.Square(this.reverseArrayPosition((b_y2 - 1) + '' + b_x2)));
        } else {
            position.setEnPassantSquare();
        }
        // En passant
        if (piece.isBlack() && piece.isPawn() && b_x2 !== b_x1 && captured_piece.isNull()) {
            position.setPiece(b_y1, b_x2, '');
            pawn_sq = b_sq2.substr(0, 1) + b_sq1.substr(1, 1);
        }
        // Pawn promotion
        if (piece.isBlack() && piece.isPawn() && b_y2 === 7) {
            if (promotion === 'r') {
                position.setPiece(b_y2, b_x2, 'bq');
            } else if (promotion === 'b') {
                position.setPiece(b_y2, b_x2, 'bb');
            } else if (promotion === 'n') {
                position.setPiece(b_y2, b_x2, 'bn');
            } else {
                position.setPiece(b_y2, b_x2, 'bq');
            }
        }
        // Castling
        if (piece.isBlack() && piece.isKing() && b_sq1 === 'e8') {
            if (b_sq2 === 'g8') {
                position.setPiece(0, 5, 'brk');
                position.setPiece(0, 7, '');
            } else if (b_sq2 === 'c8') {
                position.setPiece(0, 3, 'brq');
                position.setPiece(0, 0, '');
            }
        }
        // Lose castling ability
        if (piece.isBlack() && piece.isKing()) {
            position.setBlackCastleKingside(false);
            position.setBlackCastleQueenside(false);
        } else if (piece.isBlack() && piece.isRook() && b_sq1 === 'h8') {
            position.setBlackCastleKingside(false);
        } else if (piece.isBlack() && piece.isRook() && b_sq1 === 'a8') {
            position.setBlackCastleQueenside(false);
        } else if (captured_piece.isWhite() && captured_piece.isRook() && b_sq2 === 'a1') {
            position.setWhiteCastleQueenside(false);
        } else if (captured_piece.isWhite() && captured_piece.isRook() && b_sq2 === 'h1') {
            position.setWhiteCastleKingside(false);
        }
        position.setWhiteToMove();
    }

    if (this.gameIsOver(position)) {
        position.active = false;
    }

    return true;
};

$.util.gameIsOver = function (position) {
    return $.Engine.isMate(position) || this.isStalemate(position);
};

return $.util;

}(CHESS);

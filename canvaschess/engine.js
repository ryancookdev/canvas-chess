// Global namespace
var CHESS = CHESS || {};

CHESS.engine = {};

CHESS.engine.createPosition = function (fen) {
    var position = function () {
        var mode = '',
            position_array = [],
            piecebox_array = [],
            last_move = {},
            en_passant = '',
            white_to_move = true,
            gs_castle_kside_w = true,
            gs_castle_qside_w = true,
            gs_castle_kside_b = true,
            gs_castle_qside_b = true,
            active = false,
            moves = 0;
    };

    var pos = function () {};
    pos.prototype = position;

    // Create an instance
    var pos_instance = new pos();

    // Set the position
    if (fen !== undefined) {
        this.setPosition(pos_instance, fen);
    }

    return pos_instance;
};

CHESS.engine.setPosition = function (pos, fen) {
    var fen_arr,
        position,
        castling,
        row_array = [],
        row_item = '',
        starting_index = 0,
        color = '',
        piece = '',
        file = '',
        alpha_conversion = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
        i = 0,
        j = 0,
        k = 0;

    // Prepare FEN values
    fen_arr = fen.split(' ');
    position = fen_arr[0];
    castling = fen_arr[2];

    row_array = position.split('/');

    // Set the model
    pos.en_passant = fen_arr[3];
    pos.white_to_move = (fen_arr[1] === 'w');
    if (castling === '-') {
        pos.gs_castle_kside_w = false;
        pos.gs_castle_qside_w = false;
        pos.gs_castle_kside_b = false;
        pos.gs_castle_qside_b = false;
    } else {
        if (castling.indexOf('K') >= 0) {
            pos.gs_castle_kside_w = true;
        }
        if (castling.indexOf('Q') >= 0) {
            pos.gs_castle_qside_w = true;
        }
        if (castling.indexOf('k') >= 0) {
            pos.gs_castle_kside_b = true;
        }
        if (castling.indexOf('q') >= 0) {
            pos.gs_castle_qside_b = true;
        }
    }
    pos.position_array = [['-', '-', '-', '-', '-', '-', '-', '-'], ['-', '-', '-', '-', '-', '-', '-', '-'], ['-', '-', '-', '-', '-', '-', '-', '-'], ['-', '-', '-', '-', '-', '-', '-', '-'], ['-', '-', '-', '-', '-', '-', '-', '-'], ['-', '-', '-', '-', '-', '-', '-', '-'], ['-', '-', '-', '-', '-', '-', '-', '-'], ['-', '-', '-', '-', '-', '-', '-', '-']];
    pos.piecebox_array = [['-', 'wk', 'wq', 'wr', 'wb', 'wn', 'wp', '-'], ['-', 'bk', 'bq', 'br', 'bb', 'bn', 'bp', '-']];
    pos.moves = 0;
    pos.last_move = {};

    for (i = 0; i < row_array.length; i += 1) {
        for (j = 0; j < row_array[i].length; j += 1) {
            row_item = row_array[i].charAt(j);
            // Get starting index
            for (k = 0; k < pos.position_array[i].length; k += 1) {
                if (pos.position_array[i][k] === '-') {
                    starting_index = k;
                    k = pos.position_array[i].length; // break
                }
            }
            if (/[0-9]/.test(row_item)) {
                // Empty square(s)
                for (k = 0; k < parseInt(row_item, 10); k += 1) {
                    pos.position_array[i][k + starting_index] = '';
                }
            } else {
                // Uppercase = white, lowercase = black
                color = 'w';
                if (/[a-z]/.test(row_item)) {
                    color = 'b';
                }
                piece = row_item.toLowerCase();
                file = '';
                if (piece === 'p') {
                    file = alpha_conversion[starting_index];
                }
                pos.position_array[i][starting_index] = color + piece + file;
            }
        }
    }
};

CHESS.engine.getFEN = function (pos) {
    var fen_arr = [],
        position,
        castling = '',
        en_passant = '',
        row_array = [],
        color = '',
        piece = '',
        i = 0,
        j = 0,
        empty_rows = 0;

    // Piece placement
    for (i = 0; i < pos.position_array.length; i += 1) {
        row_array[i] = '';
        for (j = 0; j < pos.position_array[i].length; j += 1) {
            piece = pos.position_array[i][j];
            if (piece === '') {
                empty_rows += 1;
            } else {
                // Append number of empty rows
                if (empty_rows > 0) {
                    row_array[i] += (empty_rows + '');
                    empty_rows = 0;
                }
                // Append piece
                color = piece.substr(0, 1);
                piece = piece.substr(1, 1);
                if (color === 'w') {
                    piece = piece.toUpperCase();
                }
                row_array[i] += piece;
            }
        }
        // Append number of empty rows
        if (empty_rows > 0) {
            row_array[i] += (empty_rows + '');
            empty_rows = 0;
        }
    }
    position = row_array.join('/');
    fen_arr.push(position);

    // Active color
    fen_arr.push(pos.white_to_move ? 'w' : 'b');

    // Castling
    castling = '-';
    if (pos.gs_castle_kside_w || pos.gs_castle_qside_w || pos.gs_castle_kside_b || pos.gs_castle_qside_b) {
        if (pos.gs_castle_kside_w) {
            castling += 'K';
        }
        if (pos.gs_castle_qside_w) {
            castling += 'Q';
        }
        if (pos.gs_castle_kside_b) {
            castling += 'k';
        }
        if (pos.gs_castle_qside_b) {
            castling += 'q';
        }
    }
    fen_arr.push(castling);

    // En passant
    en_passant = (pos.en_passant === '' ? '-' : pos.en_passant);
    fen_arr.push(en_passant);

    // Remainder
    fen_arr.push('0 1');

    // Combine
    return fen_arr.join(' ');
};

CHESS.engine.isLegal = function (pos, sq1, sq2) {
    var i,
        xy1,
        xy2,
        x1,
        y1,
        x2,
        y2,
        sq1Val,
        sq2Val,
        pieceType,
        pieceColor,
        is_en_passant,
        is_capturing_enemy,
        xDif,
        yDif,
        xInc,
        yInc,
        temp_position_array;

    xy1 = this.getArrayPosition(sq1);
    xy2 = this.getArrayPosition(sq2);
    
    if (!xy1 || !xy2) {
        return false;
    }
    
    x1 = parseInt(xy1.substr(0, 1));
    y1 = parseInt(xy1.substr(1, 1));
    x2 = parseInt(xy2.substr(0, 1));
    y2 = parseInt(xy2.substr(1, 1));
    sq1Val = pos.position_array[y1][x1];
    sq2Val = pos.position_array[y2][x2];
    pieceType = sq1Val.substr(1, 1);
    pieceColor = sq1Val.substr(0, 1);
    is_en_passant = false;

    // Turn logic
    if ((pos.white_to_move && pieceColor === 'b') || (!pos.white_to_move && pieceColor === 'w')) {
        return false;
    }

    // two pieces cannot occupy the same square
    if (sq2Val.substr(0, 1) === sq1Val.substr(0, 1)) {
        return false;
    }

    // PAWNS
    if (pieceType === 'p') {
        // pawns must move forward
        if (y1 === y2) {
            return false;
        }
        // pawns cannot move backward
        if ((pieceColor === 'w' && y2 > y1) || (pieceColor === 'b' && y2 < y1)) {
            return false;
        }
        // pawns move 1 square (or 2 on first move)
        if (!(Math.abs(y1 - y2) === 1 || (Math.abs(y1 - y2) === 2 && ((pieceColor === 'w' && y1 === 6 && pos.position_array[5][x1] === '') || (pieceColor === 'b' && y1 === 1 && pos.position_array[2][x1] === ''))))) {
            return false;
        }
        // pawns cannot capture directly forward
        if (Math.abs(x1 - x2) === 0 && pos.position_array[y2][x2] !== '') {
            return false;
        }
        // pawns cannot move horizontally unless capturing 1 square on a forward-diagonal
        if (Math.abs(x1 - x2) > 0) {
            // if side to side movement, only the following situations are valid
            is_capturing_enemy = (sq2Val.substr(0, 1) !== '' && sq2Val.substr(0, 1) !== pieceColor);
            is_en_passant = pos.en_passant === this.reverseArrayPosition(y2 + '' + x2);
            if (!(Math.abs(x1 - x2) === 1 && Math.abs(y1 - y2) === 1 && (is_capturing_enemy || is_en_passant))) {
                return false;
            }
        }
    }

    // KING
    if (pieceType === 'k') {
        // castling
        if (Math.abs(x1 - x2) === 2) {
            if (pieceColor === 'w') {
                if (sq2 === 'g1' && pos.gs_castle_kside_w && pos.position_array[7][5] === '' && pos.position_array[7][6] === '') {
                    // castle kingside
                    // check for checks
                    if (this.isSquareAttacked(pos.position_array, 4, 7, 'w')) {
                        return false;
                    }
                    if (this.isSquareAttacked(pos.position_array, 5, 7, 'w')) {
                        return false;
                    }
                    if (this.isSquareAttacked(pos.position_array, 6, 7, 'w')) {
                        return false;
                    }
                } else if (sq2 === 'c1' && pos.gs_castle_qside_w && pos.position_array[7][1] === '' && pos.position_array[7][2] === '' && pos.position_array[7][3] === '') {
                    // castle queenside
                    // check for checks
                    if (this.isSquareAttacked(pos.position_array, 2, 7, 'w')) {
                        return false;
                    }
                    if (this.isSquareAttacked(pos.position_array, 3, 7, 'w')) {
                        return false;
                    }
                    if (this.isSquareAttacked(pos.position_array, 4, 7, 'w')) {
                        return false;
                    }
                } else {
                    return false;
                }
            } else if (pieceColor === 'b') {
                if (sq2 === 'g8' && pos.gs_castle_kside_b && pos.position_array[0][5] === '' && pos.position_array[0][6] === '') {
                    // castle kingside
                    // check for checks
                    if (this.isSquareAttacked(pos.position_array, 4, 0, 'b')) {
                        return false;
                    }
                    if (this.isSquareAttacked(pos.position_array, 5, 0, 'b')) {
                        return false;
                    }
                    if (this.isSquareAttacked(pos.position_array, 6, 0, 'b')) {
                        return false;
                    }
                } else if (sq2 === 'c8' && pos.gs_castle_qside_b && pos.position_array[0][1] === '' && pos.position_array[0][2] === '' && pos.position_array[0][3] === '') {
                    // castle queenside
                    // check for checks
                    if (this.isSquareAttacked(pos.position_array, 2, 0, 'b')) {
                        return false;
                    }
                    if (this.isSquareAttacked(pos.position_array, 3, 0, 'b')) {
                        return false;
                    }
                    if (this.isSquareAttacked(pos.position_array, 4, 0, 'b')) {
                        return false;
                    }
                } else {
                    return false;
                }
            }
        } else if (!(Math.abs(x1 - x2) < 2 && Math.abs(y1 - y2) < 2)) {
            return false;
        }
    }

    // KNIGHTS
    if (pieceType === 'n' && !((Math.abs(x1 - x2) === 1 && Math.abs(y1 - y2) === 2) || (Math.abs(x1 - x2) === 2 && Math.abs(y1 - y2) === 1))) {
        return false;
    }

    // ROOKS
    if (pieceType === 'r') {
        // rooks move in straight lines
        if (x1 !== x2 && y1 !== y2) {
            return false;
        }
    }

    // BISHOPS
    if (pieceType === 'b') {
        // bishops move in along diagonals
        if (Math.abs(x1 - x2) !== Math.abs(y1 - y2)) {
            return false;
        }
    }

    // QUEEN
    if (pieceType === 'q') {
        // bishops move in along diagonals
        if ((Math.abs(x1 - x2) !== Math.abs(y1 - y2)) && (x1 !== x2 && y1 !== y2)) {
            return false;
        }
    }

    // Queen, Bishops, and Rooks cannot jump pieces
    if (pieceType === 'q' || pieceType === 'b' || pieceType === 'r') {
        i = 0;
        xDif = x1 - x2;
        yDif = y1 - y2;
        xInc = 0;
        yInc = 0;

        if (xDif < 0) {
            xInc = 1;
        } else if (xDif > 0) {
            xInc = -1;
        }
        if (yDif < 0) {
            yInc = 1;
        } else if (yDif > 0) {
            yInc = -1;
        }
        i = 1;
        while (!(parseInt(x1) + i * xInc === x2 && parseInt(y1) + i * yInc === y2)) {
            if (i > 8) {
                break;
            }
            if (pos.position_array[parseInt(y1) + i * yInc][parseInt(x1) + i * xInc] !== '') {
                return false;
            }
            i += 1;
        }
    }

    // KING IN CHECK
    temp_position_array = this.clonePositionArray(pos.position_array);
    temp_position_array[xy2.substr(1, 1)][xy2.substr(0, 1)] = temp_position_array[xy1.substr(1, 1)][xy1.substr(0, 1)];
    temp_position_array[xy1.substr(1, 1)][xy1.substr(0, 1)] = '';
    if (is_en_passant) {
        temp_position_array[xy1.substr(1, 1)][xy2.substr(0, 1)] = '';
    }
    if (this.isCheck(temp_position_array, pieceColor)) {
        return false;
    }
    return true;
};

CHESS.engine.isCheck = function (temp_position_array, pieceColor) {
    // Find the king
    var i,
    j,
    kingX = 0,
    kingY = 0;

    for (i = 0; i < 8; i++) {
        for (j = 0; j < 8; j++) {
            if (temp_position_array[i][j] === pieceColor + 'k') {
                kingX = j;
                kingY = i;
            }
        }
    }
    if (this.isSquareAttacked(temp_position_array, kingX, kingY, pieceColor)) {
        return true;
    }
    return false;
};

CHESS.engine.isMate = function (pos) {
    var i,
        j,
        color = (pos.white_to_move ? 'w' : 'b'),
        kingX = 0,
        kingY = 0,
        attacker_sq,
        attack_x,
        attack_y,
        friendly_attacker_sq,
        position_array = this.clonePositionArray(pos.position_array);

    // Find king
    for (i = 0; i < 8; i++) {
        for (j = 0; j < 8; j++) {
            if (position_array[i][j] === color + 'k') {
                kingX = j;
                kingY = i;
            }
        }
    }
    attacker_sq = this.getAttacker(position_array, kingX, kingY, color);
    if (attacker_sq === '') {
        return false;
    }
    // Remove king from its current position
    position_array[kingY][kingX] = '';
    // Move up
    if (kingY > 0) {
        // Does it contain a friendly piece?
        if (position_array[kingY - 1][kingX].substr(0, 1) !== color) {
            if (!this.isSquareAttacked(position_array, kingX, kingY - 1, color)) {
                return false;
            }
        }
    }
    // Move down
    if (kingY < 7) {
        // Does it contain a friendly piece?
        if (position_array[kingY + 1][kingX].substr(0, 1) !== color) {
            if (!this.isSquareAttacked(position_array, kingX, kingY + 1, color)) {
                return false;
            }
        }
    }
    // Move left
    if (kingX > 0) {
        // Does it contain a friendly piece?
        if (position_array[kingY][kingX - 1].substr(0, 1) !== color) {
            if (!this.isSquareAttacked(position_array, kingX - 1, kingY, color)) {
                return false;
            }
        }
    }
    // Move right
    if (kingX < 7) {
        // Does it contain a friendly piece?
        if (position_array[kingY][kingX + 1].substr(0, 1) !== color) {
            if (!this.isSquareAttacked(position_array, kingX + 1, kingY, color)) {
                return false;
            }
        }
    }
    // Move up/left
    if (kingX > 0 && kingY > 0) {
        // Does it contain a friendly piece?
        if (position_array[kingY - 1][kingX - 1].substr(0, 1) !== color) {
            if (!this.isSquareAttacked(position_array, kingX - 1, kingY - 1, color)) {
                return false;
            }
        }
    }
    // Move up/right
    if (kingX < 7 && kingY > 0) {
        // Does it contain a friendly piece?
        if (position_array[kingY - 1][kingX + 1].substr(0, 1) !== color) {
            if (!this.isSquareAttacked(position_array, kingX + 1, kingY - 1, color)) {
                return false;
            }
        }
    }
    // Move down/left
    if (kingX > 0 && kingY < 7) {
        // Does it contain a friendly piece?
        if (position_array[kingY + 1][kingX - 1].substr(0, 1) !== color) {
            if (!this.isSquareAttacked(position_array, kingX - 1, kingY + 1, color)) {
                return false;
            }
        }
    }
    // Move down/right
    if (kingX < 7 && kingY < 7) {
        // Does it contain a friendly piece?
        if (position_array[kingY + 1][kingX + 1].substr(0, 1) !== color) {
            if (!this.isSquareAttacked(position_array, kingX + 1, kingY + 1, color)) {
                return false;
            }
        }
    }
    // Put king back since it cannot move
    position_array[kingY][kingX] = color + 'k';

    // Is the attacking piece under attack?
    attack_x = parseInt(attacker_sq.substr(1, 1));
    attack_y = parseInt(attacker_sq.substr(0, 1));
    var opposite_color = 'b';
    if (color === 'b') {
        opposite_color = 'w';
    }
    friendly_attacker_sq = this.getAttacker(position_array, attack_y, attack_x, opposite_color);
    if (friendly_attacker_sq !== '') {
        // Can the attacking piece be captured?
        var sq1 = this.reverseArrayPosition(friendly_attacker_sq);
        var sq2 = this.reverseArrayPosition(attacker_sq);
        if (this.isLegal(pos, sq1, sq2)) {
            return false;
        }
    }

    // Can the check be blocked?
    var attacker_type = position_array[attack_y][attack_x].substr(1, 1);
    // Only if rook, bishop, or queen...
    if (attacker_type === 'r' || attacker_type === 'b' || attacker_type === 'q') {
        // And only if there is at least 1 empty square between the attacker and the king...
        if (Math.abs(kingX - attack_x) > 1 || Math.abs(kingY - attack_y) > 1) {
            // Check each intermediate square for threats from friendly pieces
            var x_diff = attack_x - kingX;
            var y_diff = attack_y - kingY;
            var x_direction = 0;
            var y_direction = 0;
            if (x_diff > 0) {
                x_direction = 1;
            }
            if (y_diff > 0) {
                y_direction = 1;
            }
            if (x_diff < 0) {
                x_direction = -1;
            }
            if (y_diff < 0) {
                y_direction = -1;
            }
            var a = kingX + x_direction,
                b = kingY + y_direction;
            // Change king color so it does not count as an attacker
            position_array[kingY][kingX] = opposite_color + 'k';
            while (a !== attack_x || b !== attack_y) {
                // Check this square for friendly attackers
                if (this.isSquareBlockable(position_array, a, b, opposite_color)) {
                    return false;
                }
                a += x_direction;
                b += y_direction;
            }
        }
    }
    // Can en passant save the day?
    if (attacker_type === 'p') {
        // if attacker is vulnerable to en passant
        if (color === 'w' && attack_y === 3 && pos.en_passant === this.reverseArrayPosition((attack_y - 1) + '' + attack_x)) {
            // ... and if defender can execute en passant
            if (attack_x > 0 && position_array[3][attack_x - 1].substr(0, 2) === 'wp') {
                return false;
            }
            if (attack_x < 7 && position_array[3][attack_x + 1].substr(0, 2) === 'wp') {
                return false;
            }
        }
        // if attacker is vulnerable to en passant
        if (color === 'b' && attack_y === 4 && pos.en_passant === this.reverseArrayPosition((attack_y + 1) + '' + attack_x)) {
            // ... and if defender can execute en passant
            if (attack_x > 0 && position_array[4][attack_x - 1].substr(0, 2) === 'bp') {
                return false;
            }
            if (attack_x < 7 && position_array[4][attack_x + 1].substr(0, 2) === 'bp') {
                return false;
            }
        }
    }
    return true;
};

CHESS.engine.isSquareAttacked = function (temp_position_array, kingX, kingY, pieceColor) {
    var attacker;
    kingX = parseInt(kingX);
    kingY = parseInt(kingY);

     // Look for knight checks
     if (kingY > 0 && kingX > 1 && temp_position_array[kingY - 1][kingX - 2].substr(1, 1) === 'n' && temp_position_array[kingY - 1][kingX - 2].substr(0, 1) !== pieceColor) {
         return true;
     }
     if (kingY > 0 && kingX < 6 && temp_position_array[kingY - 1][kingX + 2].substr(1, 1) === 'n' && temp_position_array[kingY - 1][kingX + 2].substr(0, 1) !== pieceColor) {
         return true;
     }
     if (kingY < 7 && kingX > 1 && temp_position_array[kingY + 1][kingX - 2].substr(1, 1) === 'n' && temp_position_array[kingY + 1][kingX - 2].substr(0, 1) !== pieceColor) {
         return true;
     }
     if (kingY < 7 && kingX < 6 && temp_position_array[kingY + 1][kingX + 2].substr(1, 1) === 'n' && temp_position_array[kingY + 1][kingX + 2].substr(0, 1) !== pieceColor) {
         return true;
     }
     if (kingY > 1 && kingX > 0 && temp_position_array[kingY - 2][kingX - 1].substr(1, 1) === 'n' && temp_position_array[kingY - 2][kingX - 1].substr(0, 1) !== pieceColor) {
         return true;
     }
     if (kingY > 1 && kingX < 7 && temp_position_array[kingY - 2][kingX + 1].substr(1, 1) === 'n' && temp_position_array[kingY - 2][kingX + 1].substr(0, 1) !== pieceColor) {
         return true;
     }
     if (kingY < 6 && kingX > 0 && temp_position_array[kingY + 2][kingX - 1].substr(1, 1) === 'n' && temp_position_array[kingY + 2][kingX - 1].substr(0, 1) !== pieceColor) {
         return true;
     }
     if (kingY < 6 && kingX < 7 && temp_position_array[kingY + 2][kingX + 1].substr(1, 1) === 'n' && temp_position_array[kingY + 2][kingX + 1].substr(0, 1) !== pieceColor) {
         return true;
     }

     // Q/R/K checks: E
     i = 1;
     while(kingX + i < 8) {
        attacker = temp_position_array[kingY][kingX + i];
        if (attacker !== '' && attacker.substr(0, 1) !== pieceColor && (attacker.substr(1, 1) === 'r' || attacker.substr(1, 1) === 'q' || (i === 1 && attacker.substr(1, 1) === 'k'))) {
            return true;
        }
        if (attacker !== '') {
            break;
        }
        i += 1;
     }
     // Q/R/K checks: W
     i = 1;
     while(kingX - i >= 0) {
        attacker = temp_position_array[kingY][kingX - i];
        if (attacker !== '' && attacker.substr(0, 1) !== pieceColor && (attacker.substr(1, 1) === 'r' || attacker.substr(1, 1) === 'q' || (i === 1 && attacker.substr(1, 1) === 'k'))) {
            return true;
        }
        if (attacker !== '') {
            break;
        }
        i += 1;
     }
     // Q/R/K checks: N
     i = 1;
     while(kingY - i >= 0) {
        attacker = temp_position_array[kingY - i][kingX];
        if (attacker !== '' && attacker.substr(0, 1) !== pieceColor && (attacker.substr(1, 1) === 'r' || attacker.substr(1, 1) === 'q' || (i === 1 && attacker.substr(1, 1) === 'k'))) {
            return true;
        }
        if (attacker !== '') {
            break;
        }
        i += 1;
     }
     // Q/R/K checks: S
     i = 1;
     while(kingY + i < 8) {
        attacker = temp_position_array[kingY + i][kingX];
        if (attacker !== '' && attacker.substr(0, 1) !== pieceColor && (attacker.substr(1, 1) === 'r' || attacker.substr(1, 1) === 'q' || (i === 1 && attacker.substr(1, 1) === 'k'))) {
            return true;
        }
        if (attacker !== '') {
            break;
        }
        i += 1;
     }
     // Q/B/K checks: NE
     i = 1;
     while(kingX + i < 8 && kingY - i >= 0) {
        attacker = temp_position_array[kingY - i][kingX + i];
        if (attacker !== '' && attacker.substr(0, 1) !== pieceColor && (attacker.substr(1, 1) === 'q' || attacker.substr(1, 1) === 'b' || (i === 1 && attacker.substr(1, 1) === 'k'))) {
            return true;
        }
        if (attacker !== '') {
            break;
        }
        i += 1;
     }
     // Q/B/K checks: SE
     i = 1;
     while(kingX + i < 8 && kingY + i < 8) {
        attacker = temp_position_array[kingY + i][kingX + i];
        if (attacker !== '' && attacker.substr(0, 1) !== pieceColor && (attacker.substr(1, 1) === 'q' || attacker.substr(1, 1) === 'b' || (i === 1 && attacker.substr(1, 1) === 'k'))) {
            return true;
        }
        if (attacker !== '') {
            break;
        }
        i += 1;
     }
     // Q/B/K checks: SW
     i = 1;
     while(kingX - i >= 0 && kingY + i < 8) {
        attacker = temp_position_array[kingY + i][kingX - i];
        if (attacker !== '' && attacker.substr(0, 1) !== pieceColor && (attacker.substr(1, 1) === 'q' || attacker.substr(1, 1) === 'b' || (i === 1 && attacker.substr(1, 1) === 'k'))) {
            return true;
        }
        if (attacker !== '') {
            break;
        }
        i += 1;
     }
     // Q/B/K checks: NW
     i = 1;
     while(kingX - i >= 0 && kingY - i >= 0) {
        attacker = temp_position_array[kingY - i][kingX - i];
        if (attacker !== '' && attacker.substr(0, 1) !== pieceColor && (attacker.substr(1, 1) === 'q' || attacker.substr(1, 1) === 'b' || (i === 1 && attacker.substr(1, 1) === 'k'))) {
            return true;
        }
        if (attacker !== '') {
            break;
        }
        i += 1;
     }
     if (pieceColor === 'w') {
        // P checks: W
         if (kingX - 1 >= 0 && kingY - 1 >= 0) {
            attacker = temp_position_array[kingY - 1][kingX - 1];
            if (attacker !== '' && attacker.substr(0, 1) !== pieceColor && attacker.substr(1, 1) === 'p') {
                return true;
            }
         }
         // P checks: E
         if (kingX + 1 < 8 && kingY - 1 >= 0) {
            attacker = temp_position_array[kingY - 1][kingX + 1];
            if (attacker !== '' && attacker.substr(0, 1) !== pieceColor && attacker.substr(1, 1) === 'p') {
                return true;
            }
         }
     } else {
        // P checks: W
         if (kingX - 1 >= 0 && kingY + 1 < 8) {
            attacker = temp_position_array[kingY + 1][kingX - 1];
            if (attacker !== '' && attacker.substr(0, 1) !== pieceColor && attacker.substr(1, 1) === 'p') {
                return true;
            }
         }
         // P checks: E
         if (kingX + 1 < 8 && kingY + 1 < 8) {
            attacker = temp_position_array[kingY + 1][kingX + 1];
            if (attacker !== '' && attacker.substr(0, 1) !== pieceColor && attacker.substr(1, 1) === 'p') {
                return true;
            }
         }
     }
    return false;
};

CHESS.engine.isSquareBlockable = function (temp_position_array, squareX, squareY, pieceColor) {
    var attacker;
    squareX = parseInt(squareX);
    squareY = parseInt(squareY);

     // Look for knight blocks
     if (squareY > 0 && squareX > 1 && temp_position_array[squareY - 1][squareX - 2].substr(1, 1) === 'n' && temp_position_array[squareY - 1][squareX - 2].substr(0, 1) !== pieceColor) {
         return true;
     }
     if (squareY > 0 && squareX < 6 && temp_position_array[squareY - 1][squareX + 2].substr(1, 1) === 'n' && temp_position_array[squareY - 1][squareX + 2].substr(0, 1) !== pieceColor) {
         return true;
     }
     if (squareY < 7 && squareX > 1 && temp_position_array[squareY + 1][squareX - 2].substr(1, 1) === 'n' && temp_position_array[squareY + 1][squareX - 2].substr(0, 1) !== pieceColor) {
         return true;
     }
     if (squareY < 7 && squareX < 6 && temp_position_array[squareY + 1][squareX + 2].substr(1, 1) === 'n' && temp_position_array[squareY + 1][squareX + 2].substr(0, 1) !== pieceColor) {
         return true;
     }
     if (squareY > 1 && squareX > 0 && temp_position_array[squareY - 2][squareX - 1].substr(1, 1) === 'n' && temp_position_array[squareY - 2][squareX - 1].substr(0, 1) !== pieceColor) {
         return true;
     }
     if (squareY > 1 && squareX < 7 && temp_position_array[squareY - 2][squareX + 1].substr(1, 1) === 'n' && temp_position_array[squareY - 2][squareX + 1].substr(0, 1) !== pieceColor) {
         return true;
     }
     if (squareY < 6 && squareX > 0 && temp_position_array[squareY + 2][squareX - 1].substr(1, 1) === 'n' && temp_position_array[squareY + 2][squareX - 1].substr(0, 1) !== pieceColor) {
         return true;
     }
     if (squareY < 6 && squareX < 7 && temp_position_array[squareY + 2][squareX + 1].substr(1, 1) === 'n' && temp_position_array[squareY + 2][squareX + 1].substr(0, 1) !== pieceColor) {
         return true;
     }

     // Q/R blocks: E
     i = 1;
     while(squareX + i < 8) {
        attacker = temp_position_array[squareY][squareX + i];
        if (attacker !== '' && attacker.substr(0, 1) !== pieceColor && (attacker.substr(1, 1) === 'r' || attacker.substr(1, 1) === 'q')) {
            return true;
        }
        if (attacker !== '') {
            break;
        }
        i += 1;
     }
     // Q/R blocks: W
     i = 1;
     while(squareX - i >= 0) {
        attacker = temp_position_array[squareY][squareX - i];
        if (attacker !== '' && attacker.substr(0, 1) !== pieceColor && (attacker.substr(1, 1) === 'r' || attacker.substr(1, 1) === 'q')) {
            return true;
        }
        if (attacker !== '') {
            break;
        }
        i += 1;
     }
     // Q/R blocks: N
     i = 1;
     while(squareY - i >= 0) {
        attacker = temp_position_array[squareY - i][squareX];
        if (attacker !== '' && attacker.substr(0, 1) !== pieceColor && (attacker.substr(1, 1) === 'r' || attacker.substr(1, 1) === 'q')) {
            return true;
        }
        if (attacker !== '') {
            break;
        }
        i += 1;
     }
     // Q/R blocks: S
     i = 1;
     while(squareY + i < 8) {
        attacker = temp_position_array[squareY + i][squareX];
        if (attacker !== '' && attacker.substr(0, 1) !== pieceColor && (attacker.substr(1, 1) === 'r' || attacker.substr(1, 1) === 'q')) {
            return true;
        }
        if (attacker !== '') {
            break;
        }
        i += 1;
     }
     // Q/B blocks: NE
     i = 1;
     while(squareX + i < 8 && squareY - i >= 0) {
        attacker = temp_position_array[squareY - i][squareX + i];
        if (attacker !== '' && attacker.substr(0, 1) !== pieceColor && (attacker.substr(1, 1) === 'q' || attacker.substr(1, 1) === 'b')) {
            return true;
        }
        if (attacker !== '') {
            break;
        }
        i += 1;
     }
     // Q/B blocks: SE
     i = 1;
     while(squareX + i < 8 && squareY + i < 8) {
        attacker = temp_position_array[squareY + i][squareX + i];
        if (attacker !== '' && attacker.substr(0, 1) !== pieceColor && (attacker.substr(1, 1) === 'q' || attacker.substr(1, 1) === 'b')) {
            return true;
        }
        if (attacker !== '') {
            break;
        }
        i += 1;
     }
     // Q/B blocks: SW
     i = 1;
     while(squareX - i >= 0 && squareY + i < 8) {
        attacker = temp_position_array[squareY + i][squareX - i];
        if (attacker !== '' && attacker.substr(0, 1) !== pieceColor && (attacker.substr(1, 1) === 'q' || attacker.substr(1, 1) === 'b')) {
            return true;
        }
        if (attacker !== '') {
            break;
        }
        i += 1;
     }
     // Q/B blocks: NW
     i = 1;
     while(squareX - i >= 0 && squareY - i >= 0) {
        attacker = temp_position_array[squareY - i][squareX - i];
        if (attacker !== '' && attacker.substr(0, 1) !== pieceColor && (attacker.substr(1, 1) === 'q' || attacker.substr(1, 1) === 'b')) {
            return true;
        }
        if (attacker !== '') {
            break;
        }
        i += 1;
     }
     if (pieceColor === 'w') {
        // P blocks: 1 square
        if (squareY - 1 >= 0) {
            attacker = temp_position_array[squareY - 1][squareX];
            if (attacker !== '' && attacker.substr(0, 1) !== pieceColor && attacker.substr(1, 1) === 'p') {
                return true;
            }
        }
        // P blocks: 2 squares
        if (squareY === 3 && temp_position_array[2][squareX] === '') {
            attacker = temp_position_array[1][squareX];
            if (attacker !== '' && attacker.substr(0, 1) !== pieceColor && attacker.substr(1, 1) === 'p') {
                return true;
            }
        }
     } else {
        // P blocks: 1 square
         if (squareY + 1 < 8) {
            attacker = temp_position_array[squareY + 1][squareX];
            if (attacker !== '' && attacker.substr(0, 1) !== pieceColor && attacker.substr(1, 1) === 'p') {
                return true;
            }
         }
         // P blocks: 2 squares
        if (squareY === 4 && temp_position_array[5][squareX] === '') {
            attacker = temp_position_array[6][squareX];
            if (attacker !== '' && attacker.substr(0, 1) !== pieceColor && attacker.substr(1, 1) === 'p') {
                return true;
            }
        }
     }
    return false;
};

CHESS.engine.getAttacker = function (temp_position_array, kingX, kingY, pieceColor) {
    var attacker;
    kingX = parseInt(kingX);
    kingY = parseInt(kingY);

     // Look for knight checks
     if (kingY > 0 && kingX > 1 && temp_position_array[kingY - 1][kingX - 2].substr(1, 1) === 'n' && temp_position_array[kingY - 1][kingX - 2].substr(0, 1) !== pieceColor) {
         return (kingY - 1) + '' + (kingX - 2);
     }
     if (kingY > 0 && kingX < 6 && temp_position_array[kingY - 1][kingX + 2].substr(1, 1) === 'n' && temp_position_array[kingY - 1][kingX + 2].substr(0, 1) !== pieceColor) {
         return (kingY - 1) + '' + (kingX + 2);
     }
     if (kingY < 7 && kingX > 1 && temp_position_array[kingY + 1][kingX - 2].substr(1, 1) === 'n' && temp_position_array[kingY + 1][kingX - 2].substr(0, 1) !== pieceColor) {
         return (kingY + 1) + '' + (kingX - 2);
     }
     if (kingY < 7 && kingX < 6 && temp_position_array[kingY + 1][kingX + 2].substr(1, 1) === 'n' && temp_position_array[kingY + 1][kingX + 2].substr(0, 1) !== pieceColor) {
         return (kingY + 1) + '' + (kingX + 2);
     }
     if (kingY > 1 && kingX > 0 && temp_position_array[kingY - 2][kingX - 1].substr(1, 1) === 'n' && temp_position_array[kingY - 2][kingX - 1].substr(0, 1) !== pieceColor) {
         return (kingY - 2) + '' + (kingX - 1);
     }
     if (kingY > 1 && kingX < 7 && temp_position_array[kingY - 2][kingX + 1].substr(1, 1) === 'n' && temp_position_array[kingY - 2][kingX + 1].substr(0, 1) !== pieceColor) {
         return (kingY - 2) + '' + (kingX + 1);
     }
     if (kingY < 6 && kingX > 0 && temp_position_array[kingY + 2][kingX - 1].substr(1, 1) === 'n' && temp_position_array[kingY + 2][kingX - 1].substr(0, 1) !== pieceColor) {
         return (kingY + 2) + '' + (kingX - 1);
     }
     if (kingY < 6 && kingX < 7 && temp_position_array[kingY + 2][kingX + 1].substr(1, 1) === 'n' && temp_position_array[kingY + 2][kingX + 1].substr(0, 1) !== pieceColor) {
         return (kingY + 2) + '' + (kingX + 1);
     }

     // Q/R/K checks: E
     i = 1;
     while(kingX + i < 8) {
        attacker = temp_position_array[kingY][kingX + i];
        if (attacker !== '' && attacker.substr(0, 1) !== pieceColor && (attacker.substr(1, 1) === 'r' || attacker.substr(1, 1) === 'q' || (i === 1 && attacker.substr(1, 1) === 'k'))) {
            return (kingY) + '' + (kingX + i);
        }
        if (attacker !== '') {
            break;
        }
        i += 1;
     }
     // Q/R/K checks: W
     i = 1;
     while(kingX - i >= 0) {
        attacker = temp_position_array[kingY][kingX - i];
        if (attacker !== '' && attacker.substr(0, 1) !== pieceColor && (attacker.substr(1, 1) === 'r' || attacker.substr(1, 1) === 'q' || (i === 1 && attacker.substr(1, 1) === 'k'))) {
            return (kingY) + '' + (kingX - i);
        }
        if (attacker !== '') {
            break;
        }
        i += 1;
     }
     // Q/R/K checks: N
     i = 1;
     while(kingY - i >= 0) {
        attacker = temp_position_array[kingY - i][kingX];
        if (attacker !== '' && attacker.substr(0, 1) !== pieceColor && (attacker.substr(1, 1) === 'r' || attacker.substr(1, 1) === 'q' || (i === 1 && attacker.substr(1, 1) === 'k'))) {
            return (kingY - i) + '' + (kingX);
        }
        if (attacker !== '') {
            break;
        }
        i += 1;
     }
     // Q/R/K checks: S
     i = 1;
     while(kingY + i < 8) {
        attacker = temp_position_array[kingY + i][kingX];
        if (attacker !== '' && attacker.substr(0, 1) !== pieceColor && (attacker.substr(1, 1) === 'r' || attacker.substr(1, 1) === 'q' || (i === 1 && attacker.substr(1, 1) === 'k'))) {
            return (kingY + i) + '' + (kingX);
        }
        if (attacker !== '') {
            break;
        }
        i += 1;
     }
     // Q/B/K checks: NE
     i = 1;
     while(kingX + i < 8 && kingY - i >= 0) {
        attacker = temp_position_array[kingY - i][kingX + i];
        if (attacker !== '' && attacker.substr(0, 1) !== pieceColor && (attacker.substr(1, 1) === 'q' || attacker.substr(1, 1) === 'b' || (i === 1 && attacker.substr(1, 1) === 'k'))) {
            return (kingY - i) + '' + (kingX + i);
        }
        if (attacker !== '') {
            break;
        }
        i += 1;
     }
     // Q/B/K checks: SE
     i = 1;
     while(kingX + i < 8 && kingY + i < 8) {
        attacker = temp_position_array[kingY + i][kingX + i];
        if (attacker !== '' && attacker.substr(0, 1) !== pieceColor && (attacker.substr(1, 1) === 'q' || attacker.substr(1, 1) === 'b' || (i === 1 && attacker.substr(1, 1) === 'k'))) {
            return (kingY + i) + '' + (kingX + i);
        }
        if (attacker !== '') {
            break;
        }
        i += 1;
     }
     // Q/B/K checks: SW
     i = 1;
     while(kingX - i >= 0 && kingY + i < 8) {
        attacker = temp_position_array[kingY + i][kingX - i];
        if (attacker !== '' && attacker.substr(0, 1) !== pieceColor && (attacker.substr(1, 1) === 'q' || attacker.substr(1, 1) === 'b' || (i === 1 && attacker.substr(1, 1) === 'k'))) {
            return (kingY + i) + '' + (kingX - i);
        }
        if (attacker !== '') {
            break;
        }
        i += 1;
     }
     // Q/B/K checks: NW
     i = 1;
     while(kingX - i >= 0 && kingY - i >= 0) {
        attacker = temp_position_array[kingY - i][kingX - i];
        if (attacker !== '' && attacker.substr(0, 1) !== pieceColor && (attacker.substr(1, 1) === 'q' || attacker.substr(1, 1) === 'b' || (i === 1 && attacker.substr(1, 1) === 'k'))) {
            return (kingY - i) + '' + (kingX - i);
        }
        if (attacker !== '') {
            break;
        }
        i += 1;
     }
     if (pieceColor === 'w') {
        // P checks: W
         if (kingX - 1 > 0 && kingY - 1 >= 0) {
            attacker = temp_position_array[kingY - 1][kingX - 1];
            if (attacker !== '' && attacker.substr(0, 1) !== pieceColor && attacker.substr(1, 1) === 'p') {
                return (kingY - 1) + '' + (kingX - 1);
            }
         }
         // P checks: E
         if (kingX + 1 < 8 && kingY - 1 >= 0) {
            attacker = temp_position_array[kingY - 1][kingX + 1];
            if (attacker !== '' && attacker.substr(0, 1) !== pieceColor && attacker.substr(1, 1) === 'p') {
                return (kingY - 1) + '' + (kingX + 1);
            }
         }
     } else {
        // P checks: W
         if (kingX - 1 >= 0 && kingY + 1 < 8) {
            attacker = temp_position_array[kingY + 1][kingX - 1];
            if (attacker !== '' && attacker.substr(0, 1) !== pieceColor && attacker.substr(1, 1) === 'p') {
                return (kingY + 1) + '' + (kingX - 1);
            }
         }
         // P checks: E
         if (kingX + 1 < 8 && kingY + 1 < 8) {
            attacker = temp_position_array[kingY + 1][kingX + 1];
            if (attacker !== '' && attacker.substr(0, 1) !== pieceColor && attacker.substr(1, 1) === 'p') {
                return (kingY + 1) + '' + (kingX + 1);
            }
         }
     }
    return '';
};

CHESS.engine.isStalemate = function (pos) {
    var is_stalemate = !this.getLegalMoves(pos, true);
    return is_stalemate;
};

CHESS.engine.getLegalMoves = function (pos, return_bool) {
    var i,
        j,
        sq1,
        sq2,
        move = '',
        move_list = [],
        color = (pos.white_to_move ? 'w' : 'b'),
        dir,
        sq = 0,
        en_passant_x;

    for (i = 0; i < 8; i++) {
        for (j = 0; j < 8; j++) {
            sq1 = this.reverseArrayPosition (i + '' + j);
            // King
            if (pos.position_array[i][j] === color + 'k') {
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
            // Pawn
            if (pos.position_array[i][j].substr(0, 2) === color + 'p') {
                dir = (color === 'w' ? -1 : 1);
                // One square
                sq2 = this.reverseArrayPosition((i + dir) + '' + j);
                move = sq1 + '-' + sq2;
                move_list.push(move);
                // Two squares
                if ((color === 'w' && i === 6) || (color === 'b' && i === 1)) {
                    sq2 = this.reverseArrayPosition((i + (dir * 2)) + '' + j);
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                }
                // Capture
                // ...
                // En Passant
                if (/[a-h][1-8]/.test(pos.en_passant)) {
                    en_passant_x = parseInt(this.getArrayPosition(pos.en_passant).substr(0, 1), 10);
                }
                if (color === 'w' && i === 3) {
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
                if (color === 'b' && i === 4) {
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
            // Queen
            if (pos.position_array[i][j] === color + 'q') {
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
            // Rook
            if (pos.position_array[i][j] === color + 'r') {
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
            // Bishop
            if (pos.position_array[i][j] === color + 'b') {
                // NE
                sq = 1;
                while (i - sq >= 0 && j + sq <= 7) {
                    sq2 = this.reverseArrayPosition((i - sq) + '' + (j + sq));
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
                // SW
                sq = 1;
                while (i + sq <= 7 && j - sq >= 0) {
                    sq2 = this.reverseArrayPosition((i + sq) + '' + (j - sq));
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
            // Knight
            if (pos.position_array[i][j] === color + 'n') {
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
        if (!this.isLegal(pos, sq1, sq2)) {
            move_list.splice(i, 1);
            i--;
        } else if (return_bool) {
            return true;
        }
    }
    if (return_bool) {
        return false;
    }
    return move_list;
};

CHESS.engine.getLongNotation = function (pos, short_notation) {
    var i,
        j,
        long_move = '',
        sq1,
        sq2 = short_notation.replace(/[#+=xKQRBN]/g, ''),
        color = (pos.white_to_move ? 'w' : 'b'),
        piece = short_notation.substring(0, 1),
        sq1_info = '',
        sq1_info_type = '';
    // Check for castling first
    if (short_notation === 'O-O') {
        if (color === 'w') {
            return 'e1-g1';
        } else {
            return 'e8-g8';
        }
    } else if (short_notation === 'O-O-O') {
        if (color === 'w') {
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
            if (sq1_info_type === 'rank' && parseInt(sq1_info) !== (8 - i)) {
                continue;
            } else if (sq1_info_type === 'file' && parseInt(sq1_info) !== j) {
                continue;
            }
            // Locate a potential piece
            if (pos.position_array[i][j].length > 1 && pos.position_array[i][j].substr(0, 2) === color + piece) {
                sq1 = this.reverseArrayPosition (i + '' + j);
                if (this.isLegal(pos, sq1, sq2)) {
                    long_move = sq1 + '-' + sq2;
                }
            }
        }
    }
    return long_move;
};

CHESS.engine.getArrayPosition = function (sq) {
    var x,
        y,
        xy = false;

    if (/[a-h][1-8]/.test(sq)) {
        x = sq.substr(0, 1).toLowerCase();
        y = sq.substr(1, 1);
        x = x.charCodeAt(0) - 97;
        y = 8 - y;
        xy = x + '' + y;
    }
    return xy;
};

CHESS.engine.reverseArrayPosition = function (xy) {
    var x = parseInt(xy.substr(1, 1)),
        y = parseInt(xy.substr(0, 1));
    x = String.fromCharCode(x + 97);
    y = 8 - y;
    return x + '' + y;
};

CHESS.engine.clonePositionArray = function (old_array) {
    // Initial position and stats
    var i = 0,
        new_array = [];
    for (i = 0; i < 8; i += 1) {
        new_array[i] = old_array[i].slice(0);
    }
    return new_array;
};

CHESS.engine.moveTemp = function (pos, sq1, sq2) {
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

    // Do not play if move is illegal
    if (!this.isLegal(pos, sq1, sq2)) {
        return false;
    }
    // Update game values
    pos.last_move = {'sq1':this.getArrayPosition(sq1), 'sq2':this.getArrayPosition(sq2)};

    if (pos.white_to_move) {
        w_sq1 = sq1;
        w_sq2 = sq2;
        w_xy1 = this.getArrayPosition(w_sq1);
        w_xy2 = this.getArrayPosition(w_sq2);
        w_x1 = parseInt(w_xy1.substr(0, 1));
        w_y1 = parseInt(w_xy1.substr(1, 1));
        w_x2 = parseInt(w_xy2.substr(0, 1));
        w_y2 = parseInt(w_xy2.substr(1, 1));
        captured_piece = pos.position_array[w_y2][w_x2];
        piece = pos.position_array[w_y1][w_x1];
        pos.position_array[w_y2][w_x2] = pos.position_array[w_y1][w_x1];
        pos.position_array[w_y1][w_x1] = '';
        // Pawn is eligible to be captured en passant
        w_xy1 = this.getArrayPosition(w_sq1);
        if (piece.substr(0, 2) === 'wp' && w_y2 - w_y1 === -2) {
            pos.en_passant = this.reverseArrayPosition((w_y2 + 1) + '' + w_x2);
        } else {
            pos.en_passant = '';
        }
        // En passant
        if (piece.substr(0, 2) === 'wp' && w_x2 !== w_x1 && captured_piece === '') {
            pos.position_array[w_y1][w_x2] = '';
            pawn_sq = w_sq2.substr(0, 1) + w_sq1.substr(1, 1);
        }
        // Pawn promotion
        if (piece.substr(0, 2) === 'wp' && w_y2 === 0) {
            pos.position_array[w_y2][w_x2] = 'wq';
        }
        // Castling
        if (piece === 'wk' && w_sq1 === 'e1') {
            if (w_sq2 === 'g1') {
                pos.position_array[7][5] = 'wrk';
                pos.position_array[7][7] = '';
            } else if (w_sq2 === 'c1') {
                pos.position_array[7][3] = 'wrq';
                pos.position_array[7][0] = '';
            }
        }
        // Lose castling ability
        if (piece === 'wk') {
            pos.gs_castle_kside_w = false;
            pos.gs_castle_qside_w = false;
        } else if (piece === 'wr' && w_sq1 === 'h1') {
            pos.gs_castle_kside_w = false;
        } else if (piece === 'wr' && w_sq1 === 'a1') {
            pos.gs_castle_qside_w = false;
        } else if (captured_piece === 'br' && w_sq2 === 'a8') {
            pos.gs_castle_qside_b = false;
        } else if (captured_piece === 'br' && w_sq2 === 'h8') {
            pos.gs_castle_kside_b = false;
        }
        pos.white_to_move = false;
    } else {
        // Black's turn
        b_sq1 = sq1;
        b_sq2 = sq2;
        b_xy1 = this.getArrayPosition(b_sq1);
        b_xy2 = this.getArrayPosition(b_sq2);
        b_x1 = parseInt(b_xy1.substr(0, 1));
        b_y1 = parseInt(b_xy1.substr(1, 1));
        b_x2 = parseInt(b_xy2.substr(0, 1));
        b_y2 = parseInt(b_xy2.substr(1, 1));
        captured_piece = pos.position_array[b_y2][b_x2];
        piece = pos.position_array[b_y1][b_x1];
        pos.position_array[b_y2][b_x2] = pos.position_array[b_y1][b_x1];
        pos.position_array[b_y1][b_x1] = '';
        // Pawn is eligible to be captured en passant
        b_xy1 = this.getArrayPosition(b_sq1);
        if (piece.substr(0, 2) === 'bp' && b_y2 - b_y1 === 2) {
            pos.en_passant = this.reverseArrayPosition((b_y2 - 1) + '' + b_x2);
        } else {
            pos.en_passant = '';
        }
        // En passant
        if (piece.substr(0, 2) === 'bp' && b_x2 !== b_x1 && captured_piece === '') {
            pos.position_array[b_y1][b_x2] = '';
            pawn_sq = b_sq2.substr(0, 1) + b_sq1.substr(1, 1);
        }
        // Pawn promotion
        if (piece.substr(0, 2) === 'bp' && b_y2 === 7) {
            pos.position_array[b_y2][b_x2] = 'bq';
        }
        // Castling
        if (piece === 'bk' && b_sq1 === 'e8') {
            if (b_sq2 === 'g8') {
                pos.position_array[0][5] = 'brk';
                pos.position_array[0][7] = '';
            } else if (b_sq2 === 'c8') {
                pos.position_array[0][3] = 'brq';
                pos.position_array[0][0] = '';
            }
        }
        // Lose castling ability
        if (piece === 'bk') {
            pos.gs_castle_kside_b = false;
            pos.gs_castle_qside_b = false;
        } else if (piece === 'br' && b_sq1 === 'h8') {
            pos.gs_castle_kside_b = false;
        } else if (piece === 'br' && b_sq1 === 'a8') {
            pos.gs_castle_qside_b = false;
        } else if (captured_piece === 'wr' && b_sq2 === 'a1') {
            pos.gs_castle_qside_w = false;
        } else if (captured_piece === 'wr' && b_sq2 === 'h1') {
            pos.gs_castle_kside_w = false;
        }
        pos.white_to_move = true;
    }
    // Check game ending conditions
    if (this.isMate(pos) || this.isStalemate(pos)) {
        pos.active = false;
    }
    return true;
};
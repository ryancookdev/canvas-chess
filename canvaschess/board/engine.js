function isLegal (gb, sq1, sq2) {
    var i,
        xy1 = getArrayPosition(sq1),
        xy2 = getArrayPosition(sq2),
        x1 = parseInt(xy1.substr(0, 1)),
        y1 = parseInt(xy1.substr(1, 1)),
        x2 = parseInt(xy2.substr(0, 1)),
        y2 = parseInt(xy2.substr(1, 1)),
        sq1Val = gb.position_array[y1][x1],
        sq2Val = gb.position_array[y2][x2],
        pieceType = sq1Val.substr(1, 1),
        pieceColor = sq1Val.substr(0, 1),
        is_en_passant = false,
        is_capturing_enemy,
        xDif,
        yDif,
        xInc,
        yInc,
        temp_position_array;

    // Turn logic
    if ((gb.white_to_move && pieceColor === 'b') || (!gb.white_to_move && pieceColor === 'w')) {
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
        if (!(Math.abs(y1 - y2) === 1 || (Math.abs(y1 - y2) === 2 && ((pieceColor === 'w' && y1 === 6 && gb.position_array[5][x1] === '') || (pieceColor === 'b' && y1 === 1 && gb.position_array[2][x1] === ''))))) {
            return false;
        }
        // pawns cannot capture directly forward
        if (Math.abs(x1 - x2) === 0 && gb.position_array[y2][x2] !== '') {
            return false;
        }
        // pawns cannot move horizontally unless capturing 1 square on a forward-diagonal
        if (Math.abs(x1 - x2) > 0) {
            // if side to side movement, only the following situations are valid
            is_capturing_enemy = (sq2Val.substr(0, 1) !== '' && sq2Val.substr(0, 1) !== pieceColor);
            is_en_passant = parseInt(gb.en_passant) === x2;
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
                if (sq2 === 'g1' && gb.gs_castle_kside_w && gb.position_array[7][5] === '' && gb.position_array[7][6] === '') {
                    // castle kingside
                    // check for checks
                    if (isSquareAttacked(gb.position_array, 4, 7, 'w')) {
                        return false;
                    }
                    if (isSquareAttacked(gb.position_array, 5, 7, 'w')) {
                        return false;
                    }
                    if (isSquareAttacked(gb.position_array, 6, 7, 'w')) {
                        return false;
                    }
                } else if (sq2 === 'c1' && gb.gs_castle_qside_w && gb.position_array[7][1] === '' && gb.position_array[7][2] === '' && gb.position_array[7][3] === '') {
                    // castle queenside 
                    // check for checks
                    if (isSquareAttacked(gb.position_array, 2, 7, 'w')) {
                        return false;
                    }
                    if (isSquareAttacked(gb.position_array, 3, 7, 'w')) {
                        return false;
                    }
                    if (isSquareAttacked(gb.position_array, 4, 7, 'w')) {
                        return false;
                    }
                } else {
                    return false;
                }
            } else if (pieceColor === 'b') {
                if (sq2 === 'g8' && gb.gs_castle_kside_b && gb.position_array[0][5] === '' && gb.position_array[0][6] === '') {
                    // castle kingside
                    // check for checks
                    if (isSquareAttacked(gb.position_array, 4, 0, 'b')) {
                        return false;
                    }
                    if (isSquareAttacked(gb.position_array, 5, 0, 'b')) {
                        return false;
                    }
                    if (isSquareAttacked(gb.position_array, 6, 0, 'b')) {
                        return false;
                    }
                } else if (sq2 === 'c8' && gb.gs_castle_qside_b && gb.position_array[0][1] === '' && gb.position_array[0][2] === '' && gb.position_array[0][3] === '') {
                    // castle queenside
                    // check for checks
                    if (isSquareAttacked(gb.position_array, 2, 0, 'b')) {
                        return false;
                    }
                    if (isSquareAttacked(gb.position_array, 3, 0, 'b')) {
                        return false;
                    }
                    if (isSquareAttacked(gb.position_array, 4, 0, 'b')) {
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
            if (gb.position_array[parseInt(y1) + i * yInc][parseInt(x1) + i * xInc] !== '') {
                return false;
            }
            i += 1;
        }
    }
    
    // KING IN CHECK
    temp_position_array = clonePositionArray(gb.position_array);
    temp_position_array[xy2.substr(1, 1)][xy2.substr(0, 1)] = temp_position_array[xy1.substr(1, 1)][xy1.substr(0, 1)];
    temp_position_array[xy1.substr(1, 1)][xy1.substr(0, 1)] = '';
    if (is_en_passant) {
        temp_position_array[xy1.substr(1, 1)][xy2.substr(0, 1)] = '';
    }
    if (isCheck(temp_position_array, pieceColor)) {
        return false;
    }
    return true;
}

function isCheck (temp_position_array, pieceColor) {
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
    if (isSquareAttacked(temp_position_array, kingX, kingY, pieceColor)) {
        return true;
    }
    return false;
}

function isMate (gb) {
    var i,
        j,
        color = (gb.white_to_move ? 'w' : 'b'),
        kingX = 0,
        kingY = 0,
        attacker_sq,
        attack_x,
        attack_y,
        friendly_attacker_sq,
        position_array = clonePositionArray(gb.position_array);

    // Find king
    for (i = 0; i < 8; i++) {
        for (j = 0; j < 8; j++) {
            if (position_array[i][j] === color + 'k') {
                kingX = j;
                kingY = i;
            }
        }
    }
    attacker_sq = getAttacker(position_array, kingX, kingY, color);
    if (attacker_sq === '') {
        return false;
    }
    // Remove king from its current position
    position_array[kingY][kingX] = '';
    // Move up
    if (kingY > 0) {
        // Does it contain a friendly piece?
        if (position_array[kingY - 1][kingX].substr(0, 1) !== color) {
            if (!isSquareAttacked(position_array, kingX, kingY - 1, color)) {
                return false;
            }
        }
    }
    // Move down
    if (kingY < 7) {
        // Does it contain a friendly piece?
        if (position_array[kingY + 1][kingX].substr(0, 1) !== color) {
            if (!isSquareAttacked(position_array, kingX, kingY + 1, color)) {
                return false;
            }
        }
    }
    // Move left
    if (kingX > 0) {
        // Does it contain a friendly piece?
        if (position_array[kingY][kingX - 1].substr(0, 1) !== color) {
            if (!isSquareAttacked(position_array, kingX - 1, kingY, color)) {
                return false;
            }
        }
    }
    // Move right
    if (kingX < 7) {
        // Does it contain a friendly piece?
        if (position_array[kingY][kingX + 1].substr(0, 1) !== color) {
            if (!isSquareAttacked(position_array, kingX + 1, kingY, color)) {
                return false;
            }
        }
    }
    // Move up/left
    if (kingX > 0 && kingY > 0) {
        // Does it contain a friendly piece?
        if (position_array[kingY - 1][kingX - 1].substr(0, 1) !== color) {
            if (!isSquareAttacked(position_array, kingX - 1, kingY - 1, color)) {
                return false;
            }
        }
    }
    // Move up/right
    if (kingX < 7 && kingY > 0) {
        // Does it contain a friendly piece?
        if (position_array[kingY - 1][kingX + 1].substr(0, 1) !== color) {
            if (!isSquareAttacked(position_array, kingX + 1, kingY - 1, color)) {
                return false;
            }
        }
    }
    // Move down/left
    if (kingX > 0 && kingY < 7) {
        // Does it contain a friendly piece?
        if (position_array[kingY + 1][kingX - 1].substr(0, 1) !== color) {
            if (!isSquareAttacked(position_array, kingX - 1, kingY + 1, color)) {
                return false;
            }
        }
    }
    // Move down/right
    if (kingX < 7 && kingY < 7) {
        // Does it contain a friendly piece?
        if (position_array[kingY + 1][kingX + 1].substr(0, 1) !== color) {
            if (!isSquareAttacked(position_array, kingX + 1, kingY + 1, color)) {
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
    friendly_attacker_sq = getAttacker(position_array, attack_y, attack_x, opposite_color)
    if (friendly_attacker_sq !== '') {
        // Can the attacking piece be captured?
        var sq1 = reverseArrayPosition(friendly_attacker_sq);
        var sq2 = reverseArrayPosition(attacker_sq);
        if (isLegal(gb, sq1, sq2)) {
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
                if (isSquareBlockable(position_array, a, b, opposite_color)) {
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
        if (color === 'w' && attack_y === 3 && parseInt(gb.en_passant) === attack_x) {
            // ... and if defender can execute en passant
            if (attack_x > 0 && position_array[3][attack_x - 1].substr(0, 2) === 'wp') {
                return false;
            }
            if (attack_x < 7 && position_array[3][attack_x + 1].substr(0, 2) === 'wp') {
                return false;
            }
        }
        // if attacker is vulnerable to en passant
        if (color === 'b' && attack_y === 4 && parseInt(gb.en_passant) === attack_x) {
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
}

function isSquareAttacked (temp_position_array, kingX, kingY, pieceColor) {
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
}

function isSquareBlockable (temp_position_array, squareX, squareY, pieceColor) {
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
}

function getAttacker (temp_position_array, kingX, kingY, pieceColor) {
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
}

function isStalemate (gb) {
    return !getLegalMoves(gb, true);
}

function getLegalMoves (gb, return_bool) {
    var i,
        j,
        sq1,
        sq2,
        move = '',
        move_list = [],
        color = (gb.white_to_move ? 'w' : 'b'),
        dir,
        sq = 0;
    
    for (i = 0; i < 8; i++) {
        for (j = 0; j < 8; j++) {
            sq1 = reverseArrayPosition (i + '' + j);
            // King
            if (gb.position_array[i][j] === color + 'k') {
                // N
                if (i > 0) {
                    sq2 = reverseArrayPosition((i - 1) + '' + j);
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                }
                // NE
                if (i > 0 && j < 7) {
                    sq2 = reverseArrayPosition((i - 1) + '' + (j + 1));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                }
                // E
                if (j < 7) {
                    sq2 = reverseArrayPosition(i + '' + (j + 1));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                }
                // SE
                if (i < 7 && j < 7) {
                    sq2 = reverseArrayPosition((i + 1) + '' + (j + 1));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                }
                // S
                if (i < 7) {
                    sq2 = reverseArrayPosition((i + 1) + '' + j);
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                }
                // SW
                if (i < 7 && j > 0) {
                    sq2 = reverseArrayPosition((i + 1) + '' + (j - 1));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                }
                // W
                if (j > 0) {
                    sq2 = reverseArrayPosition(i + '' + (j - 1));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                }
                // NW
                if (i > 0 && j > 0) {
                    sq2 = reverseArrayPosition((i - 1) + '' + (j - 1));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                }
                // Castling
                // ...
            }
            // Pawn
            if (gb.position_array[i][j].substr(0, 2) === color + 'p') {
                dir = (color === 'w' ? -1 : 1);
                // One square
                sq2 = reverseArrayPosition((i + dir) + '' + j);
                move = sq1 + '-' + sq2;
                move_list.push(move);
                // Two squares
                if ((color === 'w' && i === 6) || (color === 'b' && i == 1)) {
                    sq2 = reverseArrayPosition((i + (dir * 2)) + '' + j);
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                }
                // Capture
                // ...
                // En Passant
                // ...
            }
            // Queen
            if (gb.position_array[i][j] === color + 'q') {
                // N
                sq = 1;
                while (i - sq >= 0) {
                    sq2 = reverseArrayPosition((i - sq) + '' + j);
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                    sq++;
                }
                // NE
                sq = 1;
                while (i - sq >= 0 && j + sq <= 7) {
                    sq2 = reverseArrayPosition((i - sq) + '' + (j + sq));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                    sq++;
                }
                // E
                sq = 1;
                while (j + sq <= 7) {
                    sq2 = reverseArrayPosition(i + '' + (j + sq));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                    sq++;
                }
                // SE
                sq = 1;
                while (j + sq <= 7 && i + sq <= 7) {
                    sq2 = reverseArrayPosition((i + sq) + '' + (j + sq));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                    sq++;
                }
                // S
                sq = 1;
                while (i + sq <= 7) {
                    sq2 = reverseArrayPosition((i + sq) + '' + j);
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                    sq++;
                }
                // SW
                sq = 1;
                while (i + sq <= 7 && j - sq >= 0) {
                    sq2 = reverseArrayPosition((i + sq) + '' + (j - sq));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                    sq++;
                }
                // W
                sq = 1;
                while (j - sq >= 0) {
                    sq2 = reverseArrayPosition(i + '' + (j - sq));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                    sq++;
                }
                // NW
                sq = 1;
                while (j - sq >= 0 && i - sq >= 0) {
                    sq2 = reverseArrayPosition((i - sq) + '' + (j - sq));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                    sq++;
                }
            }
            // Rook
            if (gb.position_array[i][j] === color + 'r') {
                // N
                sq = 1;
                while (i - sq >= 0) {
                    sq2 = reverseArrayPosition((i - sq) + '' + j);
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                    sq++;
                }
                // E
                sq = 1;
                while (j + sq <= 7) {
                    sq2 = reverseArrayPosition(i + '' + (j + sq));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                    sq++;
                }
                // S
                sq = 1;
                while (i + sq <= 7) {
                    sq2 = reverseArrayPosition((i + sq) + '' + j);
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                    sq++;
                }
                // W
                sq = 1;
                while (j - sq >= 0) {
                    sq2 = reverseArrayPosition(i + '' + (j - sq));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                    sq++;
                }
            }
            // Bishop
            if (gb.position_array[i][j] === color + 'b') {
                // NE
                sq = 1;
                while (i - sq >= 0 && j + sq <= 7) {
                    sq2 = reverseArrayPosition((i - sq) + '' + (j + sq));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                    sq++;
                }
                // SE
                sq = 1;
                while (j + sq <= 7 && i + sq <= 7) {
                    sq2 = reverseArrayPosition((i + sq) + '' + (j + sq));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                    sq++;
                }
                // SW
                sq = 1;
                while (i + sq <= 7 && j - sq >= 0) {
                    sq2 = reverseArrayPosition((i + sq) + '' + (j - sq));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                    sq++;
                }
                // NW
                sq = 1;
                while (j - sq >= 0 && i - sq >= 0) {
                    sq2 = reverseArrayPosition((i - sq) + '' + (j - sq));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                    sq++;
                }
            }
            // Knight
            if (gb.position_array[i][j] === color + 'n') {
                // NNE
                if (i >= 2 && j <= 6) {
                    sq2 = reverseArrayPosition((i - 2) + '' + (j + 1));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                }
                // NEE
                if (i >= 1 && j <= 5) {
                    sq2 = reverseArrayPosition((i - 1) + '' + (j + 2));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                }
                // SEE
                if (i <= 6 && j <= 5) {
                    sq2 = reverseArrayPosition((i + 1) + '' + (j + 2));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                }
                // SSE
                if (i <= 5 && j <= 6) {
                    sq2 = reverseArrayPosition((i + 2) + '' + (j + 1));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                }
                // SSW
                if (i <= 5 && j >= 1) {
                    sq2 = reverseArrayPosition((i + 2) + '' + (j - 1));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                }
                // SWW
                if (i <= 6 && j >= 2) {
                    sq2 = reverseArrayPosition((i + 1) + '' + (j - 2));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                }
                // NWW
                if (i >= 1 && j >= 2) {
                    sq2 = reverseArrayPosition((i - 1) + '' + (j - 2));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                }
                // NNW
                if (i >= 2 && j >= 1) {
                    sq2 = reverseArrayPosition((i - 2) + '' + (j - 1));
                    move = sq1 + '-' + sq2;
                    move_list.push(move);
                }
            }
        }
    }
    for (i = 0; i < move_list.length; i++) {
        sq1 = move_list[i].split('-')[0];
        sq2 = move_list[i].split('-')[1];
        if (!isLegal(gb, sq1, sq2)) {
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
}

function getLongNotation(gb, move) {
    var i,
        j,
        long_move = '',
        sq1,
        sq2 = move.replace(/[#+=xKQRBN]/g, ''),
        color = (gb.white_to_move ? 'w' : 'b'),
        piece = move.substring(0, 1),
        sq1_info = '',
        sq1_info_type = '';
    // Check for castling first
    if (move === 'O-O') {
        if (color === 'w') {
            return 'e1-g1';
        } else {
            return 'e8-g8';
        }
    } else if (move === 'O-O-O') {
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
            if (sq1_info_type === 'rank' && parseInt(sq1_info) !== i) {
                continue;
            } else if (sq1_info_type === 'file' && parseInt(sq1_info) !== j) {
                continue;
            }
            // Locate a potential piece
            if (gb.position_array[i][j].substr(0, 2) === color + piece) {
                sq1 = reverseArrayPosition (i + '' + j);
                if (isLegal(gb, sq1, sq2)) {
                    long_move = sq1 + '-' + sq2;
                }
            }
        }
    }
    return long_move;
}

function getArrayPosition (sq) {
    var x = sq.substr(0, 1).toLowerCase(),
        y = sq.substr(1, 1);
    x = x.charCodeAt(0) - 97;
    y = 8 - y;
    return x + '' + y;
}

function reverseArrayPosition (xy) {
    var x = parseInt(xy.substr(1, 1)),
        y = parseInt(xy.substr(0, 1));
    x = String.fromCharCode(x + 97);
    y = 8 - y;
    return x + '' + y;
}

function clonePositionArray(old_array) {
    // Initial position and stats
    var i = 0,
        new_array = [];
    for (i = 0; i < 8; i += 1) {
        new_array[i] = old_array[i].slice(0);
    }
    return new_array;
}

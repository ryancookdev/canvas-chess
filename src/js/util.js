var CHESS = CHESS || {};

/**
 * Utility library
 */

CHESS.util = {};

CHESS.util.isLegal = function (position, sq1, sq2) {
    var i,
        xy1 = this.getArrayPosition(sq1),
        xy2 = this.getArrayPosition(sq2),
        x1,
        y1,
        x2,
        y2,
        piece,
        newSquare,
        is_en_passant = false,
        tempPosition;

    if (!(xy1 && xy2)) {
        return false;
    }

    x1 = parseInt(xy1.substr(0, 1), 10),
    y1 = parseInt(xy1.substr(1, 1), 10),
    x2 = parseInt(xy2.substr(0, 1), 10),
    y2 = parseInt(xy2.substr(1, 1), 10),
    piece = position.getPiece(sq1),
    newSquare = position.getPiece(sq2);
 
    // Turn logic
    if (!piece.isColor(position.getColorToMove())) {
        return false;
    }

    // two friendly pieces cannot occupy the same square
    if (!newSquare.isEmpty() && newSquare.isColor(piece.getColor())) {
        return false;
    }

    if (piece.isKing() && !this.isLegalKingMove(position, sq1, sq2)) {
        return false;
    }

    if (piece.isPawn() && !this.isLegalPawnMove(position, sq1, sq2)) {
        return false;
    }

    if (piece.isKnight() && !CHESS.Math.isKnightMove(sq1, sq2)) {
        return false;
    }

    if (piece.isRook() && !CHESS.Math.isRookMove(sq1, sq2)) {
        return false;
    }

    if (piece.isBishop() && !CHESS.Math.isBishopMove(sq1, sq2)) {
        return false;
    }

    if (piece.isQueen() && !CHESS.Math.isQueenMove(sq1, sq2)) {
        return false;
    }

    // Queen, Bishops, and Rooks cannot jump pieces
    if (piece.isQueen() || piece.isBishop() || piece.isRook()) {
        if (!this.isClearPath(position, sq1, sq2)) {
            return false;
        }
    }

    // KING IN CHECK
    tempPosition = new CHESS.Position(position.getFen());
    tempPosition.setPiece(sq2, '', tempPosition.getPiece(sq1).toString());
    tempPosition.setPiece(sq1, '', '');
    if (is_en_passant) {
        var captureSquare = 
        tempPosition.setPiece(y1, x2, '');
    }
    if (this.isCheck(tempPosition, piece.getColor())) {
        return false;
    }
    return true;
};

CHESS.util.isClearPath = function (position, sq1, sq2) {
    var i,
        xy1 = this.getArrayPosition(sq1),
        xy2 = this.getArrayPosition(sq2),
        x1,
        y1,
        x2,
        y2,
        piece,
        newSquare,
        is_en_passant = false,
        is_capturing_enemy,
        xDif,
        yDif,
        xInc,
        yInc,
        tempPosition;

    if (!(xy1 && xy2)) {
        return false;
    }

    x1 = parseInt(xy1.substr(0, 1), 10),
    y1 = parseInt(xy1.substr(1, 1), 10),
    x2 = parseInt(xy2.substr(0, 1), 10),
    y2 = parseInt(xy2.substr(1, 1), 10),
    piece = position.getPiece(sq1),
    newSquare = position.getPiece(sq2);

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
    while (!(x1 + i * xInc === x2 && y1 + i * yInc === y2)) {
        if (i > 8) {
            break;
        }
        if (!position.getPiece(y1 + i * yInc, x1 + i * xInc).isEmpty()) {
            return false;
        }
        i += 1;
    }

    return true;
};

CHESS.util.isLegalKingMove = function (position, sq1, sq2) {
    var piece = position.getPiece(sq1),
        newSquare = position.getPiece(sq2);

    // castling
    if (Math.abs(CHESS.Math.compareFile(sq1, sq2)) === 2) {
        if (piece.isWhite()) {
            if (sq2 === 'g1' && position.canWhiteCastleKingside() && position.getPiece('f1').isEmpty() && position.getPiece('g1').isEmpty()) {
                // castle kingside
                // check for checks
                if (this.isSquareAttacked(position, 4, 7, 'w')) {
                    return false;
                }
                if (this.isSquareAttacked(position, 5, 7, 'w')) {
                    return false;
                }
                if (this.isSquareAttacked(position, 6, 7, 'w')) {
                    return false;
                }
            } else if (sq2 === 'c1' && position.canWhiteCastleQueenside() && position.getPiece('d1').isEmpty() && position.getPiece('c1').isEmpty() && position.getPiece('b1').isEmpty()) {
                // castle queenside
                // check for checks
                if (this.isSquareAttacked(position, 2, 7, 'w')) {
                    return false;
                }
                if (this.isSquareAttacked(position, 3, 7, 'w')) {
                    return false;
                }
                if (this.isSquareAttacked(position, 4, 7, 'w')) {
                    return false;
                }
            } else {
                return false;
            }
        } else if (piece.isBlack()) {
            if (sq2 === 'g8' && position.canBlackCastleKingside() && position.getPiece('f8').isEmpty() && position.getPiece('g8').isEmpty()) {
                // castle kingside
                // check for checks
                if (this.isSquareAttacked(position, 4, 0, 'b')) {
                    return false;
                }
                if (this.isSquareAttacked(position, 5, 0, 'b')) {
                    return false;
                }
                if (this.isSquareAttacked(position, 6, 0, 'b')) {
                    return false;
                }
            } else if (sq2 === 'c8' && position.canBlackCastleQueenside() && position.getPiece('d8').isEmpty() && position.getPiece('c8').isEmpty() && position.getPiece('b8').isEmpty()) {
                // castle queenside
                // check for checks
                if (this.isSquareAttacked(position, 2, 0, 'b')) {
                    return false;
                }
                if (this.isSquareAttacked(position, 3, 0, 'b')) {
                    return false;
                }
                if (this.isSquareAttacked(position, 4, 0, 'b')) {
                    return false;
                }
            } else {
                return false;
            }
        }
    } else if (!CHESS.Math.isKingMove()) {
        return false;
    }

    return true;
};

CHESS.util.isLegalPawnMove = function (position, sq1, sq2) {
    var piece = position.getPiece(sq1),
        newSquare = position.getPiece(sq2);

    // pawns must move forward
    if (piece.isWhite() && CHESS.Math.compareRank(sq1, sq2) < 1) {
        return false;
    }
    if (piece.isBlack() && CHESS.Math.compareRank(sq1, sq2) > -1) {
        return false;
    }

    // pawns move 1 square (or 2 on first move)
    var rankDiff = CHESS.Math.compareRank(sq1, sq2);
    var moveOneSquare = Math.abs(rankDiff) === 1;
    var moveTwoSquares = Math.abs(rankDiff) === 2;
    var whiteUnblocked = position.getPiece(CHESS.Math.setRank(sq1, 3)).isEmpty();
    var blackUnblocked = position.getPiece(CHESS.Math.setRank(sq1, 6)).isEmpty();
    var whiteFirstMove = piece.isWhite() && /2/.test(sq1);
    var blackFirstMove = piece.isBlack() && /7/.test(sq1);
    if (!(moveOneSquare || (moveTwoSquares && (whiteFirstMove && whiteUnblocked || blackFirstMove && blackUnblocked)))) {
        return false;
    }

    // pawns cannot capture directly forward
    if (CHESS.Math.isSameFile(sq1, sq2) && !newSquare.isEmpty()) {
        return false;
    }

    // pawns cannot move horizontally unless capturing 1 square on a forward-diagonal
    if (!CHESS.Math.isSameFile(sq1, sq2)) {
        // if side to side movement, only the following situations are valid
        is_capturing_enemy = (!newSquare.isEmpty() && !newSquare.isColor(piece.getColor()));
        is_en_passant = position.getEnPassantSquare() === sq2;
        var oneFile = Math.abs(CHESS.Math.compareRank(sq1, sq2)) === 1;
        var oneRank = Math.abs(CHESS.Math.compareFile(sq1, sq2)) === 1;
        if (!(oneFile && oneRank && (is_capturing_enemy || is_en_passant))) {
            return false;
        }
    }

    return true;
};

CHESS.util.isCheck = function (position, pieceColor) {
    var i,
        j,
        kingX = 0,
        kingY = 0,
        piece;

    // Find the king
    for (i = 0; i < 8; i++) {
        for (j = 0; j < 8; j++) {
            piece = position.getPiece(i, j);
            if (piece.isKing() && piece.isColor(pieceColor)) {
                kingX = j;
                kingY = i;
            }
        }
    }

    return this.isSquareAttacked(position, kingX, kingY, pieceColor);
};

CHESS.util.isMate = function (pos) {
    var i,
        j,
        kingX = 0,
        kingY = 0,
        attacker_sq,
        attack_x,
        attack_y,
        friendly_attacker_sq,
        oppositeColor,
        piece,
        tempPosition = new CHESS.Position(pos.getFen());

    // Find king
    for (i = 0; i < 8; i++) {
        for (j = 0; j < 8; j++) {
            piece = tempPosition.getPiece(i, j);
            if (piece.isKing() && piece.getColor() === pos.getColorToMove()) {
                kingX = j;
                kingY = i;
            }
        }
    }
    attacker_sq = this.getAttacker(tempPosition, kingX, kingY, pos.getColorToMove());
    if (attacker_sq === '') {
        return false;
    }
    // Remove king from its current position
    tempPosition.setPiece(kingY, kingX, '');
    // Move up
    if (kingY > 0) {
        // Does it contain a friendly piece?
        if (tempPosition.getPiece(kingY - 1, kingX).getColor() !== pos.getColorToMove()) {
            if (!this.isSquareAttacked(tempPosition, kingX, kingY - 1, pos.getColorToMove())) {
                return false;
            }
        }
    }
    // Move down
    if (kingY < 7) {
        // Does it contain a friendly piece?
        if (tempPosition.getPiece(kingY + 1, kingX).getColor() !== pos.getColorToMove()) {
            if (!this.isSquareAttacked(tempPosition, kingX, kingY + 1, pos.getColorToMove())) {
                return false;
            }
        }
    }
    // Move left
    if (kingX > 0) {
        // Does it contain a friendly piece?
        if (tempPosition.getPiece(kingY, kingX - 1).getColor() !== pos.getColorToMove()) {
            if (!this.isSquareAttacked(tempPosition, kingX - 1, kingY, pos.getColorToMove())) {
                return false;
            }
        }
    }
    // Move right
    if (kingX < 7) {
        // Does it contain a friendly piece?
        if (tempPosition.getPiece(kingY, kingX + 1).getColor() !== pos.getColorToMove()) {
            if (!this.isSquareAttacked(tempPosition, kingX + 1, kingY, pos.getColorToMove())) {
                return false;
            }
        }
    }
    // Move up/left
    if (kingX > 0 && kingY > 0) {
        // Does it contain a friendly piece?
        if (tempPosition.getPiece(kingY - 1, kingX - 1).getColor() !== pos.getColorToMove()) {
            if (!this.isSquareAttacked(tempPosition, kingX - 1, kingY - 1, pos.getColorToMove())) {
                return false;
            }
        }
    }
    // Move up/right
    if (kingX < 7 && kingY > 0) {
        // Does it contain a friendly piece?
        if (tempPosition.getPiece(kingY - 1, kingX + 1).getColor() !== pos.getColorToMove()) {
            if (!this.isSquareAttacked(tempPosition, kingX + 1, kingY - 1, pos.getColorToMove())) {
                return false;
            }
        }
    }
    // Move down/left
    if (kingX > 0 && kingY < 7) {
        // Does it contain a friendly piece?
        if (tempPosition.getPiece(kingY + 1, kingX - 1).getColor() !== pos.getColorToMove()) {
            if (!this.isSquareAttacked(tempPosition, kingX - 1, kingY + 1, pos.getColorToMove())) {
                return false;
            }
        }
    }
    // Move down/right
    if (kingX < 7 && kingY < 7) {
        // Does it contain a friendly piece?
        if (tempPosition.getPiece(kingY + 1, kingX + 1).getColor() !== pos.getColorToMove()) {
            if (!this.isSquareAttacked(tempPosition, kingX + 1, kingY + 1, pos.getColorToMove())) {
                return false;
            }
        }
    }
    // Put king back since it cannot move
    tempPosition.setPiece(kingY, kingX, pos.getColorToMove() + 'k');

    // Is the attacking piece under attack?
    attack_x = parseInt(attacker_sq.substr(1, 1), 10);
    attack_y = parseInt(attacker_sq.substr(0, 1), 10);
    oppositeColor = 'b';
    if (pos.getColorToMove() === 'b') {
        oppositeColor = 'w';
    }
    friendly_attacker_sq = this.getAttacker(tempPosition, attack_x, attack_y, oppositeColor);
    if (friendly_attacker_sq !== '') {
        // Can the attacking piece be captured?
        var sq1 = this.reverseArrayPosition(friendly_attacker_sq);
        var sq2 = this.reverseArrayPosition(attacker_sq);
        if (this.isLegal(pos, sq1, sq2)) {
            return false;
        }
    }

    // Can the check be blocked?
    var attacker = tempPosition.getPiece(attack_y, attack_x);
    // Only if rook, bishop, or queen...
    if (attacker.isRook() || attacker.isBishop() || attacker.isQueen()) {
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
            tempPosition.setPiece(kingY, kingX, oppositeColor + 'k');
            while (a !== attack_x || b !== attack_y) {
                // Check this square for friendly attackers
                if (this.isSquareBlockable(tempPosition, a, b, oppositeColor)) {
                    return false;
                }
                a += x_direction;
                b += y_direction;
            }
        }
    }
    // Can en passant save the day?
    if (attacker.isPawn()) {
        // if attacker is vulnerable to en passant
        if (pos.isWhiteToMove() && attack_y === 3 && pos.getEnPassantSquare() === this.reverseArrayPosition((attack_y - 1) + '' + attack_x)) {
            // ... and if defender can execute en passant
            if (attack_x > 0 && tempPosition.getPiece(3, attack_x - 1).toString() === 'wp') {
                return false;
            }
            if (attack_x < 7 && tempPosition.getPiece(3, attack_x + 1).toString() === 'wp') {
                return false;
            }
        }
        // if attacker is vulnerable to en passant
        if (pos.isBlackToMove() && attack_y === 4 && pos.getEnPassantSquare() === this.reverseArrayPosition((attack_y + 1) + '' + attack_x)) {
            // ... and if defender can execute en passant
            if (attack_x > 0 && tempPosition.getPiece(4, attack_x - 1).toString() === 'bp') {
                return false;
            }
            if (attack_x < 7 && tempPosition.getPiece(4, attack_x + 1).toString() === 'bp') {
                return false;
            }
        }
    }
    return true;
};

CHESS.util.isSquareAttacked = function (position, kingX, kingY, pieceColor) {
    var i,
        attacker,
        piece;

    kingX = parseInt(kingX, 10);
    kingY = parseInt(kingY, 10);
    
    // Look for knight checks
    if (kingY > 0 && kingX > 1) {
        piece = position.getPiece(kingY - 1, kingX - 2);
        if (piece.isKnight() && !piece.isColor(pieceColor)) {
            return true;
        }
    }
    if (kingY > 0 && kingX < 6) {
        piece = position.getPiece(kingY - 1, kingX + 2);
        if (piece.isKnight() && !piece.isColor(pieceColor)) {
            return true;
        }
    }
    if (kingY < 7 && kingX > 1) {
        piece = position.getPiece(kingY + 1, kingX - 2);
        if (piece.isKnight() && !piece.isColor(pieceColor)) {
            return true;
        }
    }
    if (kingY < 7 && kingX < 6) {
        piece = position.getPiece(kingY + 1, kingX + 2);
        if (piece.isKnight() && !piece.isColor(pieceColor)) {
            return true;
        }
    }
    if (kingY > 1 && kingX > 0) {
        piece = position.getPiece(kingY - 2, kingX - 1);
        if (piece.isKnight() && !piece.isColor(pieceColor)) {
            return true;
        }
    }
    if (kingY > 1 && kingX < 7) {
        piece = position.getPiece(kingY - 2, kingX + 1);
        if (piece.isKnight() && !piece.isColor(pieceColor)) {
            return true;
        }
    }
    if (kingY < 6 && kingX > 0) {
        piece = position.getPiece(kingY + 2, kingX - 1);
        if (piece.isKnight() && !piece.isColor(pieceColor)) {
            return true;
        }
    }
    if (kingY < 6 && kingX < 7) {
        piece = position.getPiece(kingY + 2, kingX + 1);
        if (piece.isKnight() && !piece.isColor(pieceColor)) {
            return true;
        }
    }

    // Q/R/K checks: E
    i = 1;
    while (kingX + i < 8) {
        attacker = position.getPiece(kingY, kingX + i);
        if (!attacker.isEmpty() && !attacker.isColor(pieceColor) && (attacker.isRook() || attacker.isQueen() || (i === 1 && attacker.isKing()))) {
            return true;
        }
        if (!attacker.isEmpty()) {
            break;
        }
        i += 1;
    }
    // Q/R/K checks: W
    i = 1;
    while (kingX - i >= 0) {
        attacker = position.getPiece(kingY, kingX - i);
        if (!attacker.isEmpty() && !attacker.isColor(pieceColor) && (attacker.isRook() || attacker.isQueen() || (i === 1 && attacker.isKing()))) {
            return true;
        }
        if (!attacker.isEmpty()) {
            break;
        }
        i += 1;
    }
    // Q/R/K checks: N
    i = 1;
    while (kingY - i >= 0) {
        attacker = position.getPiece(kingY - i, kingX);
        if (!attacker.isEmpty() && !attacker.isColor(pieceColor) && (attacker.isRook() || attacker.isQueen() || (i === 1 && attacker.isKing()))) {
            return true;
        }
        if (!attacker.isEmpty()) {
            break;
        }
        i += 1;
    }
    // Q/R/K checks: S
    i = 1;
    while (kingY + i < 8) {
        attacker = position.getPiece(kingY + i, kingX);
        if (!attacker.isEmpty() && !attacker.isColor(pieceColor) && (attacker.isRook() || attacker.isQueen() || (i === 1 && attacker.isKing()))) {
            return true;
        }
        if (!attacker.isEmpty()) {
            break;
        }
        i += 1;
    }
    // Q/B/K checks: NE
    i = 1;
    while (kingX + i < 8 && kingY - i >= 0) {
        attacker = position.getPiece(kingY - i, kingX + i);
        if (!attacker.isEmpty() && !attacker.isColor(pieceColor) && (attacker.isQueen() || attacker.isBishop() || (i === 1 && attacker.isKing()))) {
            return true;
        }
        if (!attacker.isEmpty()) {
            break;
        }
        i += 1;
    }
    // Q/B/K checks: SE
    i = 1;
    while (kingX + i < 8 && kingY + i < 8) {
        attacker = position.getPiece(kingY + i, kingX + i);
        if (!attacker.isEmpty() && !attacker.isColor(pieceColor) && (attacker.isQueen() || attacker.isBishop() || (i === 1 && attacker.isKing()))) {
            return true;
        }
        if (!attacker.isEmpty()) {
            break;
        }
        i += 1;
    }
    // Q/B/K checks: SW
    i = 1;
    while (kingX - i >= 0 && kingY + i < 8) {
        attacker = position.getPiece(kingY + i, kingX - i);
        if (!attacker.isEmpty() && !attacker.isColor(pieceColor) && (attacker.isQueen() || attacker.isBishop() || (i === 1 && attacker.isKing()))) {
            return true;
        }
        if (!attacker.isEmpty()) {
            break;
        }
        i += 1;
    }
    // Q/B/K checks: NW
    i = 1;
    while (kingX - i >= 0 && kingY - i >= 0) {
        attacker = position.getPiece(kingY - i, kingX - i);
        if (!attacker.isEmpty() && !attacker.isColor(pieceColor) && (attacker.isQueen() || attacker.isBishop() || (i === 1 && attacker.isKing()))) {
            return true;
        }
        if (!attacker.isEmpty()) {
            break;
        }
        i += 1;
    }
    if (pieceColor === 'w') {
        // P checks: W
        if (kingX - 1 >= 0 && kingY - 1 >= 0) {
            attacker = position.getPiece(kingY - 1, kingX - 1);
            if (!attacker.isEmpty() && !attacker.isColor(pieceColor) && attacker.isPawn()) {
                return true;
            }
        }
        // P checks: E
        if (kingX + 1 < 8 && kingY - 1 >= 0) {
            attacker = position.getPiece(kingY - 1, kingX + 1);
            if (!attacker.isEmpty() && !attacker.isColor(pieceColor) && attacker.isPawn()) {
                return true;
            }
        }
    } else {
        // P checks: W
        if (kingX - 1 >= 0 && kingY + 1 < 8) {
            attacker = position.getPiece(kingY + 1, kingX - 1);
            if (!attacker.isEmpty() && !attacker.isColor(pieceColor) && attacker.isPawn()) {
                return true;
            }
        }
        // P checks: E
        if (kingX + 1 < 8 && kingY + 1 < 8) {
            attacker = position.getPiece(kingY + 1, kingX + 1);
            if (!attacker.isEmpty() && !attacker.isColor(pieceColor) && attacker.isPawn()) {
                return true;
            }
        }
    }
    return false;
};

CHESS.util.isSquareBlockable = function (position, squareX, squareY, pieceColor) {
    var i,
        attacker;

    squareX = parseInt(squareX, 10);
    squareY = parseInt(squareY, 10);

    // Look for knight blocks
    if (squareY > 0 && squareX > 1) {
        piece = position.getPiece(squareY - 1, squareX - 2);
        if (piece.isKnight() && piece.isColor(pieceColor)) {
            return true;
        }
    }
    if (squareY > 0 && squareX < 6) {
        piece = position.getPiece(squareY - 1, squareX + 2);
        if (piece.isKnight() && piece.isColor(pieceColor)) {
            return true;
        }
    }
    if (squareY < 7 && squareX > 1) {
        piece = position.getPiece(squareY + 1, squareX - 2);
        if (piece.isKnight() && piece.isColor(pieceColor)) {
            return true;
        }
    }
    if (squareY < 7 && squareX < 6) {
        piece = position.getPiece(squareY + 1, squareX + 2);
        if (piece.isKnight() && piece.isColor(pieceColor)) {
            return true;
        }
    }
    if (squareY > 1 && squareX > 0) {
        piece = position.getPiece(squareY - 2, squareX - 1);
        if (piece.isKnight() && piece.isColor(pieceColor)) {
            return true;
        }
    }
    if (squareY > 1 && squareX < 7) {
        piece = position.getPiece(squareY - 2, squareX + 1);
        if (piece.isKnight() && piece.isColor(pieceColor)) {
            return true;
        }
    }
    if (squareY < 6 && squareX > 0) {
        piece = position.getPiece(squareY + 2, squareX - 1);
        if (piece.isKnight() && piece.isColor(pieceColor)) {
            return true;
        }
    }
    if (squareY < 6 && squareX < 7) {
        piece = position.getPiece(squareY + 2, squareX + 1);
        if (piece.isKnight() && piece.isColor(pieceColor)) {
            return true;
        }
    }

    // Q/R blocks: E
    i = 1;
    while (squareX + i < 8) {
       attacker = position.getPiece(squareY, squareX + i);
       if (!attacker.isEmpty() && attacker.isColor(pieceColor) && (attacker.isRook() || attacker.isQueen())) {
           return true;
       }
       if (!attacker.isEmpty()) {
           break;
       }
       i += 1;
    }
    // Q/R blocks: W
    i = 1;
    while (squareX - i >= 0) {
       attacker = position.getPiece(squareY, squareX - i);
       if (!attacker.isEmpty() && attacker.isColor(pieceColor) && (attacker.isRook() || attacker.isQueen())) {
           return true;
       }
       if (!attacker.isEmpty()) {
           break;
       }
       i += 1;
    }
    // Q/R blocks: N
    i = 1;
    while (squareY - i >= 0) {
       attacker = position.getPiece(squareY - i, squareX);
       if (!attacker.isEmpty() && attacker.isColor(pieceColor) && (attacker.isRook() || attacker.isQueen())) {
           return true;
       }
       if (!attacker.isEmpty()) {
           break;
       }
       i += 1;
    }
    // Q/R blocks: S
    i = 1;
    while (squareY + i < 8) {
       attacker = position.getPiece(squareY + i, squareX);
       if (!attacker.isEmpty() && attacker.isColor(pieceColor) && (attacker.isRook() || attacker.isQueen())) {
           return true;
       }
       if (!attacker.isEmpty()) {
           break;
       }
       i += 1;
    }
    // Q/B blocks: NE
    i = 1;
    while (squareX + i < 8 && squareY - i >= 0) {
       attacker = position.getPiece(squareY - i, squareX + i);
       if (!attacker.isEmpty() && attacker.isColor(pieceColor) && (attacker.isQueen() || attacker.isBishop())) {
           return true;
       }
       if (!attacker.isEmpty()) {
           break;
       }
       i += 1;
    }
    // Q/B blocks: SE
    i = 1;
    while (squareX + i < 8 && squareY + i < 8) {
       attacker = position.getPiece(squareY + i, squareX + i);
       if (!attacker.isEmpty() && attacker.isColor(pieceColor) && (attacker.isQueen() || attacker.isBishop())) {
           return true;
       }
       if (!attacker.isEmpty()) {
           break;
       }
       i += 1;
    }
    // Q/B blocks: SW
    i = 1;
    while (squareX - i >= 0 && squareY + i < 8) {
       attacker = position.getPiece(squareY + i, squareX - i);
       if (!attacker.isEmpty() && attacker.isColor(pieceColor) && (attacker.isQueen() || attacker.isBishop())) {
           return true;
       }
       if (!attacker.isEmpty()) {
           break;
       }
       i += 1;
    }
    // Q/B blocks: NW
    i = 1;
    while (squareX - i >= 0 && squareY - i >= 0) {
       attacker = position.getPiece(squareY - i, squareX - i);
       if (!attacker.isEmpty() && attacker.isColor(pieceColor) && (attacker.isQueen() || attacker.isBishop())) {
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
            attacker = position.getPiece(squareY - 1, squareX);
            if (!attacker.isEmpty() && !attacker.getColor(pieceColor) && attacker.isPawn()) {
                return true;
            }
        }
        // P blocks: 2 squares
        if (squareY === 3 && position.getPiece(2, squareX).isEmpty()) {
            attacker = position.getPiece(1, squareX);
            if (!attacker.isEmpty() && attacker.isColor(pieceColor) && attacker.isPawn()) {
                return true;
            }
        }
     } else {
        // P blocks: 1 square
         if (squareY + 1 < 8) {
            attacker = position.getPiece(squareY + 1, squareX);
            if (!attacker.isEmpty() && attacker.isColor(pieceColor) && attacker.isPawn()) {
                return true;
            }
         }
         // P blocks: 2 squares
        if (squareY === 4 && position.getPiece(5, squareX).isEmpty()) {
            attacker = position(6, squareX);
            if (!attacker.isEmpty() && attacker.isColor(pieceColor) && attacker.isPawn()) {
                return true;
            }
        }
     }
    return false;
};

CHESS.util.getAttacker = function (tempPosition, squareX, squareY, pieceColor) {
    var i,
        attacker;

    squareX = parseInt(squareX, 10);
    squareY = parseInt(squareY, 10);
    
    // Look for knight checks
    if (squareY > 0 && squareX > 1) {
        attacker = tempPosition.getPiece(squareY - 1, squareX - 2);
        if (attacker.isKnight() && !attacker.isColor(pieceColor)) {
            return (squareY - 1) + '' + (squareX - 2);
        }
    }
    if (squareY > 0 && squareX < 6) {
        attacker = tempPosition.getPiece(squareY - 1, squareX + 2);
        if (attacker.isKnight() && !attacker.isColor(pieceColor)) {
            return (squareY - 1) + '' + (squareX + 2);
        }
    }
    if (squareY < 7 && squareX > 1) {
        attacker = tempPosition.getPiece(squareY + 1, squareX - 2);
        if (attacker.isKnight() && !attacker.isColor(pieceColor)) {
            return (squareY + 1) + '' + (squareX - 2);
        }
    }
    if (squareY < 7 && squareX < 6) {
        attacker = tempPosition.getPiece(squareY + 1, squareX + 2);
        if (attacker.isKnight() && !attacker.isColor(pieceColor)) {
            return (squareY + 1) + '' + (squareX + 2);
        }
    }
    if (squareY > 1 && squareX > 0) {
        attacker = tempPosition.getPiece(squareY - 2, squareX - 1);
        if (attacker.isKnight() && !attacker.isColor(pieceColor)) {
            return (squareY - 2) + '' + (squareX - 1);
        }
    }
    if (squareY > 1 && squareX < 7) {
        attacker = tempPosition.getPiece(squareY - 2, squareX + 1);
        if (attacker.isKnight() && !attacker.isColor(pieceColor)) {
            return (squareY - 2) + '' + (squareX + 1);
        }
    }
    if (squareY < 6 && squareX > 0) {
        attacker = tempPosition.getPiece(squareY + 2, squareX - 1);
        if (attacker.isKnight() && !attacker.isColor(pieceColor)) {
            return (squareY + 2) + '' + (squareX - 1);
        }
    }
    if (squareY < 6 && squareX < 7) {
        attacker = tempPosition.getPiece(squareY + 2, squareX + 1);
        if (attacker.isKnight() && !attacker.isColor(pieceColor)) {
            return (squareY + 2) + '' + (squareX + 1);
        }
    }

    // Q/R/K checks: E
    i = 1;
    while (squareX + i < 8) {
        attacker = tempPosition.getPiece(squareY, squareX + i);
        if (!attacker.isEmpty()) {
            if (!attacker.isColor(pieceColor) && (attacker.isRook() || attacker.isQueen() || (i === 1 && attacker.isKing()))) {
                return (squareY) + '' + (squareX + i);
            }
            break;
        }
        i += 1;
    }
    // Q/R/K checks: W
    i = 1;
    while (squareX - i >= 0) {
        attacker = tempPosition.getPiece(squareY, squareX - i);
        if (!attacker.isEmpty()) {
            if (!attacker.isColor(pieceColor) && (attacker.isRook() || attacker.isQueen() || (i === 1 && attacker.isKing()))) {
                return (squareY) + '' + (squareX - i);
            }
            break;
        }
        i += 1;
    }
    // Q/R/K checks: N
    i = 1;
    while (squareY - i >= 0) {
        attacker = tempPosition.getPiece(squareY - i, squareX);
        if (!attacker.isEmpty()) {
            if (!attacker.isColor(pieceColor) && (attacker.isRook() || attacker.isQueen() || (i === 1 && attacker.isKing()))) {
                return (squareY - i) + '' + (squareX);
            }
            break;
        }
        i += 1;
    }
    // Q/R/K checks: S
    i = 1;
    while (squareY + i < 8) {
        attacker = tempPosition.getPiece(squareY + i, squareX);
        if (!attacker.isEmpty()) {
            if (!attacker.isColor(pieceColor) && (attacker.isRook() || attacker.isQueen() || (i === 1 && attacker.isKing()))) {
                return (squareY + i) + '' + (squareX);
            }
            break;
        }
        i += 1;
    }
    // Q/B/K checks: NE
    i = 1;
    while (squareX + i < 8 && squareY - i >= 0) {
        attacker = tempPosition.getPiece(squareY - i, squareX + i);
        if (!attacker.isEmpty()) {
            if (!attacker.isColor(pieceColor) && (attacker.isQueen() || attacker.isBishop() || (i === 1 && attacker.isKing()))) {
                return (squareY - i) + '' + (squareX + i);
            }
            break;
        }
        i += 1;
    }
    // Q/B/K checks: SE
    i = 1;
    while (squareX + i < 8 && squareY + i < 8) {
        attacker = tempPosition.getPiece(squareY + i, squareX + i);
        if (!attacker.isEmpty()) {
            if (!attacker.isColor(pieceColor) && (attacker.isQueen() || attacker.isBishop() || (i === 1 && attacker.isKing()))) {
                return (squareY + i) + '' + (squareX + i);
            }
            break;
        }
        i += 1;
    }
    // Q/B/K checks: SW
    i = 1;
    while (squareX - i >= 0 && squareY + i < 8) {
        attacker = tempPosition.getPiece(squareY + i, squareX - i);
        if (!attacker.isEmpty()) {
            if (!attacker.isColor(pieceColor) && (attacker.isQueen() || attacker.isBishop() || (i === 1 && attacker.isKing()))) {
                return (squareY + i) + '' + (squareX - i);
            }
            break;
        }
        i += 1;
    }
    // Q/B/K checks: NW
    i = 1;
    while (squareX - i >= 0 && squareY - i >= 0) {
        attacker = tempPosition.getPiece(squareY - i, squareX - i);
        if (!attacker.isEmpty()) {
            if (!attacker.isColor(pieceColor) && (attacker.isQueen() || attacker.isBishop() || (i === 1 && attacker.isKing()))) {
                return (squareY - i) + '' + (squareX - i);
            }
            break;
        }
        i += 1;
    }
     if (pieceColor === 'w') {
        // P checks: W
         if (squareX - 1 > 0 && squareY - 1 >= 0) {
            attacker = tempPosition.getPiece(squareY - 1, squareX - 1);
            if (!attacker.isEmpty() && !attacker.isColor(pieceColor) && attacker.isPawn()) {
                return (squareY - 1) + '' + (squareX - 1);
            }
         }
         // P checks: E
         if (squareX + 1 < 8 && squareY - 1 >= 0) {
            attacker = tempPosition.getPiece(squareY - 1, squareX + 1);
            if (!attacker.isEmpty() && !attacker.isColor(pieceColor) && attacker.isPawn()) {
                return (squareY - 1) + '' + (squareX + 1);
            }
         }
    } else {
        // P checks: W
         if (squareX - 1 >= 0 && squareY + 1 < 8) {
            attacker = tempPosition.getPiece(squareY + 1, squareX - 1);
            if (!attacker.isEmpty() && !attacker.isColor(pieceColor) && attacker.isPawn()) {
                return (squareY + 1) + '' + (squareX - 1);
            }
         }
         // P checks: E
         if (squareX + 1 < 8 && squareY + 1 < 8) {
            attacker = tempPosition.getPiece(squareY + 1, squareX + 1);
            if (!attacker.isEmpty() && !attacker.isColor(pieceColor) && attacker.isPawn()) {
                return (squareY + 1) + '' + (squareX + 1);
            }
         }
    }
    return '';
};

CHESS.util.isStalemate = function (pos) {
    var is_stalemate = !this.getLegalMoves(pos, true);
    return is_stalemate;
};

CHESS.util.isInsufficientMaterial = function (pos) {
    // For now, this does not include:
    // * Perpetual check
    // * Perpetual pursuit
    // * Blockade
    // * Fortress
    // * Drawing balance of forces

    var i,
        is_im = false,
        fen,
        w_has_q,
        w_has_r,
        w_has_p,
        w_has_bn,
        w_has_bb,
        b_has_q,
        b_has_r,
        b_has_p,
        b_has_bn,
        b_has_bb;

    fen = this.getFEN(pos).split(' ')[0];

    // Count white pieces
    if (/Q/.test(fen)) {
        w_has_q = true;
    }
    if (/R/.test(fen)) {
        w_has_r = true;
    }
    if (/B/.test(fen) && /N/.test(fen)) {
        w_has_bn = true;
    }
    if (/P/.test(fen)) {
        w_has_p = true;
    }
    i = fen.indexOf('B');
    if (i !== -1 && fen.indexOf('B', i + 1) !== -1) {
        w_has_bb = true;
    }

    // Count black pieces
    if (/q/.test(fen)) {
        w_has_q = true;
    }
    if (/r/.test(fen)) {
        w_has_r = true;
    }
    if (/b/.test(fen) && /n/.test(fen)) {
        w_has_bn = true;
    }
    if (/p/.test(fen)) {
        w_has_p = true;
    }
    i = fen.indexOf('b');
    if (i !== -1 && fen.indexOf('b', i + 1) !== -1) {
        w_has_bb = true;
    }

    if (!w_has_q && !w_has_r && !w_has_p && !w_has_bb && !w_has_bn &&
            !b_has_q && !b_has_r && !b_has_p && !b_has_bb && !b_has_bn) {
        is_im = true;
    }

    // TODO: complete

    return is_im;
};

CHESS.util.getLegalMoves = function (pos, return_bool) {
    var i,
        j,
        sq1,
        sq2,
        move = '',
        move_list = [],
        color = (pos.isWhiteToMove() ? 'w' : 'b'),
        dir,
        sq = 0,
        en_passant_x,
        piece;

    for (i = 0; i < 8; i++) {
        for (j = 0; j < 8; j++) {
            sq1 = this.reverseArrayPosition (i + '' + j);
            piece = pos.getPiece(i, j);
            if (!piece.isColor(color)) {
                continue;
            }

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
                if (/[a-h][1-8]/.test(pos.getEnPassantSquare())) {
                    en_passant_x = parseInt(this.getArrayPosition(pos.getEnPassantSquare()).substr(0, 1), 10);
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

CHESS.util.getLongNotation = function (pos, short_notation) {
    var i,
        j,
        long_move = '',
        sq1,
        sq2 = short_notation.replace(/[#+=xKQRBN]/g, ''),
        color = (pos.isWhiteToMove() ? 'w' : 'b'),
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
            if (sq1_info_type === 'rank' && parseInt(sq1_info, 10) !== (8 - i)) {
                continue;
            } else if (sq1_info_type === 'file' && parseInt(sq1_info, 10) !== j) {
                continue;
            }
            // Locate a potential piece
            if (pos.getPiece(i, j).toString() === color + piece) {
                sq1 = this.reverseArrayPosition(i + '' + j);
                if (this.isLegal(pos, sq1, sq2)) {
                    long_move = sq1 + '-' + sq2;
                }
            }
        }
    }
    return long_move;
};

CHESS.util.getArrayPosition = function (sq) {
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

CHESS.util.reverseArrayPosition = function (xy) {
    var x = parseInt(xy.substr(1, 1), 10),
        y = parseInt(xy.substr(0, 1), 10);
    x = String.fromCharCode(x + 97);
    y = 8 - y;
    return x + '' + y;
};

CHESS.util.moveTemp = function (pos, sq1, sq2) {
    CHESS.util.move(pos, sq1, sq2);
};

CHESS.util.move = function (pos, sq1, sq2, promotion) {
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

    if (!this.isLegal(pos, sq1, sq2)) {
        return false;
    }

    if (promotion !== undefined) {
        promotion = promotion.toLowerCase();
    }

    // Update game values
    pos.last_move = {'sq1':this.getArrayPosition(sq1), 'sq2':this.getArrayPosition(sq2)};

    if (pos.isWhiteToMove()) {
        w_sq1 = sq1;
        w_sq2 = sq2;
        w_xy1 = this.getArrayPosition(w_sq1);
        w_xy2 = this.getArrayPosition(w_sq2);
        w_x1 = parseInt(w_xy1.substr(0, 1), 10);
        w_y1 = parseInt(w_xy1.substr(1, 1), 10);
        w_x2 = parseInt(w_xy2.substr(0, 1), 10);
        w_y2 = parseInt(w_xy2.substr(1, 1), 10);
        captured_piece = pos.getPiece(w_y2, w_x2);
        piece = pos.getPiece(w_y1, w_x1);
        pos.setPiece(w_y2, w_x2, piece.toString());
        pos.setPiece(w_y1, w_x1, '');
        // Pawn is eligible to be captured en passant
        w_xy1 = this.getArrayPosition(w_sq1);
        if (piece.isWhite() && piece.isPawn() && w_y2 - w_y1 === -2) {
            pos.setEnPassantSquare(this.reverseArrayPosition((w_y2 + 1) + '' + w_x2));
        } else {
            pos.setEnPassantSquare();
        }
        // En passant
        if (piece.isWhite() && piece.isPawn() && w_x2 !== w_x1 && captured_piece.isEmpty()) {
            pos.setPiece(w_y1, w_x2, '');
            pawn_sq = w_sq2.substr(0, 1) + w_sq1.substr(1, 1);
        }
        // Pawn promotion
        if (piece.isWhite() && piece.isPawn() && w_y2 === 0) {
            if (promotion === 'r') {
                pos.setPiece(w_y2, w_x2, 'wq');
            } else if (promotion === 'b') {
                pos.setPiece(w_y2, w_x2, 'wb');
            } else if (promotion === 'n') {
                pos.setPiece(w_y2, w_x2, 'wn');
            } else {
                pos.setPiece(w_y2, w_x2, 'wq');
            }
        }
        // Castling
        if (piece.isWhite() && piece.isKing() && w_sq1 === 'e1') {
            if (w_sq2 === 'g1') {
                pos.setPiece(7, 5, 'wrk');
                pos.setPiece(7, 7, '');
            } else if (w_sq2 === 'c1') {
                pos.setPiece(7, 3, 'wrq');
                pos.setPiece(7, 0, '');
            }
        }
        // Lose castling ability
        if (piece.isWhite() && piece.isKing()) {
            pos.setWhiteCastleKingside(false);
            pos.setWhiteCastleQueenside(false);
        } else if (piece.isWhite() && piece.isRook() && w_sq1 === 'h1') {
            pos.setWhiteCastleKingside(false);
        } else if (piece.isWhite() && piece.isRook() && w_sq1 === 'a1') {
            pos.setWhiteCastleQueenside(false);
        } else if (captured_piece.isBlack() && captured_piece.isRook() && w_sq2 === 'a8') {
            pos.setBlackCastleQueenside(false);
        } else if (captured_piece.isBlack() && captured_piece.isRook() && w_sq2 === 'h8') {
            pos.setBlackCastleKingside(false);
        }
        pos.setBlackToMove();
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
        captured_piece = pos.getPiece(b_y2, b_x2);
        piece = pos.getPiece(b_y1, b_x1);
        pos.setPiece(b_y2, b_x2, pos.getPiece(b_y1, b_x1).toString());
        pos.setPiece(b_y1, b_x1, '');
        // Pawn is eligible to be captured en passant
        b_xy1 = this.getArrayPosition(b_sq1);
        if (piece.isBlack() && piece.isPawn() && b_y2 - b_y1 === 2) {
            pos.setEnPassantSquare(this.reverseArrayPosition((b_y2 - 1) + '' + b_x2));
        } else {
            pos.setEnPassantSquare('');
        }
        // En passant
        if (piece.isBlack() && piece.isPawn() && b_x2 !== b_x1 && captured_piece.isEmpty()) {
            pos.setPiece(b_y1, b_x2, '');
            pawn_sq = b_sq2.substr(0, 1) + b_sq1.substr(1, 1);
        }
        // Pawn promotion
        if (piece.isBlack() && piece.isPawn() && b_y2 === 7) {
            if (promotion === 'r') {
                pos.setPiece(b_y2, b_x2, 'bq');
            } else if (promotion === 'b') {
                pos.setPiece(b_y2, b_x2, 'bb');
            } else if (promotion === 'n') {
                pos.setPiece(b_y2, b_x2, 'bn');
            } else {
                pos.setPiece(b_y2, b_x2, 'bq');
            }
        }
        // Castling
        if (piece.isBlack() && piece.isKing() && b_sq1 === 'e8') {
            if (b_sq2 === 'g8') {
                pos.setPiece(0, 5, 'brk');
                pos.setPiece(0, 7, '');
            } else if (b_sq2 === 'c8') {
                pos.setPiece(0, 3, 'brq');
                pos.setPiece(0, 0, '');
            }
        }
        // Lose castling ability
        if (piece.isBlack() && piece.isKing()) {
            pos.setBlackCastleKingside(false);
            pos.setBlackCastleQueenside(false);
        } else if (piece.isBlack() && piece.isRook() && b_sq1 === 'h8') {
            pos.setBlackCastleKingside(false);
        } else if (piece.isBlack() && piece.isRook() && b_sq1 === 'a8') {
            pos.setBlackCastleQueenside(false);
        } else if (captured_piece.isWhite() && captured_piece.isRook() && b_sq2 === 'a1') {
            pos.setWhiteCastleQueenside(false);
        } else if (captured_piece.isWhite() && captured_piece.isRook() && b_sq2 === 'h1') {
            pos.setWhiteCastleKingside(false);
        }
        pos.setWhiteToMove();
    }

    if (this.gameIsOver(pos)) {
        pos.active = false;
    }

    return true;
};

CHESS.util.gameIsOver = function (pos) {
    return this.isMate(pos) || this.isStalemate(pos);
};

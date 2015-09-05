var CHESS = CHESS || {};

/**
 * Utility library
 */
CHESS.Engine = function ($) {

$.Engine = {};

$.Engine.getAttackers = function (position, square, pieceColor) {
    var attackers = [];

    attackers = attackers.concat(
        this.getBishopAttackers(position, square, pieceColor),
        this.getKingAttackers(position, square, pieceColor),
        this.getKnightAttackers(position, square, pieceColor),
        this.getPawnAttackers(position, square, pieceColor),
        this.getQueenAttackers(position, square, pieceColor),
        this.getRookAttackers(position, square, pieceColor)
    );

    return attackers;
};

$.Engine.getBishopAttackers = function (position, square, pieceColor) {
    var adjustMap = [
            {'rank': 1, 'file': 1},
            {'rank': 1, 'file': -1},
            {'rank': -1, 'file': 1},
            {'rank': -1, 'file': -1}
        ],
        adjust,
        attackers = [],
        i,
        j,
        newSquare,
        piece;

    for (i = 0; i < adjustMap.length; i++) {
        adjust = adjustMap[i];
        for (j = 1; j < 8; j++) {
            newSquare = square.clone();
            if (newSquare.addRank(adjust.rank * j) && newSquare.addFile(adjust.file * j)) {
                piece = position.getPiece(newSquare);
                if (!piece.isEmpty()) {
                    if (piece.isBishop() && piece.isColor(pieceColor)) {
                        attackers.push(newSquare);
                    }
                    break;
                }
            }
        }
    }

    return attackers;
};

$.Engine.getKingAttackers = function (position, square, pieceColor) {
    var adjustMap = [
            {'rank': 1, 'file': 1},
            {'rank': 1, 'file': 0},
            {'rank': 1, 'file': -1},
            {'rank': 0, 'file': 1},
            {'rank': 0, 'file': 0},
            {'rank': 0, 'file': -1},
            {'rank': -1, 'file': 1},
            {'rank': -1, 'file': 0},
            {'rank': -1, 'file': -1}
        ],
        adjust,
        attackers = [],
        i,
        newSquare,
        piece;

    for (i = 0; i < adjustMap.length; i++) {
        adjust = adjustMap[i];
        newSquare = square.clone();
        if (newSquare.addRank(adjust.rank) && newSquare.addFile(adjust.file)) {
            piece = position.getPiece(newSquare);
            if (piece.isKing() && piece.isColor(pieceColor)) {
                attackers.push(newSquare);
            }
        }
    }

    return attackers;
};

$.Engine.getKnightAttackers = function (position, square, pieceColor) {
    var adjustMap = [
            {'rank': 1, 'file': 2},
            {'rank': 1, 'file': -2},
            {'rank': 2, 'file': 1},
            {'rank': 2, 'file': -1},
            {'rank': -1, 'file': 2},
            {'rank': -1, 'file': -2},
            {'rank': -2, 'file': 1},
            {'rank': -2, 'file': -1}
        ],
        adjust,
        attackers = [],
        i,
        newSquare,
        piece;

    for (i = 0; i < adjustMap.length; i++) {
        adjust = adjustMap[i];
        newSquare = square.clone();
        if (newSquare.addRank(adjust.rank) && newSquare.addFile(adjust.file)) {
            piece = position.getPiece(newSquare);
            if (piece.isKnight() && piece.isColor(pieceColor)) {
                attackers.push(newSquare);
            }
        }
    }

    return attackers;
};

$.Engine.getPawnAttackers = function (position, square, pieceColor) {
    var adjustMap = [
            {'rank': 1, 'file': 1},
            {'rank': 1, 'file': -1}
        ],
        adjust,
        attackers = [],
        i,
        newSquare,
        piece;

        for (i = 0; i < adjustMap.length; i++) {
            adjust = adjustMap[i];
            if (pieceColor === 'w') {
                adjust.rank *= -1;
            }

            newSquare = square.clone();
            if (newSquare.addRank(adjust.rank) && newSquare.addFile(adjust.file)) {
                piece = position.getPiece(newSquare);
                if (piece.isPawn() && piece.isColor(pieceColor)) {
                    attackers.push(newSquare);
                }
            }
        }

    return attackers;
};

$.Engine.getQueenAttackers = function (position, square, pieceColor) {
    var adjustMap = [
            {'rank': 1, 'file': 1},
            {'rank': 1, 'file': -1},
            {'rank': -1, 'file': 1},
            {'rank': -1, 'file': -1},
            {'rank': 1, 'file': 0},
            {'rank': -1, 'file': 0},
            {'rank': 0, 'file': 1},
            {'rank': 0, 'file': -1}
        ],
        adjust,
        attackers = [],
        i,
        j,
        newSquare,
        piece;

    for (i = 0; i < adjustMap.length; i++) {
        adjust = adjustMap[i];
        for (j = 1; j < 8; j++) {
            newSquare = square.clone();
            if (newSquare.addRank(adjust.rank * j) && newSquare.addFile(adjust.file * j)) {
                piece = position.getPiece(newSquare);
                if (!piece.isEmpty()) {
                    if (piece.isQueen() && piece.isColor(pieceColor)) {
                        attackers.push(newSquare);
                    }
                    break;
                }
            }
        }
    }

    return attackers;
};

$.Engine.getRookAttackers = function (position, square, pieceColor) {
    var adjustMap = [
            {'rank': 1, 'file': 0},
            {'rank': -1, 'file': 0},
            {'rank': 0, 'file': 1},
            {'rank': 0, 'file': -1}
        ],
        adjust,
        attackers = [],
        i,
        j,
        newSquare,
        piece;

    for (i = 0; i < adjustMap.length; i++) {
        adjust = adjustMap[i];
        for (j = 1; j < 8; j++) {
            newSquare = square.clone();
            if (newSquare.addRank(adjust.rank * j) && newSquare.addFile(adjust.file * j)) {
                piece = position.getPiece(newSquare);
                if (!piece.isEmpty()) {
                    if (piece.isRook() && piece.isColor(pieceColor)) {
                        attackers.push(newSquare);
                    }
                    break;
                }
            }
        }
    }

    return attackers;
};

$.Engine.isLegal = function (position, move) {
    var newPiece,
        piece,
        startSquare = move.getStartSquare(),
        endSquare = move.getEndSquare(),
        testPosition;

    if (startSquare.isNull() || endSquare.isNull()) {
        return false;
    }

    piece = position.getPiece(startSquare),
    newPiece = position.getPiece(endSquare);
 
    if (!piece.isColor(position.getColorToMove())) {
        return false;
    }

    if (!newPiece.isEmpty() && newPiece.isColor(piece.getColor())) {
        return false;
    }

    if (piece.isKing() && !this.isLegalKingMove(position, move)) {
        return false;
    }

    if (piece.isPawn() && !this.isLegalPawnMove(position, move)) {
        return false;
    }

    if (piece.isKnight() && !startSquare.isKnightMove(endSquare)) {
        return false;
    }

    if (piece.isRook() && !startSquare.isRookMove(endSquare)) {
        return false;
    }

    if (piece.isBishop() && !startSquare.isBishopMove(endSquare)) {
        return false;
    }

    if (piece.isQueen() && !startSquare.isQueenMove(endSquare)) {
        return false;
    }

    if (piece.isQueen() || piece.isBishop() || piece.isRook()) {
        if (!this.isClearPath(position, move)) {
            return false;
        }
    }

    testPosition = this.testMove(position, move);
    if (this.isCheck(testPosition)) {
        return false;
    }

    return true;
};

$.Engine.isClearPath = function (position, move) {
    var startSquare = move.getStartSquare(),
        endSquare = move.getEndSquare();

    while (startSquare.stepTo(endSquare)) {
        if (startSquare.equals(endSquare)) {
            break;
        }
        if (!position.getPiece(startSquare).isEmpty()) {
            return false;
        }
    }

    return true;
};

$.Engine.isLegalKingMove = function (position, move) {
    var startSquare = move.getStartSquare(),
        endSquare = move.getEndSquare(),
        piece = position.getPiece(startSquare),
        newPiece = position.getPiece(endSquare);

    // castling
    if (startSquare.compareFile(endSquare) === 2) {
        if (piece.isWhite()) {
            if (endSquare.getName() === 'g1' && position.canWhiteCastleKingside() && position.getPiece(new $.Square('f1')).isEmpty() && position.getPiece(new $.Square('g1')).isEmpty()) {
                // castle kingside
                // check for checks
                if (this.isSquareAttacked(position, new $.Square('e1'), 'b')) {
                    return false;
                }
                if (this.isSquareAttacked(position, new $.Square('f1'), 'b')) {
                    return false;
                }
                if (this.isSquareAttacked(position, new $.Square('g1'), 'b')) {
                    return false;
                }
            } else if (endSquare.getName() === 'c1' && position.canWhiteCastleQueenside() && position.getPiece(new $.Square('d1')).isEmpty() && position.getPiece(new $.Square('c1')).isEmpty() && position.getPiece(new $.Square('b1')).isEmpty()) {
                // castle queenside
                // check for checks
                if (this.isSquareAttacked(position, new $.Square('c1'), 'b')) {
                    return false;
                }
                if (this.isSquareAttacked(position, new $.Square('d1'), 'b')) {
                    return false;
                }
                if (this.isSquareAttacked(position, new $.Square('e1'), 'b')) {
                    return false;
                }
            } else {
                return false;
            }
        } else if (piece.isBlack()) {
            if (endSquare.getName() === 'g8' && position.canBlackCastleKingside() && position.getPiece(new $.Square('f8')).isEmpty() && position.getPiece(new $.Square('g8')).isEmpty()) {
                // castle kingside
                // check for checks
                if (this.isSquareAttacked(position, new $.Square('e8'), 'w')) {
                    return false;
                }
                if (this.isSquareAttacked(position, new $.Square('f8'), 'w')) {
                    return false;
                }
                if (this.isSquareAttacked(position, new $.Square('g8'), 'w')) {
                    return false;
                }
            } else if (endSquare.getName() === 'c8' && position.canBlackCastleQueenside() && position.getPiece(new $.Square('d8')).isEmpty() && position.getPiece(new $.Square('c8')).isEmpty() && position.getPiece(new $.Square('b8')).isEmpty()) {
                // castle queenside
                // check for checks
                if (this.isSquareAttacked(position, new $.Square('b8'), 'w')) {
                    return false;
                }
                if (this.isSquareAttacked(position, new $.Square('c8'), 'w')) {
                    return false;
                }
                if (this.isSquareAttacked(position, new $.Square('d8'), 'w')) {
                    return false;
                }
            } else {
                return false;
            }
        }
    } else if (!startSquare.isKingMove(endSquare)) {
        return false;
    }

    return true;
};

$.Engine.isLegalPawnMove = function (position, move) {
    var startSquare = move.getStartSquare(),
        endSquare = move.getEndSquare(),
        piece = position.getPiece(startSquare),
        newPiece = position.getPiece(endSquare);

    // pawns must move forward
    if (piece.isWhite() && startSquare.diffRank(endSquare) < 1) {
        return false;
    }
    if (piece.isBlack() && startSquare.diffRank(endSquare) > -1) {
        return false;
    }

    // pawns move 1 square (or 2 on first move)
    var rankDiff = startSquare.compareRank(endSquare);
    var moveOneSquare = (rankDiff === 1);
    var moveTwoSquares = (rankDiff === 2);
    var blockSquare;
    blockSquare = startSquare.clone();
    blockSquare.setRank(3);
    var whiteUnblocked = position.getPiece(blockSquare).isEmpty();
    blockSquare = startSquare.clone();
    blockSquare.setRank(6);
    var blackUnblocked = position.getPiece(blockSquare).isEmpty();
    var whiteFirstMove = (piece.isWhite() && startSquare.getRank() === '2');
    var blackFirstMove = (piece.isBlack() && startSquare.getRank() === '7');
    if (!(moveOneSquare || (moveTwoSquares && (whiteFirstMove && whiteUnblocked || blackFirstMove && blackUnblocked)))) {
        return false;
    }

    // pawns cannot capture directly forward
    if (startSquare.isSameFile(endSquare) && !newPiece.isEmpty()) {
        return false;
    }

    // pawns cannot move horizontally unless capturing 1 square on a forward-diagonal
    if (!startSquare.isSameFile(endSquare)) {
        // if side to side movement, only the following situations are valid
        is_capturing_enemy = (!newPiece.isEmpty() && !newPiece.isColor(piece.getColor()));
        is_en_passant = endSquare.equals(position.getEnPassantSquare());
        var oneRank = (startSquare.compareRank(endSquare) === 1);
        var oneFile = (startSquare.compareFile(endSquare) === 1);
        if (!(oneFile && oneRank && (is_capturing_enemy || is_en_passant))) {
            return false;
        }
    }

    return true;
};

$.Engine.isCheck = function (position) {
    var kingSquare = position.findPiece(position.getColorToMove() + 'k')[0];
    return this.isSquareAttacked(position, kingSquare, position.getColorNotToMove());
};

$.Engine.isMate = function (position) {
    var attackerSquare,
        attackerList,
        enPassantSquare,
        friend,
        move,
        newSquare,
        piece,
        square,
        squareList,
        tempPosition = position.clone();

    // Find king
    squareList = position.findPiece(position.getColorToMove() + 'k');
    if (squareList.length < 1) {
        return false;
    }
    square = squareList[0];
    if (square.isNull()) {
        return false;
    }

    attackerList = this.getAttackers(tempPosition, square, position.getColorNotToMove());
    // TODO Handle double check scenario
    if (attackerList.length < 1) {
        return false;
    }
    attackerSquare = attackerList[0];

    // Remove king from its current position
    tempPosition.setPiece(square, '', '');

    // Move up
    newSquare = square.clone();
    if (newSquare.addRank(1)) {
        // Does it contain a friendly piece?
        if (tempPosition.getPiece(newSquare).getColor() !== position.getColorToMove()) {
            if (!this.isSquareAttacked(tempPosition, newSquare, position.getColorNotToMove())) {
                return false;
            }
        }
    }

    // Move down
    newSquare = square.clone();
    if (newSquare.addRank(-1)) {
        if (tempPosition.getPiece(newSquare).getColor() !== position.getColorToMove()) {
            if (!this.isSquareAttacked(tempPosition, newSquare, position.getColorNotToMove())) {
                return false;
            }
        }
    }

    // Move left
    newSquare = square.clone();
    if (newSquare.addFile(-1)) {
        if (tempPosition.getPiece(newSquare).getColor() !== position.getColorToMove()) {
            if (!this.isSquareAttacked(tempPosition, newSquare, position.getColorNotToMove())) {
                return false;
            }
        }
    }

    // Move right
    newSquare = square.clone();
    if (newSquare.addFile(1)) {
        if (tempPosition.getPiece(newSquare).getColor() !== position.getColorToMove()) {
            if (!this.isSquareAttacked(tempPosition, newSquare, position.getColorNotToMove())) {
                return false;
            }
        }
    }

    // Move up/left
    newSquare = square.clone();
    if (newSquare.addRank(1) && newSquare.addFile(-1)) {
        if (tempPosition.getPiece(newSquare).getColor() !== position.getColorToMove()) {
            if (!this.isSquareAttacked(tempPosition, newSquare, position.getColorNotToMove())) {
                return false;
            }
        }
    }

    // Move up/right
    newSquare = square.clone();
    if (newSquare.addRank(1) && newSquare.addFile(1)) {
        if (tempPosition.getPiece(newSquare).getColor() !== position.getColorToMove()) {
            if (!this.isSquareAttacked(tempPosition, newSquare, position.getColorNotToMove())) {
                return false;
            }
        }
    }

    // Move down/left
    newSquare = square.clone();
    if (newSquare.addRank(-1) && newSquare.addFile(-1)) {
        if (tempPosition.getPiece(newSquare).getColor() !== position.getColorToMove()) {
            if (!this.isSquareAttacked(tempPosition, newSquare, position.getColorNotToMove())) {
                return false;
            }
        }
    }

    // Move down/right
    newSquare = square.clone();
    if (newSquare.addRank(-1) && newSquare.addFile(1)) {
        if (tempPosition.getPiece(newSquare).getColor() !== position.getColorToMove()) {
            if (!this.isSquareAttacked(tempPosition, newSquare, position.getColorNotToMove())) {
                return false;
            }
        }
    }

    // Put king back since it cannot move
    tempPosition.setPiece(square, '', position.getColorToMove() + 'k');

    // Is the attacking piece under attack?
    friend = this.getAttackers(tempPosition, attackerSquare, position.getColorToMove());
    for (var i = 0; i < friend.length; i++) {
        // Can the attacking piece be captured?
        move = new $.Move(friend[i], attackerSquare);
        if (this.isLegal(position, move)) {
            return false;
        }
    }

    // Can the check be blocked?
    var attacker = tempPosition.getPiece(attackerSquare);
    if (attacker.isRook() || attacker.isBishop() || attacker.isQueen()) {
        if (square.compareRank(attackerSquare) > 1 || square.compareFile(attackerSquare) > 1) {
            // Change king color so it does not count as an attacker
            tempPosition.setPiece(square, '', position.getColorNotToMove() + 'k');
            newSquare = square.clone();
            while (newSquare.stepTo(attackerSquare)) {
                if (newSquare.equals(attackerSquare)) {
                    break;
                }
                if (this.getAttackers(tempPosition, newSquare, position.getColorToMove()).length > 0) {
                    return false;
                }
            }
        }
    }

    // Can en passant save the day?
    if (attacker.isPawn()) {
        // if attacker is vulnerable to en passant
        enPassantSquare = attackerSquare.clone();
        enPassantSquare.addRank(1);
        if (position.isWhiteToMove() && attackerSquare.getRank() === '5' && position.getEnPassantSquare().equals(enPassantSquare)) {
            // ... and if defender can execute en passant
            newSquare = attackerSquare.clone();
            if (newSquare.addFile(-1)) {
                if (tempPosition.getPiece(newSquare).toString() === 'wp') {
                    return false;
                }
            }
            newSquare = attackerSquare.clone();
            if (newSquare.addFile(1)) {
                if (tempPosition.getPiece(newSquare).toString() === 'wp') {
                    return false;
                }
            }
        }
        // if attacker is vulnerable to en passant
        enPassantSquare = attackerSquare.clone();
        enPassantSquare.addRank(-1);
        if (!position.isWhiteToMove() && attackerSquare.getRank() === 4 && position.getEnPassantSquare().equals(enPassantSquare)) {
            // ... and if defender can execute en passant
            newSquare = attackerSquare.clone();
            if (newSquare.addFile(1)) {
                if (tempPosition.getPiece(newSquare).toString() === 'bp') {
                    return false;
                }
            }
            newSquare = attackerSquare.clone();
            if (newSquare.addFile(1)) {
                if (tempPosition.getPiece(newSquare).toString() === 'bp') {
                    return false;
                }
            }
        }
    }

    return true;
};

$.Engine.isSquareAttacked = function (position, square, pieceColor) {
    return (this.getAttackers(position, square, pieceColor).length > 0);
};

$.Engine.isInsufficientMaterial = function (position) {
    // For now, this does not include:
    // * Perpetual check
    // * Perpetual pursuit
    // * Blockade
    // * Fortress
    // * Drawing balance of forces

    var i,
        fen = this.getFEN(position).split(' ')[0];

    if (/Q/.test(fen)) {
        return false;
    }
    if (/R/.test(fen)) {
        return false;
    }
    if (/B/.test(fen) && /N/.test(fen)) {
        return false;
    }
    if (/P/.test(fen)) {
        return false;
    }
    i = fen.indexOf('B');
    if (i !== -1 && fen.indexOf('B', i + 1) !== -1) {
        return false;
    }
    if (/q/.test(fen)) {
        return false;
    }
    if (/r/.test(fen)) {
        return false;
    }
    if (/b/.test(fen) && /n/.test(fen)) {
        return false;
    }
    if (/p/.test(fen)) {
        return false;
    }
    i = fen.indexOf('b');
    if (i !== -1 && fen.indexOf('b', i + 1) !== -1) {
        return false;
    }

    return true;
};

$.Engine.testMove = function (position, move) {
    var captureSquare,
        isEnPassant = false,
        startSquare = move.getStartSquare(),
        endSquare = move.getEndSquare();

    testPosition = position.clone();
    testPosition.setPiece(endSquare, '', testPosition.getPiece(startSquare).toString());
    testPosition.setPiece(startSquare, '', '');

    if (isEnPassant) {
        //captureSquare = new $.Square(endSquare.getFile() + startSquare.getRank());
        //testPosition.setPiece(captureSquare, '', '');
    }

    return testPosition;
};

return $.Engine;

}(CHESS);

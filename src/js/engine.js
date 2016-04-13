var CHESS = CHESS || {};

/**
 * Utility library
 */
CHESS.Engine = function ($) {

$.Engine = {};

$.Engine.gameIsOver = function (position) {
    return this.isMate(position) || this.isStalemate(position);
};

$.Engine.isStalemate = function (position) {
    return (this.getLegalMoves(position).length === 0);
};

$.Engine.getLegalMoves = function (position) {
    var i,
        moveList = [],
        piece,
        square,
        squareMoveList,
        allSquares;

    allSquares = $.Square.getAllSquares();

    // Get potential moves
    for (i = 0; i < allSquares.length; i++) {
        square = allSquares[i];
        piece = position.getPiece(square);
        if (!piece.isColor(position.getColorToMove())) {
            continue;
        }
        squareMoveList = this.getPotentialMovesFromSquare(position, square);
        moveList.push.apply(moveList, squareMoveList);
    }

    // Remove illegal candidates
    for (i = 0; i < moveList.length; i++) {
        var startSquare = new $.Square(moveList[i].split('-')[0]);
        var endSquare = new $.Square(moveList[i].split('-')[1]);
        var move = new $.Move(startSquare, endSquare);
        if (!this.isLegal(position, move)) {
            moveList.splice(i, 1);
            i--;
        }
    }

    return moveList;
};

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

$.Engine.getPotentialMovesFromSquare = function (position, square) {
    var moveList = [],
        piece,
        pieceMoves;

    piece = position.getPiece(square);

    if (piece.isPawn()) {
        pieceMoves = $.Engine.getPawnPotentialMoves(position, square);
        moveList.push.apply(moveList, pieceMoves);
    }
    if (piece.isKing()) {
        pieceMoves = $.Engine.getKingPotentialMoves(position, square);
        moveList.push.apply(moveList, pieceMoves);
    }
    if (piece.isQueen()) {
        pieceMoves = $.Engine.getQueenPotentialMoves(position, square);
        moveList.push.apply(moveList, pieceMoves);
    }
    if (piece.isRook()) {
        pieceMoves = $.Engine.getRookPotentialMoves(position, square);
        moveList.push.apply(moveList, pieceMoves);
    }
    if (piece.isBishop()) {
        pieceMoves = $.Engine.getBishopPotentialMoves(position, square);
        moveList.push.apply(moveList, pieceMoves);
    }
    if (piece.isKnight()) {
        pieceMoves = $.Engine.getKnightPotentialMoves(position, square);
        moveList.push.apply(moveList, pieceMoves);
    }

    return moveList;
};

$.Engine.getBishopAttackers = function (position, fromSquare, pieceColor) {
    var attackers = [],
        boardTraveler = new $.BoardTraveler(position, fromSquare);

    boardTraveler.travelBoardAs(CHESS.BoardTraveler.BISHOP, function (newSquare) {
        var piece = position.getPiece(newSquare);
        if (!piece.isNull()) {
            if (piece.isBishop() && piece.isColor(pieceColor)) {
                attackers.push(newSquare);
            }
        }
    });

    return attackers;
};

$.Engine.getBishopPotentialMoves = function (position, fromSquare) {
    var moveList = [],
        boardTraveler = new $.BoardTraveler(position, fromSquare);

    boardTraveler.travelBoardAs(CHESS.BoardTraveler.BISHOP, function (newSquare) {
        var piece = position.getPiece(newSquare);
        if (!piece.isColor(position.getColorToMove())) {
            moveList.push(fromSquare + '-' + newSquare);
        }
    });

    return moveList;
};

$.Engine.getKingAttackers = function (position, fromSquare, pieceColor) {
    var attackers = [],
        boardTraveler = new $.BoardTraveler(position, fromSquare);

    boardTraveler.travelBoardAs(CHESS.BoardTraveler.KING, function (newSquare) {
        var piece = position.getPiece(newSquare);
        if (!piece.isNull()) {
            if (piece.isKing() && piece.isColor(pieceColor)) {
                attackers.push(newSquare);
            }
        }
    });

    return attackers;
};

$.Engine.getKingPotentialMoves = function (position, fromSquare) {
    var moveList = [],
        boardTraveler = new $.BoardTraveler(position, fromSquare);

    boardTraveler.travelBoardAs(CHESS.BoardTraveler.KING, function (newSquare) {
        var piece = position.getPiece(newSquare);
        if (!piece.isColor(position.getColorToMove())) {
            moveList.push(fromSquare + '-' + newSquare);
        }
    });

    return moveList;
};

$.Engine.getKnightAttackers = function (position, fromSquare, pieceColor) {
    var attackers = [],
        boardTraveler = new $.BoardTraveler(position, fromSquare);

    boardTraveler.travelBoardAs(CHESS.BoardTraveler.KNIGHT, function (newSquare) {
        var piece = position.getPiece(newSquare);
        if (!piece.isNull()) {
            if (piece.isKnight() && piece.isColor(pieceColor)) {
                attackers.push(newSquare);
            }
        }
    });

    return attackers;
};

$.Engine.getKnightPotentialMoves = function (position, fromSquare) {
    var moveList = [],
        boardTraveler = new $.BoardTraveler(position, fromSquare);

    boardTraveler.travelBoardAs(CHESS.BoardTraveler.KNIGHT, function (newSquare) {
        var piece = position.getPiece(newSquare);
        if (!piece.isColor(position.getColorToMove())) {
            moveList.push(fromSquare + '-' + newSquare);
        }
    });

    return moveList;
};

$.Engine.getPawnAttackers = function (position, fromSquare, pieceColor) {
    var attackers = [],
        boardTraveler = new $.BoardTraveler(position, fromSquare),
        pieceDefinition = (pieceColor === 'w'
            ? CHESS.BoardTraveler.BLACK_PAWN_CAPTURE
            : CHESS.BoardTraveler.WHITE_PAWN_CAPTURE
        );

    boardTraveler.travelBoardAs(pieceDefinition, function (newSquare) {
        var piece = position.getPiece(newSquare);
        if (!piece.isNull()) {
            if (piece.isPawn() && piece.isColor(pieceColor)) {
                attackers.push(newSquare);
            }
        }
    });

    return attackers;
};

$.Engine.getPawnPotentialMoves = function (position, fromSquare) {
    var moveList = [],
        boardTraveler = new $.BoardTraveler(position, fromSquare);
        pieceDefinition = (position.isWhiteToMove()
            ? CHESS.BoardTraveler.WHITE_PAWN
            : CHESS.BoardTraveler.BLACK_PAWN
        );

    boardTraveler.travelBoardAs(pieceDefinition, function (newSquare) {
        var piece = position.getPiece(newSquare);
        if (!piece.isColor(position.getColorToMove())) {
            moveList.push(fromSquare + '-' + newSquare);
        }
    });

    return moveList;
};

$.Engine.getQueenAttackers = function (position, fromSquare, pieceColor) {
    var attackers = [],
        boardTraveler = new $.BoardTraveler(position, fromSquare);

    boardTraveler.travelBoardAs(CHESS.BoardTraveler.QUEEN, function (newSquare) {
        var piece = position.getPiece(newSquare);
        if (!piece.isNull()) {
            if (piece.isQueen() && piece.isColor(pieceColor)) {
                attackers.push(newSquare);
            }
        }
    });

    return attackers;
};

$.Engine.getQueenPotentialMoves = function (position, fromSquare) {
    var moveList = [],
        boardTraveler = new $.BoardTraveler(position, fromSquare);

    boardTraveler.travelBoardAs(CHESS.BoardTraveler.QUEEN, function (newSquare) {
        var piece = position.getPiece(newSquare);
        if (!piece.isColor(position.getColorToMove())) {
            moveList.push(fromSquare + '-' + newSquare);
        }
    });

    return moveList;
};

$.Engine.getRookAttackers = function (position, fromSquare, pieceColor) {
    var attackers = [],
        boardTraveler = new $.BoardTraveler(position, fromSquare);

    boardTraveler.travelBoardAs(CHESS.BoardTraveler.ROOK, function (newSquare) {
        var piece = position.getPiece(newSquare);
        if (!piece.isNull()) {
            if (piece.isRook() && piece.isColor(pieceColor)) {
                attackers.push(newSquare);
            }
        }
    });

    return attackers;
};

$.Engine.getRookPotentialMoves = function (position, fromSquare) {
    var moveList = [],
        boardTraveler = new $.BoardTraveler(position, fromSquare);

    boardTraveler.travelBoardAs(CHESS.BoardTraveler.ROOK, function (newSquare) {
        var piece = position.getPiece(newSquare);
        if (!piece.isColor(position.getColorToMove())) {
            moveList.push(fromSquare + '-' + newSquare);
        }
    });

    return moveList;
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

    if (!newPiece.isNull() && newPiece.isColor(piece.getColor())) {
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
    var startSquare = move.getStartSquare().clone(),
        endSquare = move.getEndSquare();

    while (startSquare.stepTo(endSquare)) {
        if (startSquare.equals(endSquare)) {
            break;
        }
        if (!position.getPiece(startSquare).isNull()) {
            return false;
        }
    }

    return true;
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

$.Engine.isLegalKingMove = function (position, move) {
    var startSquare = move.getStartSquare(),
        endSquare = move.getEndSquare(),
        piece = position.getPiece(startSquare),
        newPiece = position.getPiece(endSquare);

    // castling
    if (startSquare.compareFile(endSquare) === 2) {
        if (piece.isWhite()) {
            if (endSquare.getName() === 'g1' && position.canWhiteCastleKingside() && position.getPiece(new $.Square('f1')).isNull() && position.getPiece(new $.Square('g1')).isNull()) {
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
            } else if (endSquare.getName() === 'c1' && position.canWhiteCastleQueenside() && position.getPiece(new $.Square('d1')).isNull() && position.getPiece(new $.Square('c1')).isNull() && position.getPiece(new $.Square('b1')).isNull()) {
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
            if (endSquare.getName() === 'g8' && position.canBlackCastleKingside() && position.getPiece(new $.Square('f8')).isNull() && position.getPiece(new $.Square('g8')).isNull()) {
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
            } else if (endSquare.getName() === 'c8' && position.canBlackCastleQueenside() && position.getPiece(new $.Square('d8')).isNull() && position.getPiece(new $.Square('c8')).isNull() && position.getPiece(new $.Square('b8')).isNull()) {
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
    var whiteUnblocked = position.getPiece(blockSquare).isNull();
    blockSquare = startSquare.clone();
    blockSquare.setRank(6);
    var blackUnblocked = position.getPiece(blockSquare).isNull();
    var whiteFirstMove = (piece.isWhite() && startSquare.getRank() === '2');
    var blackFirstMove = (piece.isBlack() && startSquare.getRank() === '7');
    if (!(moveOneSquare || (moveTwoSquares && (whiteFirstMove && whiteUnblocked || blackFirstMove && blackUnblocked)))) {
        return false;
    }

    // pawns cannot capture directly forward
    if (startSquare.isSameFile(endSquare) && !newPiece.isNull()) {
        return false;
    }

    // pawns cannot move horizontally unless capturing 1 square on a forward-diagonal
    if (!startSquare.isSameFile(endSquare)) {
        // if side to side movement, only the following situations are valid
        is_capturing_enemy = (!newPiece.isNull() && !newPiece.isColor(piece.getColor()));
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

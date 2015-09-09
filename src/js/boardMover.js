var CHESS = CHESS || {};

CHESS.BoardMover = function ($) {

    /**
     * @class
     * @param {Position} position - An initial position for moving pieces.
     */
    function BoardMover (position) {
        this.move = function (move, promotion) {
            var capturedPiece,
                piece,
                startSquare = move.getStartSquare().clone(),
                endSquare = move.getEndSquare().clone();

            if (!isMoveLegal(move)) {
                return false;
            }

            capturedPiece = position.getPiece(endSquare);
            piece = position.getPiece(startSquare);

            movePiece(startSquare, endSquare, piece);

            if (piece.isPawn()) {
                if (startSquare.compareRank(endSquare) === 2) {
                    setNewEnPassantSquare(startSquare);
                } else if (endSquare.getRank() === '1' || endSquare.getRank() === '8') {
                    promotePawn(endSquare, promotion);
                } else if (!startSquare.isSameFile(endSquare) && capturedPiece.isNull()) {
                    removeEnPassantPiece(endSquare);
                }
            }

            if (piece.isKing()) {
                disableKingsideCastling(piece);
                disableQueensideCastling(piece);

                if (piece.isKing() && startSquare.getFile() === 'e') {
                    if (endSquare.getFile() === 'g') {
                        castleKingsideWithRook(startSquare);
                    } else if (endSquare.getFile() === 'c') {
                        castleQueensideWithRook(startSquare);
                    }
                }
            }

            if (piece.isRook()) {
                if (startSquare.getName() === 'h1' || startSquare.getName() === 'h8') {
                    disableKingsideCastling(piece);
                } else if (startSquare.getName() === 'a1' || startSquare.getName() === 'a8') {
                    disableQueensideCastling(piece);
                }
            }

            if (capturedPiece.isRook()) {
                if (endSquare.getName() === 'a1' || endSquare.getName() === 'a8') {
                    disableQueensideCastling(capturedPiece);
                } else if (endSquare.getName() === 'h1' || endSquare.getName() === 'h8') {
                    disableKingsideCastling(capturedPiece);
                }
            }

            if (position.isWhiteToMove()) {
                position.setBlackToMove();
            } else {
                position.setWhiteToMove();
            }

            return true;
        };

        var isMoveLegal = function (move) {
            return $.Engine.isLegal(position, move);
        };

        var movePiece = function (startSquare, endSquare, piece) {
            position.setPiece(endSquare, '', piece.toString());
            position.setPiece(startSquare, '', '');
            position.setEnPassantSquare();
        };

        var promotePawn = function (endSquare, promotion) {
            var color = (endSquare.getRank() === '8' ? 'w' : 'b');

            if (/^[QRBN]$/.test(promotion)) {
                promotion = promotion.toLowerCase();
                position.setPiece(endSquare, '', color + promotion);
            } else {
                // throw error
            }
        };

        var setNewEnPassantSquare = function (startSquare) {
            var newEnPassantSquare = startSquare.clone(),
                pawnDirection = (startSquare.getRank() === '2' ? 1 : -1);
            newEnPassantSquare.addRank(pawnDirection);
            position.setEnPassantSquare(newEnPassantSquare);
        };

        var removeEnPassantPiece = function (endSquare) {
            var newEnPassantSquare = endSquare.clone(),
                pawnDirection = (endSquare.getRank() === '6' ? 1 : -1);
            newEnPassantSquare.addRank(-pawnDirection);
            position.setPiece(newEnPassantSquare, '', '');
        };

        var castleKingsideWithRook = function (startSquare) {
            var rank = startSquare.getRank(),
                piece = position.getPiece(new $.Square('h' + rank));
            position.setPiece(new $.Square('f' + rank), '', piece.toString());
            position.setPiece(new $.Square('h' + rank), '', '');
        };

        var castleQueensideWithRook = function (startSquare) {
            var rank = startSquare.getRank(),
                piece = position.getPiece(new $.Square('a' + rank));
            position.setPiece(new $.Square('d' + rank), '', piece.toString());
            position.setPiece(new $.Square('a' + rank), '', '');
        };

        var disableKingsideCastling = function (piece) {
            if (piece.isWhite()) {
                position.setWhiteCastleKingside(false);
            } else {
                position.setBlackCastleKingside(false);
            }
        };

        var disableQueensideCastling = function (piece) {
            if (piece.isWhite()) {
                position.setWhiteCastleQueenside(false);
            } else {
                position.setBlackCastleQueenside(false);
            }
        };
    }

    return BoardMover;

}(CHESS);

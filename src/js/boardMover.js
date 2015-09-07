var CHESS = CHESS || {};

CHESS.BoardMover = function ($) {

    /**
     * @class
     * @param {Position} position - An initial position for moving pieces.
     */
    function BoardMover (position) {

        this.position = position;

        this.move = function (move, promotion) {
            var capturedPiece,
                piece,
                startSquare = move.getStartSquare(),
                endSquare = move.getEndSquare(),
                newEnPassantSquare;

            var startSquare = new $.Square(startSquare.getName());
            var endSquare = new $.Square(endSquare.getName());
            if (!$.Engine.isLegal(this.position, move)) {
                return false;
            }

            if (promotion !== undefined) {
                promotion = promotion.toLowerCase();
            }

            // Move the piece
            capturedPiece = this.position.getPiece(endSquare);
            piece = this.position.getPiece(startSquare);
            this.position.setPiece(endSquare, '', piece.toString());
            this.position.setPiece(startSquare, '', '');
            this.position.setEnPassantSquare();

            if (this.position.isWhiteToMove()) {
                if (piece.isPawn()) {
                    if (startSquare.compareRank(endSquare) === 2) {
                        // Two squares
                        newEnPassantSquare = startSquare.clone();
                        newEnPassantSquare.addRank(1);
                        this.position.setEnPassantSquare(newEnPassantSquare);
                    } else if (endSquare.getRank() === '8') {
                        // Promotion
                        this.position.setPiece(endSquare, '', 'w' + promotion);
                    } else if (!startSquare.isSameFile(endSquare) && capturedPiece.isNull()) {
                        // En passant
                        newEnPassantSquare = endSquare.clone();
                        newEnPassantSquare.addRank(-1);
                        this.position.setPiece(newEnPassantSquare, '', '');
                    }
                }

                // Castling
                if (piece.isKing() && startSquare.getName() === 'e1') {
                    if (endSquare.getName() === 'g1') {
                        this.position.setPiece(new $.Square('f1'), '', 'wrk');
                        this.position.setPiece(new $.Square('h1'), '', '');
                    } else if (endSquare.getName() === 'c1') {
                        this.position.setPiece(new $.Square('d1'), '', 'wrq');
                        this.position.setPiece(new $.Square('a1'), '', '');
                    }
                }

                // Lose castling ability
                if (piece.isKing()) {
                    this.position.setWhiteCastleKingside(false);
                    this.position.setWhiteCastleQueenside(false);
                } else if (piece.isRook()) {
                    if (startSquare.getName() === 'h1') {
                        this.position.setWhiteCastleKingside(false);
                    } else if (startSquare.getName() === 'a1') {
                        this.position.setWhiteCastleQueenside(false);
                    }
                }

                // Opponent loses castling ability
                if (capturedPiece.isBlack() && capturedPiece.isRook()) {
                    if (endSquare.getName() === 'a8') {
                        this.position.setBlackCastleQueenside(false);
                    } else if (endSquare.getName() === 'h8') {
                        this.position.setBlackCastleKingside(false);
                    }
                }

                this.position.setBlackToMove();

            } else {
                if (piece.isPawn()) {
                    if (startSquare.compareRank(endSquare) === 2) {
                        // Two squares
                        newEnPassantSquare = startSquare.clone();
                        newEnPassantSquare.addRank(-1);
                        this.position.setEnPassantSquare(newEnPassantSquare);
                    } else if (endSquare.getRank() === '1') {
                        // Promotion
                        this.position.setPiece(endSquare, '', 'b' + promotion);
                    } else if (!startSquare.isSameFile(endSquare) && capturedPiece.isNull()) {
                        // En passant
                        newEnPassantSquare = endSquare.clone();
                        newEnPassantSquare.addRank(1);
                        this.position.setPiece(newEnPassantSquare, '', '');
                    }
                }

                // Castling
                if (piece.isKing() && startSquare.getName() === 'e8') {
                    if (endSquare.getName() === 'g8') {
                        this.position.setPiece(new $.Square('f8'), '', 'brk');
                        this.position.setPiece(new $.Square('h8'), '', '');
                    } else if (endSquare.getName() === 'c8') {
                        this.position.setPiece(new $.Square('d8'), '', 'brq');
                        this.position.setPiece(new $.Square('a8'), '', '');
                    }
                }

                // Lose castling ability
                if (piece.isKing()) {
                    this.position.setBlackCastleKingside(false);
                    this.position.setBlackCastleQueenside(false);
                } else if (piece.isRook()) {
                    if (startSquare.getName() === 'h8') {
                        this.position.setBlackCastleKingside(false);
                    } else if (startSquare.getName() === 'a8') {
                        this.position.setBlackCastleQueenside(false);
                    }
                }

                // Opponent loses castling ability
                if (capturedPiece.isWhite() && capturedPiece.isRook()) {
                    if (endSquare.getName() === 'a1') {
                        this.position.setWhiteCastleQueenside(false);
                    } else if (endSquare.getName() === 'h1') {
                        this.position.setWhiteCastleKingside(false);
                    }
                }

                this.position.setWhiteToMove();

            }

            if ($.Engine.gameIsOver(position)) {
                position.active = false;
            }

            return true;

        };
    }

    return BoardMover;

}(CHESS);

var CHESS = CHESS || {};

CHESS.BoardTraveler = function ($) {

    /**
     * @class
     * @param {Position} position - A position to travel.
     * @param {Square} fromSquare - A square to travel from.
     */
    function BoardTraveler (position, fromSquare) {
        var fromSquare,
            position;

        this.travelBoardAs = function (pieceDefinition, action) {
            var adjust,
                i,
                j,
                newSquare,
                piece,
                moveMap = pieceDefinition.moveMap,
                distance = pieceDefinition.distance;

            for (i = 0; i < moveMap.length; i++) {
                adjust = moveMap[i];
                for (j = 1; j <= distance; j++) {
                    newSquare = fromSquare.clone();
                    if (newSquare.addRank(adjust.rank * j) && newSquare.addFile(adjust.file * j)) {
                        // Call the user-defined action
                        action(newSquare);
                        // Don't look beyond the first piece
                        piece = position.getPiece(newSquare);
                        if (!piece.isNull()) {
                            break;
                        }
                    }
                }
            }
        };

        this.position = position;
        this.fromSquare = fromSquare;
    };

    BoardTraveler.BISHOP = {
        distance: 7,
        moveMap: [
            {'rank': 1, 'file': 1},
            {'rank': 1, 'file': -1},
            {'rank': -1, 'file': 1},
            {'rank': -1, 'file': -1}
        ]
    };
    BoardTraveler.ROOK = {
        distance: 7,
        moveMap: [
            {'rank': 1, 'file': 0},
            {'rank': -1, 'file': 0},
            {'rank': 0, 'file': 1},
            {'rank': 0, 'file': -1}
        ]
    };
    BoardTraveler.QUEEN = {
        distance: 7,
        moveMap: [
            {'rank': 1, 'file': 0},
            {'rank': -1, 'file': 0},
            {'rank': 0, 'file': 1},
            {'rank': 0, 'file': -1},
            {'rank': 1, 'file': 1},
            {'rank': 1, 'file': -1},
            {'rank': -1, 'file': 1},
            {'rank': -1, 'file': -1}
        ]
    };
    // TODO Create a KING_CASTLE definition
    // Can't include it here because kings
    // don't move and capture exactly the same
    BoardTraveler.KING = {
        distance: 1,
        moveMap: [
            {'rank': 1, 'file': 1},
            {'rank': 1, 'file': 0},
            {'rank': 1, 'file': -1},
            {'rank': 0, 'file': 1},
            {'rank': 0, 'file': -1},
            {'rank': -1, 'file': 1},
            {'rank': -1, 'file': 0},
            {'rank': -1, 'file': -1}
        ]
    };
    BoardTraveler.KNIGHT = {
        distance: 1,
        moveMap: [
            {'rank': 1, 'file': 2},
            {'rank': 1, 'file': -2},
            {'rank': 2, 'file': 1},
            {'rank': 2, 'file': -1},
            {'rank': -1, 'file': 2},
            {'rank': -1, 'file': -2},
            {'rank': -2, 'file': 1},
            {'rank': -2, 'file': -1}
        ]
    };
    BoardTraveler.WHITE_PAWN = {
        distance: 1,
        moveMap: [
            {'rank': 2, 'file': 0},
            {'rank': 1, 'file': 0},
            {'rank': 1, 'file': 1},
            {'rank': 1, 'file': -1}
        ]
    };
    BoardTraveler.BLACK_PAWN = {
        distance: 1,
        moveMap: [
            {'rank': -2, 'file': 0},
            {'rank': -1, 'file': 0},
            {'rank': -1, 'file': 1},
            {'rank': -1, 'file': -1}
        ]
    };
    BoardTraveler.WHITE_PAWN_CAPTURE = {
        distance: 1,
        moveMap: [
            {'rank': 1, 'file': 1},
            {'rank': 1, 'file': -1}
        ]
    };
    BoardTraveler.BLACK_PAWN_CAPTURE = {
        distance: 1,
        moveMap: [
            {'rank': -1, 'file': 1},
            {'rank': -1, 'file': -1}
        ]
    };

    return BoardTraveler;

}(CHESS);

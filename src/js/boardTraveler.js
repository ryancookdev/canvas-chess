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

        this.travelBoardAs = function (pieceMoveMap, action) {
            var adjust,
                i,
                j,
                newSquare,
                piece;

            for (i = 0; i < pieceMoveMap.length; i++) {
                adjust = pieceMoveMap[i];
                for (j = 1; j < 8; j++) {
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

    BoardTraveler.BISHOP = [
        {'rank': 1, 'file': 1},
        {'rank': 1, 'file': -1},
        {'rank': -1, 'file': 1},
        {'rank': -1, 'file': -1}
    ];
    BoardTraveler.ROOK = [
        {'rank': 1, 'file': 0},
        {'rank': -1, 'file': 0},
        {'rank': 0, 'file': 1},
        {'rank': 0, 'file': -1}
    ];
    BoardTraveler.QUEEN = [
        {'rank': 1, 'file': 0},
        {'rank': -1, 'file': 0},
        {'rank': 0, 'file': 1},
        {'rank': 0, 'file': -1},
        {'rank': 1, 'file': 1},
        {'rank': 1, 'file': -1},
        {'rank': -1, 'file': 1},
        {'rank': -1, 'file': -1}
    ];

    return BoardTraveler;

}(CHESS);

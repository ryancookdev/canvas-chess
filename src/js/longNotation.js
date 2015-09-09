var CHESS = CHESS || {};

CHESS.LongNotation = function ($) {

    /**
     * @class
     * @param {Position} position
     */
    function LongNotation (position) {
        var position = position;

        this.getLongNotation = function (shortNotation) {
            var i,
                colorToMove,
                endSquare,
                move,
                piece,
                pieceLetter,
                squareList,
                startSquareHint,
                startSquare;

            if (shortNotation === 'O-O') {
                return (position.isWhiteToMove() ? 'e1-g1' : 'e8-g8');
            }
            if (shortNotation === 'O-O-O') {
                return (position.isWhiteToMove() ? 'e1-c1' : 'e8-c8');
            }

            startSquareHint = extractStartSquareHint(shortNotation);
            colorToMove = (position.isWhiteToMove() ? 'w' : 'b');
            pieceLetter = extractPieceLetter(shortNotation);
            piece = new $.Piece(colorToMove + pieceLetter);
            endSquare = extractEndSquare(shortNotation);
            squareList = getSquareList(startSquareHint);

            for (i = 0; i < squareList.length; i++) {
                startSquare = squareList[i];
                if (!squareHasCorrectPiece(startSquare, piece)) {
                    continue;
                }
                if (!pieceCanLegallyMove(piece, startSquare, endSquare)) {
                    continue;
                }
                return (startSquare.getName() + '-' + endSquare.getName());
            }
        };

        var getSquareList = function (startSquareHint) {
            if (/[1-8]/.test(startSquareHint)) {
                return getRankSquares(startSquareHint);
            }
            if (/[a-h]/.test(startSquareHint)) {
                return getFileSquares(startSquareHint);
            }
            return $.Square.getAllSquares();
        };

        var getRankSquares = function (rank) {
            var squareList = [],
                square = new $.Square('a' + rank);

            do {
                squareList.push(square.clone());
            } while (square.addFile(1));

            return squareList;
        };

        var getFileSquares = function (file) {
            var squareList = [],
                square = new $.Square(file + '1');

            do {
                squareList.push(square.clone());
            } while (square.addRank(1));

            return squareList;
        };

        var squareHasCorrectPiece = function (square, piece) {
            return position.getPiece(square).equals(piece);
        };

        var pieceCanLegallyMove = function (piece, startSquare, endSquare) {
            var move = new $.Move(startSquare, endSquare);
            return $.Engine.isLegal(position, move);
        };

        var extractSquareInfo = function (shortNotation) {
            return shortNotation.replace(/[#+=xKQRBN]/g, '');
        };

        var extractEndSquare = function (shortNotation) {
            var endSquare = extractSquareInfo(shortNotation);
            if (endSquare.length === 3) {
                return new $.Square(endSquare.substr(1, 2));
            }
            return new $.Square(endSquare);
        };

        var extractStartSquareHint = function (shortNotation) {
            var squareInfo = extractSquareInfo(shortNotation);
            if (squareInfo.length === 3) {
                return squareInfo.substr(0, 1);
            }
            return '';
        };

        var extractPieceLetter = function (shortNotation) {
            pieceLetter = shortNotation.substring(0, 1);
            if (!/[KQRBN]/.test(pieceLetter)) {
                return 'p';
            }
            return pieceLetter.toLowerCase();
        };
    }

    return LongNotation;

}(CHESS);

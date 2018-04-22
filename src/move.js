var CHESS = CHESS || {};

CHESS.Move = function ($) {

    /**
     * @constructor
     * @param {Square} start
     * @param {Square} end
     */
    function Move (start, end) {
        var startSquare,
            endSquare;

        this.getEndSquare = function () {
            return endSquare;
        };

        this.getStartSquare = function () {
            return startSquare;
        };

        var setMove = function (start, end) {
            startSquare = start.clone();
            endSquare = end.clone();
        };

        setMove(start, end);
    }

    return Move;

}(CHESS);

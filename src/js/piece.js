var CHESS = CHESS || {};

CHESS.Piece = function ($) {

/**
 * @class
 * @param {string} pieceAbbrev - A two-character abbreviated piece.
 */
return function (pieceAbbrev) {
    var that = this,
        type = '',
        color = '';

    /**
     * @param {Piece} piece
     * @returns {boolean}
     */
    this.equals = function (piece) {
        if (!isAPiece(piece)) {
            return false;
        }
        return (
            this.getType() === piece.getType()
            && this.getColor() === piece.getColor()
        );
    };

    var isAPiece = function (piece) {
        if (typeof piece !== 'object') {
            return false;
        }
        return (piece.constructor === that.constructor);
    };

    /**
     * @returns {string} 
     */
    this.getColor = function () {
        return color;
    };

    /**
     * @returns {string} 
     */
    this.getType = function () {
        return type;
    };

    /**
     * @returns {boolean} 
     */
    this.isBishop = function () {
        return (type === 'b');
    };

    /**
     * @returns {boolean} 
     */
    this.isBlack = function () {
        return (color === 'b');
    };

    /**
     * @returns {boolean} 
     */
    this.isColor = function (c) {
        return (color === c);
    };

    /**
     * @returns {boolean} 
     */
    this.isKing = function () {
        return (type === 'k');
    };

    /**
     * @returns {boolean} 
     */
    this.isKnight = function () {
        return (type === 'n');
    };

    /**
     * @returns {boolean} 
     */
    this.isNull = function () {
        return (type === false);
    };

    /**
     * @returns {boolean} 
     */
    this.isPawn = function () {
        return (type === 'p');
    };

    /**
     * @returns {boolean} 
     */
    this.isQueen = function () {
        return (type === 'q');
    };

    /**
     * @returns {boolean} 
     */
    this.isRook = function () {
        return (type === 'r');
    };

    /**
     * @returns {boolean} 
     */
    this.isWhite = function () {
        return (color === 'w');
    };

    /**
     * @returns {string} 
     */
    this.toString = function () {
        return (color && type ? color + type : '');
    };

    var getTypeFromAbbrev = function (pieceAbbrev) {
        if (!/^[wb][kqrbnp]$/.test(pieceAbbrev)) {
            return false;
        }
        return pieceAbbrev.substr(1, 1);
    };

    var getColorFromAbbrev = function (pieceAbbrev) {
        if (!/^[wb][kqrbnp]$/.test(pieceAbbrev)) {
            return false;
        }
        return pieceAbbrev.substr(0, 1);
    };

    type = getTypeFromAbbrev(pieceAbbrev);
    color = getColorFromAbbrev(pieceAbbrev);
};

}(CHESS);

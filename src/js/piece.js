var CHESS = CHESS || {};

CHESS.Piece = function ($) {

/**
 * Piece type and color.
 *
 * @constructor
 * @param {String} pieceAbbrev - [w|b][prnbqk]
 */
return function (pieceAbbrev) {
    var type = '',
        color = '';

    /**
     * @returns {String} 
     */
    this.getColor = function () {
        return color;
    };

    /**
     * @returns {String} 
     */
    this.getType = function () {
        return type;
    };

    /**
     * @returns {Boolean} 
     */
    this.isBishop = function () {
        return type === 'b';
    };

    this.isBlack = function () {
        return color === 'b';
    };

    this.isColor = function (c) {
        return color === c;
    };

    /**
     * @returns {Boolean} 
     */
    this.isEmpty = function () {
        return type === false;
    };

    /**
     * @returns {Boolean} 
     */
    this.isKing = function () {
        return type === 'k';
    };

    /**
     * @returns {Boolean} 
     */
    this.isKnight = function () {
        return type === 'n';
    };

    /**
     * @returns {Boolean} 
     */
    this.isPawn = function () {
        return type === 'p';
    };

    /**
     * @returns {Boolean} 
     */
    this.isQueen = function () {
        return type === 'q';
    };

    /**
     * @returns {Boolean} 
     */
    this.isRook = function () {
        return type === 'r';
    };

    /**
     * @returns {Boolean} 
     */
    this.isWhite = function () {
        return color === 'w';
    };

    /**
     * @returns {String} 
     */
    this.toString = function () {
        return (color && type ? color + type : '');
    };

    var getTypeFromAbbrev = function (pieceAbbrev) {
        if (!/[wb][kqrbnp]/.test(pieceAbbrev)) {
            return false;
        }
        return pieceAbbrev.substr(1, 1);
    };

    var getColorFromAbbrev = function (pieceAbbrev) {
        if (!/[wb][kqrbnp]/.test(pieceAbbrev)) {
            return false;
        }
        return pieceAbbrev.substr(0, 1);
    };

    type = getTypeFromAbbrev(pieceAbbrev);
    color = getColorFromAbbrev(pieceAbbrev);
};

}(CHESS);

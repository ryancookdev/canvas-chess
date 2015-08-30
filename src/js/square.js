var CHESS = CHESS || {};

CHESS.Square = function ($) {

/**
 * @constructor
 * @param {String} anSquare
 */
return function (anSquare) {
    var that = this;

    this.name = '';

    this.addFile = function (i) {
        var newSquare = fileToChar(getFileNumber() + i) + this.getRank();
        return setSquare(newSquare);
    };

    this.addRank = function (i) {
        var newSquare = this.getFile() + (getRankNumber() + i);
        return setSquare(newSquare);
    };

    this.compareRank = function (square) {
        if (square === undefined) {
            return 0;
        }
        square = square.toString();
        return Math.abs(getRankNumber() - getRankNumber(square));
    }

    this.compareFile = function (square) {
        if (square === undefined) {
            return 0;
        }
        square = square.toString();
        return Math.abs(getFileNumber() - getFileNumber(square));
    }

    var fileToChar = function (file) {
        return String.fromCharCode(file + 96);
    };

    this.getFile = function (anSquare) {
        if (anSquare === undefined) {
            anSquare = this.name;
        }
        return anSquare.substr(0, 1).toLowerCase();
    };

    var getFileNumber = function (anSquare) {
        if (anSquare === undefined) {
            anSquare = that.name;
        }
        return that.getFile(anSquare).charCodeAt(0) - 96;
    };

    this.getRank = function (anSquare) {
        if (anSquare === undefined) {
            anSquare = this.name;
        }
        return anSquare.substr(1, 1);
    };

    var getRankNumber = function (anSquare) {
        if (anSquare === undefined) {
            anSquare = that.name;
        }
        return parseInt(that.getRank(anSquare), 10);
    };

    this.isBishopMove = function (square) {
        square = stringifyAndValidateNewSquare(square);
        if (!square) {
            return false;
        }
        return this.compareRank(square) === this.compareFile(square);
    };

    this.isKingMove = function (square) {
        square = stringifyAndValidateNewSquare(square);
        if (!square) {
            return false;
        }
        return this.compareRank(square) < 2 && this.compareFile(square) < 2;
    };

    this.isKnightMove = function (square) {
        square = stringifyAndValidateNewSquare(square);
        if (!square) {
            return false;
        }
        return (this.compareRank(square) === 1 && this.compareFile(square) === 2) ||
            (this.compareRank(square) === 2 && this.compareFile(square) === 1);
    };

    this.isQueenMove = function (square) {
        square = stringifyAndValidateNewSquare(square);
        if (!square) {
            return false;
        }
        return this.isRookMove(square) || this.isBishopMove(square);
    };

    this.isRookMove = function (square) {
        square = stringifyAndValidateNewSquare(square);
        if (!square) {
            return false;
        }
        return this.isSameRank(square) || this.isSameFile(square);
    };

    var stringifyAndValidateNewSquare = function (square) {
        if (square === undefined) {
            return false;
        }
        square = square.toString();
        if (square === that.name) {
            return false;
        }
        return square;
    };

    /**
     * @param {String|CHESS.Square} square
     */
    this.isSameFile = function (square) {
        if (square === undefined) {
            return false;
        }
        square = square.toString();
        return this.getFile() === this.getFile(square);
    };

    /**
     * @param {String|CHESS.Square} square
     */
    this.isSameRank = function (square) {
        if (square === undefined) {
            return false;
        }
        square = square.toString();
        return this.getRank() === this.getRank(square);
    };

    var isValid = function (anSquare) {
        return /[a-h][1-8]/.test(anSquare);
    };

    this.setFile = function (file) {
        var newSquare;
        if (file === undefined) {
            return false;
        }
        newSquare = file + this.getRank();
        return setSquare(newSquare);
    };

    this.setRank = function (rank) {
        var newSquare;
        if (rank === undefined) {
            return false;
        }
        newSquare = this.getFile() + rank;
        return setSquare(newSquare);
    };

    var setSquare = function (anSquare) {
        if (isValid(anSquare)) {
            that.name = anSquare;
            return true;
        }
        return false;
    };

    this.toString = function () {
        return this.name;
    };

    setSquare(anSquare);
};

}(CHESS);

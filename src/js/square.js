var CHESS = CHESS || {};

CHESS.Square = function ($) {

    /**
     * @class
     * @param {string} anSquare - A square in algebraic notation.
     */
    function Square (anSquare) {
        var that = this,
            name = '';

        /**
         * @param {number} fileCount - Number of files to add (or subtract if negative)
         * @return {boolean}
         */
        this.addFile = function (fileCount) {
            var newFile,
                success;

            if (typeof fileCount !== 'number' || isNaN(fileCount)) {
                return false;
            }

            if (Math.abs(fileCount > 7)) {
                return false;
            }

            if (this.isNull()) {
                return false;
            }

            newFile = addNumberToCharacter(fileCount, this.getFile());
            success = setSquare(newFile + this.getRank());

            return success;
        };

        var addNumberToCharacter = function (number, character) {
            var currentFileNumber,
                newFileNumber,
                fileCharacter;

            $.assertNumberRange(number, -7, 7);
            $.assertStringLength(character, 1);

            currentFileNumber = convertCharacterToNumber(character);
            newFileNumber = currentFileNumber + number;
            fileCharacter = convertNumberToCharacter(newFileNumber)

            return fileCharacter;
        };

        var isValidFileNumber = function (fileNumber) {
            $.assertNumber(fileNumber);
            return (fileNumber >= 1 && fileNumber <=8);
        };

        var setSquare = function (anSquare) {
            $.assertString(anSquare);
            if (invalidAlgebraicNotation(anSquare)) {
                return false;
            }
            name = anSquare;
            return true;
        };

        var invalidAlgebraicNotation = function (anSquare) {
            $.assertString(anSquare);
            return !(/^[a-h][1-8]$/.test(anSquare));
        };

        var convertNumberToCharacter = function (number) {
            $.assertNumber(number);
            return String.fromCharCode(number + 96);
        };

        var convertCharacterToNumber = function (character) {
            $.assertString(character);
            $.assertPattern(character, /^[a-h]$/);
            return (character.charCodeAt(0) - 96);
        };

        /**
         * @param {number} i - Number of ranks to add (or subtract if negative)
         * @return {boolean}
         */
        this.addRank = function (i) {
            var newSquare = this.getFile() + (parseInt(this.getRank(), 10) + i);
            return setSquare(newSquare);
        };

        /**
         * @returns {Square}
         */
        this.clone = function () {
            return new $.Square(this.getName());
        };

        /**
         * Count the number of files between two squares (absolute value).
         * @param {Square} square
         * @return {number}
         */
        this.compareFile = function (square) {
            return Math.abs(this.diffFile(square));
        }

        /**
         * Count the number of ranks between two squares (absolute value).
         * @param {Square} square
         * @return {number}
         */
        this.compareRank = function (square) {
            return Math.abs(this.diffRank(square));
        }

        /**
         * Count the number of files between two squares (positive or negative).
         * @param {Square} square
         * @return {number}
         */
        this.diffFile = function (square) {
            if (square === undefined) {
                return 0;
            }
            return (convertCharacterToNumber(square.getFile()) - convertCharacterToNumber(this.getFile()));
        }

        /**
         * Count the number of ranks between two squares (positive or negative).
         * @param {Square} square
         * @return {number}
         */
        this.diffRank = function (square) {
            if (square === undefined) {
                return 0;
            }
            return (parseInt(square.getRank(), 10) - parseInt(this.getRank(), 10));
        }

        /**
         * @param {Square} square
         * @returns {boolean}
         */
        this.equals = function (square) {
            if (!isASquare(square)) {
                return false;
            }
            return (name === square.getName());
        };

        /**
         * Extract the file letter from a square.
         * @return {string}
         */
        this.getFile = function () {
            return name.substr(0, 1).toLowerCase();
        };

        /**
         * return {string}
         */
        this.getName = function () {
            return name;
        };

        /**
         * Extract the rank from the square.
         * @return {string}
         */
        this.getRank = function () {
            return name.substr(1, 1);
        };

        var isASquare = function (square) {
            if (typeof square !== 'object') {
                return false;
            }
            return (square.constructor === that.constructor);
        };

        /**
         * Determine if another square is on the same diagonal.
         * @param {Square} square
         * @return {boolean}
         */
        this.isBishopMove = function (square) {
            if (!isASquare(square)) {
                return false;
            }
            if (this.equals(square)) {
                return false;
            }
            return (this.compareRank(square) === this.compareFile(square));
        };

        /**
         * Determine if another square is on a neighboring square.
         * @param {Square} square
         * @return {boolean}
         */
        this.isKingMove = function (square) {
            if (!isASquare(square)) {
                return false;
            }
            if (this.equals(square)) {
                return false;
            }
            return (this.compareRank(square) < 2 && this.compareFile(square) < 2);
        };

        /**
         * Determine if another square is a knight move away.
         * @param {Square} square
         * @return {boolean}
         */
        this.isKnightMove = function (square) {
            if (!isASquare(square)) {
                return false;
            }
            if (this.equals(square)) {
                return false;
            }
            return (this.compareRank(square) === 1 && this.compareFile(square) === 2) ||
                (this.compareRank(square) === 2 && this.compareFile(square) === 1);
        };

        /**
         * returns {boolean}
         */
        this.isNull = function () {
            return (name === '');
        };

        /**
         * Determine if another square is the same diagonal, rank, or file.
         * @param {Square} square
         * @return boolean
         */
        this.isQueenMove = function (square) {
            if (!isASquare(square)) {
                return false;
            }
            if (this.equals(square)) {
                return false;
            }
            return (this.isRookMove(square) || this.isBishopMove(square));
        };

        /**
         * Determine if another square is the same rank or file.
         * @param {Square} square
         * @return boolean
         */
        this.isRookMove = function (square) {
            if (!isASquare(square)) {
                return false;
            }
            if (this.equals(square)) {
                return false;
            }
            return (this.isSameRank(square) || this.isSameFile(square));
        };

        /**
         * Determine if another square is the file.
         * @param {Square} square
         * @return {boolean}
         */
        this.isSameFile = function (square) {
            if (square === undefined) {
                return false;
            }
            return (this.getFile() === square.getFile());
        };

        /**
         * Determine if another square is the same rank.
         * @param {Square} square
         * @return {boolean}
         */
        this.isSameRank = function (square) {
            if (square === undefined) {
                return false;
            }
            return (this.getRank() === square.getRank());
        };

        /**
         * Change the current file.
         * @param {string} file - A single character representing
         * the letter of the new file.
         * @return {boolean}
         */
        this.setFile = function (file) {
            var newSquare;
            if (file === undefined) {
                return false;
            }
            newSquare = file + this.getRank();
            return setSquare(newSquare);
        };

        /**
         * Change the current rank.
         * @param {string} rank - A single character representing
         * the number of the new rank.
         * @return {boolean}
         */
        this.setRank = function (rank) {
            var newSquare;
            if (rank === undefined) {
                return false;
            }
            newSquare = this.getFile() + rank;
            return setSquare(newSquare);
        };

        /**
         * Advance one step toward a new square.
         * @param {Square} square
         * @return {boolean}
         */
        this.stepTo = function (square) {
            var fileDiff,
                rankDiff;

            if (!this.isQueenMove(square)) {
                return false;
            }

            fileDiff = this.diffFile(square);
            fileDiff = Math.abs(fileDiff) / fileDiff;
            this.addFile(fileDiff);

            rankDiff = this.diffRank(square);
            rankDiff = Math.abs(rankDiff) / rankDiff;
            this.addRank(rankDiff);

            return true;
        };

        /**
         * @returns {string}
         */
        this.toString = function () {
            return name;
        };

        if (typeof anSquare === 'string') {
            setSquare(anSquare);
        }
    }

    Square.getAllSquares = function () {
        var i,
            j
            squareList = [];

        for (i = 1; i <= 8; i++) {
            for (j = 1; j <= 8; j++) {
                square = new Square(String.fromCharCode(i + 96) + j);
                squareList.push(square);
            }
        }

        return squareList;
    };

    return Square;

}(CHESS);

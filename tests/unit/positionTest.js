QUnit.module('Position');

QUnit.test('Construct an empty position', function (assert) {
    var position = new CHESS.Position();

    assert.notOk(position.isWhiteToMove(), 'White is not to move');
    assert.notOk(position.canWhiteCastleKingside(), 'White cannot castle kingside');
    assert.notOk(position.canWhiteCastleQueenside(), 'White cannot castle queenside');
    assert.notOk(position.canBlackCastleKingside(), 'Black cannot castle kingside');
    assert.notOk(position.canBlackCastleQueenside(), 'Black cannot castle queenside');
    assert.strictEqual(position.getColorToMove(), '', 'No color to move');
    assert.strictEqual(position.getEnPassantSquare(), '-', 'No en passant square');
});

QUnit.test('Construct an invalid position', function (assert) {
    var position = new CHESS.Position('invalid position');

    assert.notOk(position.isWhiteToMove(), 'White is not to move');
    assert.notOk(position.canWhiteCastleKingside(), 'White cannot castle kingside');
    assert.notOk(position.canWhiteCastleQueenside(), 'White cannot castle queenside');
    assert.notOk(position.canBlackCastleKingside(), 'Black cannot castle kingside');
    assert.notOk(position.canBlackCastleQueenside(), 'Black cannot castle queenside');
    assert.strictEqual(position.getColorToMove(), '', 'No color to move');
    assert.strictEqual(position.getEnPassantSquare(), '-', 'No en passant square');
});

QUnit.test('Construct a valid position', function (assert) {
    var fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        position = new CHESS.Position(fen);

    assert.ok(position.isWhiteToMove(), 'White to move');
    assert.ok(position.canWhiteCastleKingside(), 'White can castle kingside');
    assert.ok(position.canWhiteCastleQueenside(), 'White can castle queenside');
    assert.ok(position.canBlackCastleKingside(), 'Black can castle kingside');
    assert.ok(position.canBlackCastleQueenside(), 'Black can castle queenside');
    assert.strictEqual(position.getColorToMove(), 'w', 'White to move');
    assert.strictEqual(position.getEnPassantSquare(), '-', 'No en passant square');
});

QUnit.test('Determine the piece that is on a given square', function (assert) {
    var fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        position = new CHESS.Position(fen),
        piece = position.getPiece('e1');

    assert.ok(piece.isWhite() && piece.isKing(), 'Found a white king on e1');
});

QUnit.test('Set a piece on a given square', function (assert) {
    var fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        position = new CHESS.Position(fen),
        piece;

    position.setPiece('e4', '', 'wk');
    piece = position.getPiece('e4');

    assert.ok(piece.isWhite() && piece.isKing(), 'Found a white king on e4');
});

QUnit.test('Get FEN', function (assert) {
    var fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        position = new CHESS.Position(fen);

    assert.strictEqual(position.getFen(), fen, 'FEN is correct');
});

QUnit.test('Get FEN with partially filled rows', function (assert) {
    var fen = '1nbqkbn1/p1pppp1p/8/8/8/8/3P4/R2KB2R w KQkq - 0 1',
        position = new CHESS.Position(fen);
        position = new CHESS.Position(fen);

    assert.strictEqual(position.getFen(), fen, 'FEN is correct');
});

QUnit.test('Set castling', function (assert) {
    var position = new CHESS.Position();

    position.setWhiteCastleKingside(true);
    position.setWhiteCastleQueenside(true);
    position.setBlackCastleKingside(true);
    position.setBlackCastleQueenside(true);

    assert.ok(position.canWhiteCastleKingside(), 'White can castle kingside');
    assert.ok(position.canWhiteCastleQueenside(), 'White can castle queenside');
    assert.ok(position.canBlackCastleKingside(), 'Black can castle kingside');
    assert.ok(position.canBlackCastleQueenside(), 'Black can castle queenside');
});

QUnit.test('Set en passant square', function (assert) {
    var position = new CHESS.Position(),
        square = '';

    position.setEnPassantSquare(square);
    assert.strictEqual(position.getEnPassantSquare(), '-', 'En passant square is -');

    square = 'e2';
    position.setEnPassantSquare(square);
    assert.strictEqual(position.getEnPassantSquare(), '-', 'En passant square is -');

    square = 'e3';
    position.setEnPassantSquare(square);
    assert.strictEqual(position.getEnPassantSquare(), square, 'En passant square is ' + square);
});

QUnit.test('Set color to move', function (assert) {
    var position = new CHESS.Position();

    position.setWhiteToMove();
    assert.ok(position.isWhiteToMove(), 'White to move');

    position.setBlackToMove();
    assert.notOk(position.isWhiteToMove(), 'White is not to move');
});

QUnit.test('FEN with no castling', function (assert) {
    var fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        newFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1',
        position = new CHESS.Position(fen);

    position.setWhiteCastleKingside(false);
    position.setWhiteCastleQueenside(false);
    position.setBlackCastleKingside(false);
    position.setBlackCastleQueenside(false);

    assert.strictEqual(position.getFen(), newFen, 'FEN is correct');
});


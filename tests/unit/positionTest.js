QUnit.module('Position');

QUnit.test('Construct an empty position', function (assert) {
    var position = new CHESS.Position();

    assert.notOk(position.isWhiteToMove(), 'White is not to move');
    assert.notOk(position.canWhiteCastleKingside(), 'White cannot castle kingside');
    assert.notOk(position.canWhiteCastleQueenside(), 'White cannot castle queenside');
    assert.notOk(position.canBlackCastleKingside(), 'Black cannot castle kingside');
    assert.notOk(position.canBlackCastleQueenside(), 'Black cannot castle queenside');
    assert.strictEqual(position.getColorToMove(), '', 'No color to move');
    assert.ok(position.getEnPassantSquare().isNull(), 'No en passant square');
});

QUnit.test('Construct an invalid position', function (assert) {
    var position = new CHESS.Position('invalid position');

    assert.notOk(position.isWhiteToMove(), 'White is not to move');
    assert.notOk(position.canWhiteCastleKingside(), 'White cannot castle kingside');
    assert.notOk(position.canWhiteCastleQueenside(), 'White cannot castle queenside');
    assert.notOk(position.canBlackCastleKingside(), 'Black cannot castle kingside');
    assert.notOk(position.canBlackCastleQueenside(), 'Black cannot castle queenside');
    assert.strictEqual(position.getColorToMove(), '', 'No color to move');
    assert.ok(position.getEnPassantSquare().isNull(), 'No en passant square');
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
    assert.ok(position.getEnPassantSquare().isNull(), 'No en passant square');
});

QUnit.test('Determine the piece that is on a given square', function (assert) {
    var fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        position = new CHESS.Position(fen),
        piece = position.getPiece(new CHESS.Square('e1'));

    assert.ok(piece.isWhite() && piece.isKing(), 'Found a white king on e1');
});

QUnit.test('Set a piece on a given square', function (assert) {
    var fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        position = new CHESS.Position(fen),
        piece;

    position.setPiece(new CHESS.Square('e4'), '', 'wk');
    piece = position.getPiece(new CHESS.Square('e4'));

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
    var position = new CHESS.Position();

    position.setEnPassantSquare(new CHESS.Square());
    assert.ok(position.getEnPassantSquare().isNull(), 'Empty en passant square is not set');

    position.setEnPassantSquare(new CHESS.Square('e2'));
    assert.ok(position.getEnPassantSquare().isNull(), 'Invalid en passant square is not set');

    position.setEnPassantSquare(new CHESS.Square('e3'));
    assert.strictEqual(position.getEnPassantSquare().getName(), 'e3', 'Valid en passant square is e3');
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

QUnit.test('Clone position', function (assert) {
    var fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        position = new CHESS.Position(fen),
        clone;

    clone = position.clone();
    assert.strictEqual(clone.getFen(), position.getFen(), 'Clone is identical to position');
    
    position.setBlackToMove();
    assert.notStrictEqual(clone.getFen(), position.getFen(), 'Clone is not identical to position');
});

QUnit.test('Find piece', function (assert) {
    var fen,
        position,
        squares;

    position = new CHESS.Position(),
    squares = position.findPiece();
    assert.strictEqual(squares.length, 0, '0 squares found');

    position = new CHESS.Position(),
    squares = position.findPiece('wk');
    assert.strictEqual(squares.length, 0, '0 squares found');

    fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    position = new CHESS.Position(fen),
    squares = position.findPiece();
    assert.strictEqual(squares.length, 0, '0 squares found');

    squares = position.findPiece('foobar');
    assert.strictEqual(squares.length, 0, '0 squares found');

    squares = position.findPiece('wk');
    assert.strictEqual(squares.length, 1, '1 square found');
    assert.strictEqual(squares[0].getName(), 'e1', 'White king is on e1');

    squares = position.findPiece('bp');
    assert.strictEqual(squares.length, 8, '8 squares found');
    assert.strictEqual(squares[0].getName(), 'a7', 'Black pawn on a7');
    assert.strictEqual(squares[1].getName(), 'b7', 'Black pawn on b7');
    assert.strictEqual(squares[2].getName(), 'c7', 'Black pawn on c7');
    assert.strictEqual(squares[3].getName(), 'd7', 'Black pawn on d7');
    assert.strictEqual(squares[4].getName(), 'e7', 'Black pawn on e7');
    assert.strictEqual(squares[5].getName(), 'f7', 'Black pawn on f7');
    assert.strictEqual(squares[6].getName(), 'g7', 'Black pawn on g7');
    assert.strictEqual(squares[7].getName(), 'h7', 'Black pawn on h7');
});

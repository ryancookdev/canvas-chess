QUnit.module('Piece');

QUnit.test('Empty piece', function (assert) {
    var piece = new CHESS.Piece();
    assert.ok(piece.isEmpty(), 'Piece is empty');
    assert.notOk(piece.isKing(), 'Not a king');
    assert.notOk(piece.isQueen(), 'Not a Queen');
    assert.notOk(piece.isRook(), 'Not a rook');
    assert.notOk(piece.isBishop(), 'Not a Bishop');
    assert.notOk(piece.isKnight(), 'Not a knight');
    assert.notOk(piece.isPawn(), 'Not a pawn');
    assert.notOk(piece.isBlack(), 'Not black');
    assert.notOk(piece.isWhite(), 'Not white');
    assert.strictEqual(piece.toString(), '', 'No string value');
});

QUnit.test('White king', function (assert) {
    var piece = new CHESS.Piece('wk');
    assert.notOk(piece.isEmpty(), 'Not empty');
    assert.ok(piece.isKing(), 'Piece is a king');
    assert.notOk(piece.isQueen(), 'Not a Queen');
    assert.notOk(piece.isRook(), 'Not a rook');
    assert.notOk(piece.isBishop(), 'Not a Bishop');
    assert.notOk(piece.isKnight(), 'Not a knight');
    assert.notOk(piece.isPawn(), 'Not a pawn');
    assert.notOk(piece.isBlack(), 'Not black');
    assert.ok(piece.isWhite(), 'Color is white');
    assert.strictEqual(piece.toString(), 'wk', 'String value is wk');
});

QUnit.test('White queen', function (assert) {
    var piece = new CHESS.Piece('wq');
    assert.notOk(piece.isEmpty(), 'Not empty');
    assert.notOk(piece.isKing(), 'Not a king');
    assert.ok(piece.isQueen(), 'Piece is a Queen');
    assert.notOk(piece.isRook(), 'Not a rook');
    assert.notOk(piece.isBishop(), 'Not a Bishop');
    assert.notOk(piece.isKnight(), 'Not a knight');
    assert.notOk(piece.isPawn(), 'Not a pawn');
    assert.notOk(piece.isBlack(), 'Not black');
    assert.ok(piece.isWhite(), 'Color is white');
    assert.strictEqual(piece.toString(), 'wq', 'String value is wq');
});

QUnit.test('White rook', function (assert) {
    var piece = new CHESS.Piece('wr');
    assert.notOk(piece.isEmpty(), 'Not empty');
    assert.notOk(piece.isKing(), 'Not a king');
    assert.notOk(piece.isQueen(), 'Not a Queen');
    assert.ok(piece.isRook(), 'Piece is a rook');
    assert.notOk(piece.isBishop(), 'Not a Bishop');
    assert.notOk(piece.isKnight(), 'Not a knight');
    assert.notOk(piece.isPawn(), 'Not a pawn');
    assert.notOk(piece.isBlack(), 'Not black');
    assert.ok(piece.isWhite(), 'Color is white');
    assert.strictEqual(piece.toString(), 'wr', 'String value is wr');
});

QUnit.test('White bishop', function (assert) {
    var piece = new CHESS.Piece('wb');
    assert.notOk(piece.isEmpty(), 'Not empty');
    assert.notOk(piece.isKing(), 'Not a king');
    assert.notOk(piece.isQueen(), 'Not a Queen');
    assert.notOk(piece.isRook(), 'Not a rook');
    assert.ok(piece.isBishop(), 'Piece is a Bishop');
    assert.notOk(piece.isKnight(), 'Not a knight');
    assert.notOk(piece.isPawn(), 'Not a pawn');
    assert.notOk(piece.isBlack(), 'Not black');
    assert.ok(piece.isWhite(), 'Color is white');
    assert.strictEqual(piece.toString(), 'wb', 'String value is wb');
});

QUnit.test('White knight', function (assert) {
    var piece = new CHESS.Piece('wn');
    assert.notOk(piece.isEmpty(), 'Not empty');
    assert.notOk(piece.isKing(), 'Not a king');
    assert.notOk(piece.isQueen(), 'Not a Queen');
    assert.notOk(piece.isRook(), 'Not a rook');
    assert.notOk(piece.isBishop(), 'Not a Bishop');
    assert.ok(piece.isKnight(), 'Piece is a knight');
    assert.notOk(piece.isPawn(), 'Not a pawn');
    assert.notOk(piece.isBlack(), 'Not black');
    assert.ok(piece.isWhite(), 'Color is white');
    assert.strictEqual(piece.toString(), 'wn', 'String value is wn');
});

QUnit.test('White pawn', function (assert) {
    var piece = new CHESS.Piece('wp');
    assert.notOk(piece.isEmpty(), 'Not empty');
    assert.notOk(piece.isKing(), 'Not a king');
    assert.notOk(piece.isQueen(), 'Not a Queen');
    assert.notOk(piece.isRook(), 'Not a rook');
    assert.notOk(piece.isBishop(), 'Not a Bishop');
    assert.notOk(piece.isKnight(), 'Not a knight');
    assert.ok(piece.isPawn(), 'Piece is a pawn');
    assert.notOk(piece.isBlack(), 'Not black');
    assert.ok(piece.isWhite(), 'Color is white');
    assert.strictEqual(piece.toString(), 'wp', 'String value is wp');
});

QUnit.test('Black king', function (assert) {
    var piece = new CHESS.Piece('bk');
    assert.notOk(piece.isEmpty(), 'Not empty');
    assert.ok(piece.isKing(), 'Piece is a king');
    assert.notOk(piece.isQueen(), 'Not a Queen');
    assert.notOk(piece.isRook(), 'Not a rook');
    assert.notOk(piece.isBishop(), 'Not a Bishop');
    assert.notOk(piece.isKnight(), 'Not a knight');
    assert.notOk(piece.isPawn(), 'Not a pawn');
    assert.ok(piece.isBlack(), 'Color is black');
    assert.notOk(piece.isWhite(), 'Not white');
    assert.strictEqual(piece.toString(), 'bk', 'String value is bk');
});

QUnit.test('Black queen', function (assert) {
    var piece = new CHESS.Piece('bq');
    assert.notOk(piece.isEmpty(), 'Not empty');
    assert.notOk(piece.isKing(), 'Not a king');
    assert.ok(piece.isQueen(), 'Piece is a Queen');
    assert.notOk(piece.isRook(), 'Not a rook');
    assert.notOk(piece.isBishop(), 'Not a Bishop');
    assert.notOk(piece.isKnight(), 'Not a knight');
    assert.notOk(piece.isPawn(), 'Not a pawn');
    assert.ok(piece.isBlack(), 'Color is black');
    assert.notOk(piece.isWhite(), 'Not white');
    assert.strictEqual(piece.toString(), 'bq', 'String value is bq');
});

QUnit.test('Black rook', function (assert) {
    var piece = new CHESS.Piece('br');
    assert.notOk(piece.isEmpty(), 'Not empty');
    assert.notOk(piece.isKing(), 'Not a king');
    assert.notOk(piece.isQueen(), 'Not a Queen');
    assert.ok(piece.isRook(), 'Piece is a rook');
    assert.notOk(piece.isBishop(), 'Not a Bishop');
    assert.notOk(piece.isKnight(), 'Not a knight');
    assert.notOk(piece.isPawn(), 'Not a pawn');
    assert.ok(piece.isBlack(), 'Color is black');
    assert.notOk(piece.isWhite(), 'Not white');
    assert.strictEqual(piece.toString(), 'br', 'String value is br');
});

QUnit.test('Black bishop', function (assert) {
    var piece = new CHESS.Piece('bb');
    assert.notOk(piece.isEmpty(), 'Not empty');
    assert.notOk(piece.isKing(), 'Not a king');
    assert.notOk(piece.isQueen(), 'Not a Queen');
    assert.notOk(piece.isRook(), 'Not a rook');
    assert.ok(piece.isBishop(), 'Piece is a Bishop');
    assert.notOk(piece.isKnight(), 'Not a knight');
    assert.notOk(piece.isPawn(), 'Not a pawn');
    assert.ok(piece.isBlack(), 'Color is black');
    assert.notOk(piece.isWhite(), 'Not white');
    assert.strictEqual(piece.toString(), 'bb', 'String value is bb');
});

QUnit.test('Black knight', function (assert) {
    var piece = new CHESS.Piece('bn');
    assert.notOk(piece.isEmpty(), 'Not empty');
    assert.notOk(piece.isKing(), 'Not a king');
    assert.notOk(piece.isQueen(), 'Not a Queen');
    assert.notOk(piece.isRook(), 'Not a rook');
    assert.notOk(piece.isBishop(), 'Not a Bishop');
    assert.ok(piece.isKnight(), 'Piece is a knight');
    assert.notOk(piece.isPawn(), 'Not a pawn');
    assert.ok(piece.isBlack(), 'Color is black');
    assert.notOk(piece.isWhite(), 'Not white');
    assert.strictEqual(piece.toString(), 'bn', 'String value is bn');
});

QUnit.test('Black pawn', function (assert) {
    var piece = new CHESS.Piece('bp');
    assert.notOk(piece.isEmpty(), 'Not empty');
    assert.notOk(piece.isKing(), 'Not a king');
    assert.notOk(piece.isQueen(), 'Not a Queen');
    assert.notOk(piece.isRook(), 'Not a rook');
    assert.notOk(piece.isBishop(), 'Not a Bishop');
    assert.notOk(piece.isKnight(), 'Not a knight');
    assert.ok(piece.isPawn(), 'Piece is a pawn');
    assert.ok(piece.isBlack(), 'Color is black');
    assert.notOk(piece.isWhite(), 'Not white');
    assert.strictEqual(piece.toString(), 'bp', 'String value is bp');
});

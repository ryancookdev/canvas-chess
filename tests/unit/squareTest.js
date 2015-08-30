QUnit.module('Square');

QUnit.test('Create a square', function (assert) {
    var square;

    square = new CHESS.Square();
    assert.strictEqual(square.name, '', 'Square is not set');

    square = new CHESS.Square('4e');
    assert.strictEqual(square.name, '', 'Square is not set');

    square = new CHESS.Square('e4');
    assert.strictEqual(square.name, 'e4', 'Square is e4');
});

QUnit.test('Add rank', function (assert) {
    var square,
        result;

    square = new CHESS.Square('a1');
    result = square.addRank();
    assert.strictEqual(square.name, 'a1', 'a1 + (undefined rank) = a1');
    assert.notOk(result, 'Return failure');

    square = new CHESS.Square('a1');
    result = square.addRank(1);
    assert.strictEqual(square.name, 'a2', 'a1 + (1 rank) = a2');
    assert.ok(result, 'Return success');

    square = new CHESS.Square('a1');
    result = square.addRank(7);
    assert.strictEqual(square.name, 'a8', 'a1 + (7 rank) = a8');
    assert.ok(result, 'Return success');

    square = new CHESS.Square('a1');
    result = square.addRank(-1);
    assert.strictEqual(square.name, 'a1', 'a1 - (1 rank) = a1');
    assert.notOk(result, 'Return failure');

    square = new CHESS.Square('a1');
    result = square.addRank(8);
    assert.strictEqual(square.name, 'a1', 'a1 + (8 rank) = a1');
    assert.notOk(result, 'Return failure');
});

QUnit.test('Add file', function (assert) {
    var square,
        result;

    square = new CHESS.Square('a1');
    result = square.addFile();
    assert.strictEqual(square.name, 'a1', 'a1 + (undefined file) = a1');
    assert.notOk(result, 'Return failure');

    square = new CHESS.Square('a1');
    result = square.addFile(1);
    assert.strictEqual(square.name, 'b1', 'a1 + (1 file) = b1');
    assert.ok(result, 'Return success');

    square = new CHESS.Square('a1');
    result = square.addFile(7);
    assert.strictEqual(square.name, 'h1', 'a1 + (7 file) = h1');
    assert.ok(result, 'Return success');

    square = new CHESS.Square('a1');
    result = square.addFile(-1);
    assert.strictEqual(square.name, 'a1', 'a1 - (1 file) = a1');
    assert.notOk(result, 'Return failure');

    square = new CHESS.Square('a1');
    result = square.addFile(8);
    assert.strictEqual(square.name, 'a1', 'a1 + (8 file) = a1');
    assert.notOk(result, 'Return failure');
});

QUnit.test('Set rank', function (assert) {
    var square,
        result;

    square = new CHESS.Square('a1');
    result = square.setRank();
    assert.strictEqual(square.name, 'a1', 'a1 => a(undefined) => a1');
    assert.notOk(result, 'Return failure');

    square = new CHESS.Square('a1');
    result = square.setRank(4);
    assert.strictEqual(square.name, 'a4', 'a1 => a(4) => a4');
    assert.ok(result, 'Return success');

    square = new CHESS.Square('a1');
    result = square.setRank(0);
    assert.strictEqual(square.name, 'a1', 'a1 => a(0) => a1');
    assert.notOk(result, 'Return failure');

    square = new CHESS.Square('a1');
    result = square.setRank(9);
    assert.strictEqual(square.name, 'a1', 'a1 => a(9) => a1');
    assert.notOk(result, 'Return failure');

});

QUnit.test('Set file', function (assert) {
    var square,
        result;

    square = new CHESS.Square('a1');
    result = square.setFile();
    assert.strictEqual(square.name, 'a1', 'a1 => (undefined)1 => a1');
    assert.notOk(result, 'Return failure');

    square = new CHESS.Square('a1');
    result = square.setFile('d');
    assert.strictEqual(square.name, 'd1', 'a1 => (d)1 => d1');
    assert.ok(result, 'Return success');

    square = new CHESS.Square('a1');
    result = square.setFile(4);
    assert.strictEqual(square.name, 'a1', 'a1 => (4)1 => a1');
    assert.notOk(result, 'Return failure');

    square = new CHESS.Square('a1');
    result = square.setFile('i');
    assert.strictEqual(square.name, 'a1', 'a1 => (i)1 => a1');
    assert.notOk(result, 'Return failure');

});

QUnit.test('Is same file/rank', function (assert) {
    var square = new CHESS.Square('a1');

    assert.notOk(square.isSameFile(), 'a1/(undefined) not same file');
    assert.ok(square.isSameFile('a2'), 'a1/a2(str) same file');
    assert.ok(square.isSameFile(new CHESS.Square('a2')), 'a1/a2(obj) same file');
    assert.notOk(square.isSameFile('b1'), 'a1/b1(str) not same file');
    assert.notOk(square.isSameFile(new CHESS.Square('b1')), 'a1/b1(obj) not same file');

    assert.notOk(square.isSameRank(), 'a1/(undefined) not same rank');
    assert.notOk(square.isSameRank('a2'), 'a1/a2(str) not same rank');
    assert.notOk(square.isSameRank(new CHESS.Square('a2')), 'a1/a2(obj) not same rank');
    assert.ok(square.isSameRank('b1'), 'a1/b1(str) same rank');
    assert.ok(square.isSameRank(new CHESS.Square('b1')), 'a1/b1(obj) same rank');
});

QUnit.test('Difference in rank between two squares', function (assert) {
    var square = new CHESS.Square('e4');

    assert.strictEqual(square.compareRank(), 0, 'e4 is 0 ranks from undefined');
    assert.strictEqual(square.compareRank('e4'), 0, 'e4 is 0 ranks from e4');
    assert.strictEqual(square.compareRank('a4'), 0, 'e4 is 0 ranks from a4');
    assert.strictEqual(square.compareRank('e1'), 3, 'e4 is 3 ranks from e1');
    assert.strictEqual(square.compareRank('e8'), 4, 'e4 is 4 ranks from e8');
});

QUnit.test('Difference in file between two squares', function (assert) {
    var square = new CHESS.Square('e4');

    assert.strictEqual(square.compareFile(), 0, 'e4 is 0 files from undefined');
    assert.strictEqual(square.compareFile('e4'), 0, 'e4 is 0 files from e4');
    assert.strictEqual(square.compareFile('e1'), 0, 'e4 is 0 files from e1');
    assert.strictEqual(square.compareFile('a4'), 4, 'e4 is 4 files from a4');
    assert.strictEqual(square.compareFile('h4'), 3, 'e4 is 3 files from h4');
});

QUnit.test('Is bishop move', function (assert) {
    var square = new CHESS.Square('e4');

    assert.notOk(square.isBishopMove(), 'e4 to e4, not a bishop move');
    assert.notOk(square.isBishopMove('e4'), 'e4 to e4, not a bishop move');
    assert.notOk(square.isBishopMove('e1'), 'e4 to e1, not a bishop move');
    assert.ok(square.isBishopMove('h1'), 'e4 to h1, bishop move');
    assert.ok(square.isBishopMove('a8'), 'e4 to a8, bishop move');
    assert.ok(square.isBishopMove('b1'), 'e4 to b1, bishop move');
    assert.ok(square.isBishopMove('h7'), 'e4 to h7, bishop move');
});

QUnit.test('Is king move', function (assert) {
    var square = new CHESS.Square('e4');

    assert.notOk(square.isKingMove(), 'e4 to undefined, not a king move');
    assert.notOk(square.isKingMove('e4'), 'e4 to e4, not a king move');
    assert.notOk(square.isKingMove('e6'), 'e4 to e6, not a king move');
    assert.ok(square.isKingMove('d5'), 'e4 to d5, king move');
    assert.ok(square.isKingMove('e5'), 'e4 to e5, king move');
    assert.ok(square.isKingMove('f5'), 'e4 to f5, king move');
    assert.ok(square.isKingMove('d4'), 'e4 to d4, king move');
    assert.ok(square.isKingMove('f4'), 'e4 to f4, king move');
    assert.ok(square.isKingMove('d3'), 'e4 to d3, king move');
    assert.ok(square.isKingMove('e3'), 'e4 to e3, king move');
    assert.ok(square.isKingMove('f3'), 'e4 to f3, king move');
});

QUnit.test('Is knight move', function (assert) {
    var square = new CHESS.Square('e4');

    assert.notOk(square.isKnightMove(), 'e4 to undefined, not a knight move');
    assert.notOk(square.isKnightMove('e4'), 'e4 to e4, not a knight move');
    assert.notOk(square.isKnightMove('d5'), 'e4 to d5, not knight move');
    assert.ok(square.isKnightMove('d6'), 'e4 to d6, knight move');
    assert.ok(square.isKnightMove('f6'), 'e4 to f6, knight move');
    assert.ok(square.isKnightMove('c5'), 'e4 to c5, knight move');
    assert.ok(square.isKnightMove('g5'), 'e4 to g5, knight move');
    assert.ok(square.isKnightMove('c3'), 'e4 to c3, knight move');
    assert.ok(square.isKnightMove('g3'), 'e4 to g3, knight move');
    assert.ok(square.isKnightMove('d2'), 'e4 to d2, knight move');
    assert.ok(square.isKnightMove('f2'), 'e4 to f2, knight move');
});

QUnit.test('Is queen move', function (assert) {
    var square = new CHESS.Square('e4');

    assert.notOk(square.isQueenMove(), 'e4 to undefined, not a queen move');
    assert.notOk(square.isQueenMove('e4'), 'e4 to e4, not a queen move');
    assert.notOk(square.isQueenMove('d2'), 'e4 to d2, not queen move');
    assert.ok(square.isQueenMove('e8'), 'e4 to e8, queen move');
    assert.ok(square.isQueenMove('e1'), 'e4 to e1, queen move');
    assert.ok(square.isQueenMove('a4'), 'e4 to a4, queen move');
    assert.ok(square.isQueenMove('h4'), 'e4 to h4, queen move');
    assert.ok(square.isQueenMove('h1'), 'e4 to h1, queen move');
    assert.ok(square.isQueenMove('a8'), 'e4 to a8, queen move');
    assert.ok(square.isQueenMove('b1'), 'e4 to b1, queen move');
    assert.ok(square.isQueenMove('h7'), 'e4 to h7, queen move');
});

QUnit.test('Is rook move', function (assert) {
    var square = new CHESS.Square('e4');

    assert.notOk(square.isRookMove(), 'e4 to undefined, not a rook move');
    assert.notOk(square.isRookMove('e4'), 'e4 to e4, not a rook move');
    assert.notOk(square.isRookMove('d5'), 'e4 to d5, not rook move');
    assert.ok(square.isRookMove('e8'), 'e4 to e8, rook move');
    assert.ok(square.isRookMove('e1'), 'e4 to e1, rook move');
    assert.ok(square.isRookMove('a4'), 'e4 to a4, rook move');
    assert.ok(square.isRookMove('h4'), 'e4 to h4, rook move');
});

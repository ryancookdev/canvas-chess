QUnit.module('Square');

QUnit.test('Create a square', function (assert) {
    var square;

    square = new CHESS.Square();
    assert.strictEqual(square.getName(), '', 'Square is not set');

    square = new CHESS.Square('4e');
    assert.strictEqual(square.getName(), '', 'Square is not set');

    square = new CHESS.Square('e10');
    assert.strictEqual(square.getName(), '', 'Square is not set');

    square = new CHESS.Square('e4');
    assert.strictEqual(square.getName(), 'e4', 'Square is e4');
});

QUnit.test('Add rank', function (assert) {
    var square,
        result;

    square = new CHESS.Square('a1');
    result = square.addRank();
    assert.strictEqual(square.getName(), 'a1', 'a1 + (undefined rank) = a1');
    assert.notOk(result, 'Return failure');

    square = new CHESS.Square('a1');
    result = square.addRank(1);
    assert.strictEqual(square.getName(), 'a2', 'a1 + (1 rank) = a2');
    assert.ok(result, 'Return success');

    square = new CHESS.Square('a1');
    result = square.addRank(7);
    assert.strictEqual(square.getName(), 'a8', 'a1 + (7 rank) = a8');
    assert.ok(result, 'Return success');

    square = new CHESS.Square('a1');
    result = square.addRank(-1);
    assert.strictEqual(square.getName(), 'a1', 'a1 - (1 rank) = a1');
    assert.notOk(result, 'Return failure');

    square = new CHESS.Square('a1');
    result = square.addRank(8);
    assert.strictEqual(square.getName(), 'a1', 'a1 + (8 rank) = a1');
    assert.notOk(result, 'Return failure');
});

QUnit.test('Add file', function (assert) {
    var square,
        result;

    square = new CHESS.Square();
    result = square.addFile();
    assert.ok(square.isNull(), 'Null square + undefined file = null square');

    square = new CHESS.Square();
    result = square.addFile(1);
    assert.ok(square.isNull(), 'Null square + 1 file = null square');

    square = new CHESS.Square('a1');
    result = square.addFile();
    assert.strictEqual(square.getName(), 'a1', 'a1 + (undefined file) = a1');
    assert.notOk(result, 'Return failure');

    square = new CHESS.Square('a1');
    result = square.addFile(1);
    assert.strictEqual(square.getName(), 'b1', 'a1 + (1 file) = b1');
    assert.ok(result, 'Return success');

    square = new CHESS.Square('a1');
    result = square.addFile(7);
    assert.strictEqual(square.getName(), 'h1', 'a1 + (7 file) = h1');
    assert.ok(result, 'Return success');

    square = new CHESS.Square('a1');
    result = square.addFile(-1);
    assert.strictEqual(square.getName(), 'a1', 'a1 - (1 file) = a1');
    assert.notOk(result, 'Return failure');

    square = new CHESS.Square('a1');
    result = square.addFile(8);
    assert.strictEqual(square.getName(), 'a1', 'a1 + (8 file) = a1');
    assert.notOk(result, 'Return failure');
});

QUnit.test('Set rank', function (assert) {
    var square,
        result;

    square = new CHESS.Square('a1');
    result = square.setRank();
    assert.strictEqual(square.getName(), 'a1', 'a1 => a(undefined) => a1');
    assert.notOk(result, 'Return failure');

    square = new CHESS.Square('a1');
    result = square.setRank(4);
    assert.strictEqual(square.getName(), 'a4', 'a1 => a(4) => a4');
    assert.ok(result, 'Return success');

    square = new CHESS.Square('a1');
    result = square.setRank(0);
    assert.strictEqual(square.getName(), 'a1', 'a1 => a(0) => a1');
    assert.notOk(result, 'Return failure');

    square = new CHESS.Square('a1');
    result = square.setRank(9);
    assert.strictEqual(square.getName(), 'a1', 'a1 => a(9) => a1');
    assert.notOk(result, 'Return failure');

});

QUnit.test('Set file', function (assert) {
    var square,
        result;

    square = new CHESS.Square('a1');
    result = square.setFile();
    assert.strictEqual(square.getName(), 'a1', 'a1 => (undefined)1 => a1');
    assert.notOk(result, 'Return failure');

    square = new CHESS.Square('a1');
    result = square.setFile('d');
    assert.strictEqual(square.getName(), 'd1', 'a1 => (d)1 => d1');
    assert.ok(result, 'Return success');

    square = new CHESS.Square('a1');
    result = square.setFile(4);
    assert.strictEqual(square.getName(), 'a1', 'a1 => (4)1 => a1');
    assert.notOk(result, 'Return failure');

    square = new CHESS.Square('a1');
    result = square.setFile('i');
    assert.strictEqual(square.getName(), 'a1', 'a1 => (i)1 => a1');
    assert.notOk(result, 'Return failure');

});

QUnit.test('Is same file/rank', function (assert) {
    var square = new CHESS.Square('a1');

    assert.notOk(square.isSameFile(), 'a1/(undefined) not same file');
    assert.ok(square.isSameFile(new CHESS.Square('a2')), 'a1/a2 same file');
    assert.notOk(square.isSameFile(new CHESS.Square('b1')), 'a1/b1 not same file');

    assert.notOk(square.isSameRank(), 'a1/(undefined) not same rank');
    assert.notOk(square.isSameRank(new CHESS.Square('a2')), 'a1/a2 not same rank');
    assert.ok(square.isSameRank(new CHESS.Square('b1')), 'a1/b1 same rank');
});

QUnit.test('Difference in rank between two squares', function (assert) {
    var square = new CHESS.Square('e4');

    assert.strictEqual(square.compareRank(), 0, 'e4 is 0 ranks from undefined');
    assert.strictEqual(square.compareRank(new CHESS.Square('e4')), 0, 'e4 is 0 ranks from e4');
    assert.strictEqual(square.compareRank(new CHESS.Square('a4')), 0, 'e4 is 0 ranks from a4');
    assert.strictEqual(square.compareRank(new CHESS.Square('e1')), 3, 'e4 is 3 ranks from e1');
    assert.strictEqual(square.compareRank(new CHESS.Square('e8')), 4, 'e4 is 4 ranks from e8');
    assert.strictEqual(square.diffRank(new CHESS.Square('e1')), -3, 'e4 is -3 ranks from e1');
});

QUnit.test('Difference in file between two squares', function (assert) {
    var square = new CHESS.Square('e4');

    assert.strictEqual(square.compareFile(), 0, 'e4 is 0 files from undefined');
    assert.strictEqual(square.compareFile(new CHESS.Square('e4')), 0, 'e4 is 0 files from e4');
    assert.strictEqual(square.compareFile(new CHESS.Square('e1')), 0, 'e4 is 0 files from e1');
    assert.strictEqual(square.compareFile(new CHESS.Square('a4')), 4, 'e4 is 4 files from a4');
    assert.strictEqual(square.compareFile(new CHESS.Square('h4')), 3, 'e4 is 3 files from h4');
    assert.strictEqual(square.diffFile(new CHESS.Square('a4')), -4, 'e4 is -4 files from a4');
});

QUnit.test('Is bishop move', function (assert) {
    var square = new CHESS.Square('e4');

    assert.notOk(square.isBishopMove(), 'e4 to e4, not a bishop move');
    assert.notOk(square.isBishopMove(new CHESS.Square('e4')), 'e4 to e4, not a bishop move');
    assert.notOk(square.isBishopMove(new CHESS.Square('e1')), 'e4 to e1, not a bishop move');
    assert.ok(square.isBishopMove(new CHESS.Square('h1')), 'e4 to h1, bishop move');
    assert.ok(square.isBishopMove(new CHESS.Square('a8')), 'e4 to a8, bishop move');
    assert.ok(square.isBishopMove(new CHESS.Square('b1')), 'e4 to b1, bishop move');
    assert.ok(square.isBishopMove(new CHESS.Square('h7')), 'e4 to h7, bishop move');
});

QUnit.test('Is king move', function (assert) {
    var square = new CHESS.Square('e4');

    assert.notOk(square.isKingMove(), 'e4 to undefined, not a king move');
    assert.notOk(square.isKingMove(new CHESS.Square('e4')), 'e4 to e4, not a king move');
    assert.notOk(square.isKingMove(new CHESS.Square('e6')), 'e4 to e6, not a king move');
    assert.ok(square.isKingMove(new CHESS.Square('d5')), 'e4 to d5, king move');
    assert.ok(square.isKingMove(new CHESS.Square('e5')), 'e4 to e5, king move');
    assert.ok(square.isKingMove(new CHESS.Square('f5')), 'e4 to f5, king move');
    assert.ok(square.isKingMove(new CHESS.Square('d4')), 'e4 to d4, king move');
    assert.ok(square.isKingMove(new CHESS.Square('f4')), 'e4 to f4, king move');
    assert.ok(square.isKingMove(new CHESS.Square('d3')), 'e4 to d3, king move');
    assert.ok(square.isKingMove(new CHESS.Square('e3')), 'e4 to e3, king move');
    assert.ok(square.isKingMove(new CHESS.Square('f3')), 'e4 to f3, king move');
});

QUnit.test('Is knight move', function (assert) {
    var square = new CHESS.Square('e4');

    assert.notOk(square.isKnightMove(), 'e4 to undefined, not a knight move');
    assert.notOk(square.isKnightMove(new CHESS.Square('e4')), 'e4 to e4, not a knight move');
    assert.notOk(square.isKnightMove(new CHESS.Square('d5')), 'e4 to d5, not knight move');
    assert.ok(square.isKnightMove(new CHESS.Square('d6')), 'e4 to d6, knight move');
    assert.ok(square.isKnightMove(new CHESS.Square('f6')), 'e4 to f6, knight move');
    assert.ok(square.isKnightMove(new CHESS.Square('c5')), 'e4 to c5, knight move');
    assert.ok(square.isKnightMove(new CHESS.Square('g5')), 'e4 to g5, knight move');
    assert.ok(square.isKnightMove(new CHESS.Square('c3')), 'e4 to c3, knight move');
    assert.ok(square.isKnightMove(new CHESS.Square('g3')), 'e4 to g3, knight move');
    assert.ok(square.isKnightMove(new CHESS.Square('d2')), 'e4 to d2, knight move');
    assert.ok(square.isKnightMove(new CHESS.Square('f2')), 'e4 to f2, knight move');
});

QUnit.test('Is queen move', function (assert) {
    var square = new CHESS.Square('e4');

    assert.notOk(square.isQueenMove(), 'e4 to undefined, not a queen move');
    assert.notOk(square.isQueenMove(new CHESS.Square('e4')), 'e4 to e4, not a queen move');
    assert.notOk(square.isQueenMove(new CHESS.Square('d2')), 'e4 to d2, not queen move');
    assert.ok(square.isQueenMove(new CHESS.Square('e8')), 'e4 to e8, queen move');
    assert.ok(square.isQueenMove(new CHESS.Square('e1')), 'e4 to e1, queen move');
    assert.ok(square.isQueenMove(new CHESS.Square('a4')), 'e4 to a4, queen move');
    assert.ok(square.isQueenMove(new CHESS.Square('h4')), 'e4 to h4, queen move');
    assert.ok(square.isQueenMove(new CHESS.Square('h1')), 'e4 to h1, queen move');
    assert.ok(square.isQueenMove(new CHESS.Square('a8')), 'e4 to a8, queen move');
    assert.ok(square.isQueenMove(new CHESS.Square('b1')), 'e4 to b1, queen move');
    assert.ok(square.isQueenMove(new CHESS.Square('h7')), 'e4 to h7, queen move');
});

QUnit.test('Is rook move', function (assert) {
    var square = new CHESS.Square('e4');

    assert.notOk(square.isRookMove(), 'e4 to undefined, not a rook move');
    assert.notOk(square.isRookMove(new CHESS.Square('e4')), 'e4 to e4, not a rook move');
    assert.notOk(square.isRookMove(new CHESS.Square('d5')), 'e4 to d5, not rook move');
    assert.ok(square.isRookMove(new CHESS.Square('e8')), 'e4 to e8, rook move');
    assert.ok(square.isRookMove(new CHESS.Square('e1')), 'e4 to e1, rook move');
    assert.ok(square.isRookMove(new CHESS.Square('a4')), 'e4 to a4, rook move');
    assert.ok(square.isRookMove(new CHESS.Square('h4')), 'e4 to h4, rook move');
});

QUnit.test('Step to new square', function (assert) {
    var square = new CHESS.Square('e4'),
        result;

    result = square.stepTo();
    assert.strictEqual(square.getName(), 'e4', 'e4 step to undefined => e4');
    assert.notOk(result, 'Did not step');

    result = square.stepTo(new CHESS.Square('d2'));
    assert.strictEqual(square.getName(), 'e4', 'e4 step to d2 => e4');
    assert.notOk(result, 'Did not step');

    result = square.stepTo(new CHESS.Square('e6'));
    assert.strictEqual(square.getName(), 'e5', 'e4 step to e6 => e5');
    assert.ok(result, 'Step successful');

    result = square.stepTo(new CHESS.Square('e6'));
    assert.strictEqual(square.getName(), 'e6', 'e5 step to e6 => e6');
    assert.ok(result, 'Step successful');

    result = square.stepTo(new CHESS.Square('e6'));
    assert.strictEqual(square.getName(), 'e6', 'e6 step to e6 => e6');
    assert.notOk(result, 'Did not step');
});


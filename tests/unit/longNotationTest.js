QUnit.module('LongNotation');

QUnit.test('Long notation - pawn move', function (assert) {
    var fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        position = new CHESS.Position(fen),
        shortNotation = 'e4',
        expectedLongNotation = 'e2-e4',
        longNotation = new CHESS.LongNotation(position),
        actualLongNotation = longNotation.getLongNotation(shortNotation);

    assert.strictEqual(actualLongNotation, expectedLongNotation);
});

QUnit.test('Long notation - white castle kingside', function (assert) {
    var fen = 'r3k2r/8/8/8/8/8/8/R3K2R w K - 0 1',
        position = new CHESS.Position(fen),
        shortNotation = 'O-O',
        expectedLongNotation = 'e1-g1',
        longNotation = new CHESS.LongNotation(position),
        actualLongNotation = longNotation.getLongNotation(shortNotation);

    assert.strictEqual(actualLongNotation, expectedLongNotation);
});

QUnit.test('Long notation - white castle queenside', function (assert) {
    var fen = 'r3k2r/8/8/8/8/8/8/R3K2R w Q - 0 1',
        position = new CHESS.Position(fen),
        shortNotation = 'O-O-O',
        expectedLongNotation = 'e1-c1',
        longNotation = new CHESS.LongNotation(position),
        actualLongNotation = longNotation.getLongNotation(shortNotation);

    assert.strictEqual(actualLongNotation, expectedLongNotation);
});

QUnit.test('Long notation - black castle kingside', function (assert) {
    var fen = 'r3k2r/8/8/8/8/8/8/R3K2R b k - 0 1',
        position = new CHESS.Position(fen),
        shortNotation = 'O-O',
        expectedLongNotation = 'e8-g8',
        longNotation = new CHESS.LongNotation(position),
        actualLongNotation = longNotation.getLongNotation(shortNotation);

    assert.strictEqual(actualLongNotation, expectedLongNotation);
});

QUnit.test('Long notation - black castle queenside', function (assert) {
    var fen = 'r3k2r/8/8/8/8/8/8/R3K2R b q - 0 1',
        position = new CHESS.Position(fen),
        shortNotation = 'O-O-O',
        expectedLongNotation = 'e8-c8',
        longNotation = new CHESS.LongNotation(position),
        actualLongNotation = longNotation.getLongNotation(shortNotation);

    assert.strictEqual(actualLongNotation, expectedLongNotation);
});

QUnit.test('Long notation - ambiguous piece with file', function (assert) {
    var fen = '4k3/8/8/8/8/8/R6R/4K3 w - - 0 1',
        position = new CHESS.Position(fen),
        shortNotation = 'Rae2+',
        expectedLongNotation = 'a2-e2',
        longNotation = new CHESS.LongNotation(position),
        actualLongNotation = longNotation.getLongNotation(shortNotation);

    assert.strictEqual(actualLongNotation, expectedLongNotation);
});

QUnit.test('Long notation - ambiguous piece with rank', function (assert) {
    var fen = '4k3/7R/8/8/8/8/7R/4K3 w - - 0 1',
        position = new CHESS.Position(fen),
        shortNotation = 'R7h4',
        expectedLongNotation = 'h7-h4',
        longNotation = new CHESS.LongNotation(position),
        actualLongNotation = longNotation.getLongNotation(shortNotation);

    assert.strictEqual(actualLongNotation, expectedLongNotation);
});

QUnit.test('Long notation - no ambiguity', function (assert) {
    var fen = '4k3/7R/8/8/8/8/7R/4K3 w - - 0 1',
        position = new CHESS.Position(fen),
        shortNotation = 'Ke2',
        expectedLongNotation = 'e1-e2',
        longNotation = new CHESS.LongNotation(position),
        actualLongNotation = longNotation.getLongNotation(shortNotation);

    assert.strictEqual(actualLongNotation, expectedLongNotation);
});

QUnit.test('Long notation - Bug with addFile loop skipping the first square', function (assert) {
    var fen = 'r2q1rk1/pppbbppp/3p1n2/6B1/3NP3/2NQ4/PPP2PPP/R4RK1 w - - 0 1',
        position = new CHESS.Position(fen),
        shortNotation = 'Rae1',
        expectedLongNotation = 'a1-e1',
        longNotation = new CHESS.LongNotation(position),
        actualLongNotation = longNotation.getLongNotation(shortNotation);

    assert.strictEqual(actualLongNotation, expectedLongNotation);
});

QUnit.test('Long notation - Bug with lower case piece letter "b" confused with file "b"', function (assert) {
    var fen = 'r3r1k1/pp1b1ppn/1qpp3p/8/2PNPP2/2NQ4/PP4PP/4RRK1 w - - 0 1',
        position = new CHESS.Position(fen),
        shortNotation = 'b3',
        expectedLongNotation = 'b2-b3',
        longNotation = new CHESS.LongNotation(position),
        actualLongNotation = longNotation.getLongNotation(shortNotation);

    assert.strictEqual(actualLongNotation, expectedLongNotation);
});

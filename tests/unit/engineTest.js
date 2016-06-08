QUnit.module('Engine');

QUnit.test('Is empty postion mate?', function (assert) {
    var fen,
        isMate,
        position;

    position = new CHESS.Position();
    isMate = CHESS.Engine.isMate(position);
    assert.notOk(isMate, 'Empty position is not mate');
});

QUnit.test('Is start postion mate?', function (assert) {
    var fen,
        isMate,
        position;

    fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    position = new CHESS.Position(fen);
    isMate = CHESS.Engine.isMate(position);
    assert.notOk(isMate, 'Start position is not mate');
});

QUnit.test('King can move out of mate', function (assert) {
    var fen,
        isMate,
        position;

    fen = '8/3K4/2q1q3/8/8/8/8/7k w - - 0 1';
    position = new CHESS.Position(fen);
    isMate = CHESS.Engine.isMate(position);
    assert.notOk(isMate, 'King can move up to escape mate');

    fen = '8/8/8/8/8/2q1q3/3K4/7k w - - 0 1';
    position = new CHESS.Position(fen);
    isMate = CHESS.Engine.isMate(position);
    assert.notOk(isMate, 'King can move down to escape mate');

    fen = '8/8/2q5/1K6/2q5/8/8/7k w - - 0 1';
    position = new CHESS.Position(fen);
    isMate = CHESS.Engine.isMate(position);
    assert.notOk(isMate, 'King can move left to escape mate');

    fen = '8/8/5q2/6K1/5q2/8/8/7k w - - 0 1';
    position = new CHESS.Position(fen);
    isMate = CHESS.Engine.isMate(position);
    assert.notOk(isMate, 'King can move right to escape mate');

    fen = '8/8/8/1Kq5/1q6/8/8/7k w - - 0 1';
    position = new CHESS.Position(fen);
    isMate = CHESS.Engine.isMate(position);
    assert.notOk(isMate, 'King can move up and left to escape mate');

    fen = '8/8/8/5qK1/6q1/8/8/7k w - - 0 1';
    position = new CHESS.Position(fen);
    isMate = CHESS.Engine.isMate(position);
    assert.notOk(isMate, 'King can move up and right to escape mate');

    fen = '8/8/8/6q1/5qK1/8/8/7k w - - 0 1';
    position = new CHESS.Position(fen);
    isMate = CHESS.Engine.isMate(position);
    assert.notOk(isMate, 'King can move down and right to escape mate');

    fen = '8/8/8/1q6/1Kq5/8/8/7k w - - 0 1';
    position = new CHESS.Position(fen);
    isMate = CHESS.Engine.isMate(position);
    assert.notOk(isMate, 'King can move down and left to escape mate');

});

QUnit.test('Capture the attacker', function (assert) {
    var fen,
        isMate,
        position;

    fen = 'Kqk5/8/8/8/8/8/8/1R6 w - - 0 1';
    position = new CHESS.Position(fen);
    isMate = CHESS.Engine.isMate(position);
    assert.notOk(isMate, 'Attacking piece can be captured');
});

QUnit.test('Block the check', function (assert) {
    var fen,
        isMate,
        position;

    fen = 'K7/8/8/8/8/2N5/8/qq6 w - - 0 1';
    position = new CHESS.Position(fen);
    isMate = CHESS.Engine.isMate(position);
    assert.notOk(isMate, 'Check can be blocked');

    fen = '6bk/5p2/7K/4B3/8/8/8/8 b - - 0 1';
    position = new CHESS.Position(fen);
    isMate = CHESS.Engine.isMate(position);
    assert.notOk(isMate, 'Check can be blocked by pawn move');

    fen = 'R5nk/8/6K1/4B3/8/8/8/8 b - - 0 1';
    position = new CHESS.Position(fen);
    isMate = CHESS.Engine.isMate(position);
    assert.ok(isMate, 'Check cannot be blocked by pinned piece');
});

QUnit.test('Escape mate by en passant', function (assert) {
    var fen,
        isMate,
        position;

    fen = '8/2q5/8/1pP5/K7/8/1q6/8 w - b6 0 1';
    position = new CHESS.Position(fen);
    isMate = CHESS.Engine.isMate(position);
    assert.notOk(isMate, 'Attacker can be captured en passant');
});

QUnit.test('Checkmate', function (assert) {
    var fen,
        isMate,
        position;

    fen = '1K1k4/8/8/8/8/8/8/rr6 w - - 0 1';
    position = new CHESS.Position(fen);
    isMate = CHESS.Engine.isMate(position);
    assert.ok(isMate, 'King is mated');
});

QUnit.test('Get a list of pieces attacking a square', function (assert) {
    var 
        attackers,
        correctAttackers,
        fen,
        isMate,
        position,
        square = new CHESS.Square('e4');

    correctAttackers = getSquareList([
        'g5', 'c5', 'f6', 'd6',
        'g3', 'c3', 'f2', 'd2',
        'h4', 'a4', 'e8', 'e1',
        'h7', 'h1', 'b1', 'a8'
    ]);
    fen = 'B3R3/7B/3N1N2/2N3N1/R6R/2N3N1/3N1N2/1B2R2B w - - 0 1';
    position = new CHESS.Position(fen);
    attackers = CHESS.Engine.getAttackers(position, square, 'w').sort();
    assert.strictEqual(attackers.length, correctAttackers.length, 'There are 16 pieces attacking the e4');
    assert.deepEqual(attackers, correctAttackers, 'Attacking squares are correct');

    correctAttackers = getSquareList(['d3', 'f3']);
    fen = '8/8/8/8/8/3P1P2/8/8 w - - 0 1';
    position = new CHESS.Position(fen);
    attackers = CHESS.Engine.getAttackers(position, square, 'w').sort();
    assert.strictEqual(attackers.length, correctAttackers.length, 'There are 2 pieces attacking the e4');
    assert.deepEqual(attackers, correctAttackers, 'Attacking squares are correct');

    correctAttackers = getSquareList(['d5', 'f5']);
    fen = '8/8/8/3p1p2/8/8/8/8 w - - 0 1';
    position = new CHESS.Position(fen);
    attackers = CHESS.Engine.getAttackers(position, square, 'b').sort();
    assert.strictEqual(attackers.length, correctAttackers.length, 'There are 2 pieces attacking the e4');
    assert.deepEqual(attackers, correctAttackers, 'Attacking squares are correct');

    correctAttackers = getSquareList(['d5', 'e5', 'f5', 'd4', 'f4', 'd3', 'e3', 'f3']);
    fen = '8/8/8/3KKK2/3K1K2/3KKK2/8/8 w - - 0 1';
    position = new CHESS.Position(fen);
    attackers = CHESS.Engine.getAttackers(position, square, 'w').sort();
    assert.strictEqual(attackers.length, correctAttackers.length, 'There are 8 pieces attacking the e4');
    assert.deepEqual(attackers, correctAttackers, 'Attacking squares are correct');
});

QUnit.test('Get legal moves', function (assert) {
    var actualLegalMoves,
        expectedLegalMoves,
        fen,
        position;

    expectedLegalMoves = [];
    position = new CHESS.Position();
    actualLegalMoves = CHESS.Engine.getLegalMoves(position);
    assert.deepEqual(actualLegalMoves, expectedLegalMoves, 'There are no legal moves');

    expectedLegalMoves = [
        'a2-a3', 'a2-a4', 'b2-b3', 'b2-b4',
        'c2-c3', 'c2-c4', 'd2-d3', 'd2-d4',
        'e2-e3', 'e2-e4', 'f2-f3', 'f2-f4',
        'g2-g3', 'g2-g4', 'h2-h3', 'h2-h4',
        'b1-c3', 'b1-a3', 'g1-h3', 'g1-f3'
    ];
    fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    position = new CHESS.Position(fen);
    actualLegalMoves = CHESS.Engine.getLegalMoves(position);
    actualLegalMoves.sort();
    expectedLegalMoves.sort();
    assert.deepEqual(actualLegalMoves, expectedLegalMoves, 'Legal moves found');

    expectedLegalMoves = [
        'a1-a2', 'a1-a3', 'a1-a4', 'a1-a5',
        'a1-a6', 'a1-a7', 'a1-a8', 'b1-c3',
        'b1-d2', 'b1-a3', 'c1-d2', 'c1-e3',
        'c1-f4', 'c1-g5', 'c1-h6', 'c1-b2',
        'c1-a3', 'd1-d2', 'd1-d3', 'd1-d4',
        'd1-d5', 'd1-d6', 'd1-d7', 'd1-d8',
        'd1-e2', 'd1-f3', 'd1-g4', 'd1-h5',
        'd1-c2', 'd1-b3', 'd1-a4', 'e1-e2',
        'e1-f2', 'e1-f1'
    ];
    fen = '3qkbnr/8/8/8/8/8/8/RNBQK3 w KQkq - 0 1',
    position = new CHESS.Position(fen);
    actualLegalMoves = CHESS.Engine.getLegalMoves(position);
    actualLegalMoves.sort();
    expectedLegalMoves.sort();
    assert.deepEqual(actualLegalMoves, expectedLegalMoves, 'Legal piece moves found');

    expectedLegalMoves = [
        'a1-b1', 'a1-b2', 'a2-a3', 'a2-a4',
        'b7-b8', 'd4-c5', 'd4-d5', 'g3-g4',
        'h5-g6', 'h5-h6'
    ];
    fen = '7k/1P6/8/2p3pP/2PP4/6P1/P5P1/K7 w - g6 0 1',
    position = new CHESS.Position(fen);
    actualLegalMoves = CHESS.Engine.getLegalMoves(position);
    actualLegalMoves.sort();
    expectedLegalMoves.sort();
    assert.deepEqual(actualLegalMoves, expectedLegalMoves, 'Legal pawn moves found');

});

function getSquareList (squares) {
    var i,
        squareList = [];

    squares = squares.sort();

    for (i = 0; i < squares.length; i++) {
        squareList.push(new CHESS.Square(squares[i]));
    }

    return squareList;
}

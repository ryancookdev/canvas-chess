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

function getSquareList (squares) {
    var i,
        squareList = [];

    squares = squares.sort();

    for (i = 0; i < squares.length; i++) {
        squareList.push(new CHESS.Square(squares[i]));
    }

    return squareList;
}

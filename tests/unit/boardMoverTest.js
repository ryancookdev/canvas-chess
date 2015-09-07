QUnit.module('BoardMover');

QUnit.test('Pawn single move', function (assert) {
    var boardMover,
        expectedFen,
        position;

    position = new CHESS.Position('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    boardMover = new CHESS.BoardMover(position);

    // White
    boardMover.move(getMove('e2', 'e3'));
    expectedFen = 'rnbqkbnr/pppppppp/8/8/8/4P3/PPPP1PPP/RNBQKBNR b KQkq - 0 1';
    assert.strictEqual(position.getFen(), expectedFen, 'White pawn moved 2 squares');

    // Black
    boardMover.move(getMove('e7', 'e6'));
    expectedFen = 'rnbqkbnr/pppp1ppp/4p3/8/8/4P3/PPPP1PPP/RNBQKBNR w KQkq - 0 1';
    assert.strictEqual(position.getFen(), expectedFen, 'Black pawn moved 2 squares');
});

QUnit.test('Pawn double move', function (assert) {
    var boardMover,
        expectedFen,
        position;

    position = new CHESS.Position('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    boardMover = new CHESS.BoardMover(position);

    // White
    boardMover.move(getMove('e2', 'e4'));
    expectedFen = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1';
    assert.strictEqual(position.getFen(), expectedFen, 'White pawn moved 2 squares');

    // Black
    boardMover.move(getMove('e7', 'e5'));
    expectedFen = 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 1';
    assert.strictEqual(position.getFen(), expectedFen, 'Black pawn moved 2 squares');
});

QUnit.test('Pawn promotion', function (assert) {
    var boardMover,
        expectedFen,
        position;

    position = new CHESS.Position('8/4P2k/8/8/8/8/3p3K/8 w - - 0 1');
    boardMover = new CHESS.BoardMover(position);

    // White
    boardMover.move(getMove('e7', 'e8'), 'Q');
    expectedFen = '4Q3/7k/8/8/8/8/3p3K/8 b - - 0 1';
    assert.strictEqual(position.getFen(), expectedFen, 'White pawn promoted to queen');

    // Black
    boardMover.move(getMove('d2', 'd1'), 'R');
    expectedFen = '4Q3/7k/8/8/8/8/7K/3r4 w - - 0 1';
    assert.strictEqual(position.getFen(), expectedFen, 'Black pawn promoted to rook');
});

QUnit.test('Pawn en passant', function (assert) {
    var boardMover,
        expectedFen,
        position;

    // White
    position = new CHESS.Position('4k3/8/8/5pP1/8/8/8/4K3 w - f6 0 1');
    boardMover = new CHESS.BoardMover(position);
    boardMover.move(getMove('g5', 'f6'));
    expectedFen = '4k3/8/5P2/8/8/8/8/4K3 b - - 0 1';
    assert.strictEqual(position.getFen(), expectedFen, 'White pawn captures en passant');

    // Black
    position = new CHESS.Position('4k3/8/8/8/1pP5/8/8/4K3 b - c3 0 1');
    boardMover = new CHESS.BoardMover(position);
    boardMover.move(getMove('b4', 'c3'));
    expectedFen = '4k3/8/8/8/8/2p5/8/4K3 w - - 0 1';
    assert.strictEqual(position.getFen(), expectedFen, 'Black pawn captures en passant');
});

QUnit.test('Castle kingside', function (assert) {
    var boardMover,
        expectedFen,
        position;

    // White
    position = new CHESS.Position('r3k2r/8/8/8/8/8/8/R3K2R w K - 0 1');
    boardMover = new CHESS.BoardMover(position);
    boardMover.move(getMove('e1', 'g1'));
    expectedFen = 'r3k2r/8/8/8/8/8/8/R4RK1 b - - 0 1';
    assert.strictEqual(position.getFen(), expectedFen, 'White king castles kingside');

    // Black
    position = new CHESS.Position('r3k2r/8/8/8/8/8/8/R3K2R b k - 0 1');
    boardMover = new CHESS.BoardMover(position);
    boardMover.move(getMove('e8', 'g8'));
    expectedFen = 'r4rk1/8/8/8/8/8/8/R3K2R w - - 0 1';
    assert.strictEqual(position.getFen(), expectedFen, 'Black king castles kingside');
});

QUnit.test('Castle queenside', function (assert) {
    var boardMover,
        expectedFen,
        position;

    // White
    position = new CHESS.Position('r3k2r/8/8/8/8/8/8/R3K2R w Q - 0 1');
    boardMover = new CHESS.BoardMover(position);
    boardMover.move(getMove('e1', 'c1'));
    expectedFen = 'r3k2r/8/8/8/8/8/8/2KR3R b - - 0 1';
    assert.strictEqual(position.getFen(), expectedFen, 'White king castles queenside');

    // Black
    position = new CHESS.Position('r3k2r/8/8/8/8/8/8/R3K2R b q - 0 1');
    boardMover = new CHESS.BoardMover(position);
    boardMover.move(getMove('e8', 'c8'));
    expectedFen = '2kr3r/8/8/8/8/8/8/R3K2R w - - 0 1';
    assert.strictEqual(position.getFen(), expectedFen, 'Black king castles queenside');
});

QUnit.test('Lose castling ability', function (assert) {
    var boardMover,
        expectedFen,
        position;

    // White
    position = new CHESS.Position('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1');
    boardMover = new CHESS.BoardMover(position);
    boardMover.move(getMove('h1', 'h8'));
    expectedFen = 'r3k2R/8/8/8/8/8/8/R3K3 b Qq - 0 1';
    assert.strictEqual(position.getFen(), expectedFen, 'Cannot castle kingside');

    // Black
    position = new CHESS.Position('r3k2r/8/8/8/8/8/8/R3K2R b KQkq - 0 1');
    boardMover = new CHESS.BoardMover(position);
    boardMover.move(getMove('a8', 'a1'));
    expectedFen = '4k2r/8/8/8/8/8/8/r3K2R w Kk - 0 1';
    assert.strictEqual(position.getFen(), expectedFen, 'Cannot castle queenside');
});

function getMove(startSquare, endSquare) {
    var sq1 = new CHESS.Square(startSquare),
        sq2 = new CHESS.Square(endSquare);
    return new CHESS.Move(sq1, sq2);
}

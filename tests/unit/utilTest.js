QUnit.module('Util');

QUnit.test('Get legal moves', function (assert) {
    var actualLegalMoves,
        expectedLegalMoves,
        fen,
        position;

    expectedLegalMoves = [];
    position = new CHESS.Position();
    actualLegalMoves = CHESS.util.getLegalMoves(position);
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
    actualLegalMoves = CHESS.util.getLegalMoves(position);
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
    actualLegalMoves = CHESS.util.getLegalMoves(position);
    assert.deepEqual(actualLegalMoves, expectedLegalMoves, 'Legal moves found');

});



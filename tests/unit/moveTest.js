QUnit.module('Move');

QUnit.test('Test move', function (assert) {
    var startSquare,
        endSquare,
        move;

    startSquare = new CHESS.Square('e2');
    endSquare = new CHESS.Square('e4');
    move = new CHESS.Move(startSquare, endSquare);
    assert.ok(move.getStartSquare().getName(), startSquare.getName(), 'Start square is e2');
    assert.ok(move.getEndSquare().getName(), endSquare.getName(), 'End square is e4');
});



Canvas Chess
============

Note: This project is no longer in active development. For updates on Canvas Chess 2, see the new repo: https://github.com/ryancookdev/CanvasChess2.

A chess UI based on the HTML5 Canvas.

```javascript
<div id="board"></div>
<script>
    var board = new CHESS.Board({
        container: 'board',
        height: '400px',
        width: '400px',
        piece_set: 'img/pieces/merida'
    });
    board.setActive(true);
</script>
```

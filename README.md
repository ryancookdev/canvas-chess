Canvas Chess
============

Canvas Chess is a user interface for building chess applications. Developers can access the HTML5 board using a JavaScript API.

Basic usage:
1. Include Canvas Chess.
2. Add a container div.
3. Create and configure the board.
```javascript
<script src="canvaschess.js"></script>

<div id="board"></div>

<script>
    var board = new CHESS.Board({
        container: 'board',
        height: '400px',
        width: '400px'
        piece_set: 'img/pieces/merida',
    });
</script>
```

### Board Configuration

When you create a board, you can pass the following configurations settings:

* `container` - Required. The id of the div element that will contain the board.
* `height` and `width` - The size of the board in pixels. These are string values ending with 'px'. This is not required, since your application may prefer to set the size dynamically after the board is created.
* `piece_set` - Path to the folder containing your piece images, relative to the HTML file. By default, the path 'canvaschess/img/pieces/merida/' will be assumed.
* `fen` - The position, in Forsyth–Edwards Notation. Default is the standard starting position.
* `mode` - If this value is 'setup', the board will include a piece box. Pieces can be dragged on and off the board.
* `show_labels` - True by default. If false, the board will not include letters and numbers. This should be a boolean value, not a string.
* `square_color_light` - The color of the light squares. By default #ececd7.
* `square_color_dark` - The color of the dark squares. By default #7389b6.
* `square_uri_light` and `square_uri_dark` - If you prefer to use a square graphic instead of a solid color, set the URI to the image file.
* `highlight_hover` - False by default. If true, squares will be highlighted as you drag pieces over them. This should be a boolean value, not a string.
* `square_hover_light` - If `highlight_hover` is enabled, light squares will change to this color as you drag over them. By default #b4d990.
* `square_hover_dark` - If `highlight_hover` is enabled, dark squares will change to this color as you drag over them. By default #85c249.
* `highlight_move` - False by default. If true, the last move with be highlighted (both start and end square). This should be a boolean value, not a string.
* `highlight_move_color` - If `highlight_move` is enabled, the start and end square of the previous move will be highlighted with this color. By default #ff0000.
* `highlight_move_opacity` - If `highlight_move` is enabled, the highlight color will be transparent or opaque based on this value. This should be between '0' (fully transparent) and '1' (fully opaque). By default '0.5'.
* `gc_opacity` - Canvas Chess supports graphic commentary (colored arrows and squares drawn on the board). If this feature is used, then this value will determine the opacity of the arrows and squares.  This should be between '0' (fully transparent) and '1' (fully opaque). By default '0.8'.



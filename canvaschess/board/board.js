// Global namespace
var CHESS = CHESS || {};

/**
Board module
**/
CHESS.board = (function () {
    /**
    The board's public interface.
    **/
    var board = CHESS.publisher(),
    /**
    Maintains the internal state of the board.
    @private
    **/
    _model = {
        // Core data structures
        mode: '',
        position_array: [],
        piecebox_array: [],
        white: '',
        black: '',
        last_move: {},
        last_move_promotion: false,

        // Stats on the current position
        en_passant: '',
        white_to_move: true,
        gs_castle_kside_w: true,
        gs_castle_qside_w: true,
        gs_castle_kside_b: true,
        gs_castle_qside_b: true,
        active: false,
        moves: 0
    },
    /**
    Updates the user interface.
    @private
    **/
    _view = {
        canvas: null,
        ctx:null,
        snapshot: null,
        snapshot_ctx: null,
        snapshot_img: new Image(),
        square_size: 80,
        dragok: false,
        drag_piece: '',
        // Array position of piece being dragged
        drag_clear_i: 0,
        // Array position of piece being dragged
        drag_clear_j: 0,
        // Coordinate of the mouse/touch event
        left: 0,
        // Coordinate of the mouse/touch event
        top: 0,
        // Coordinate of the last draw of a dragged piece
        last_draw_left: 0,
        // Coordinate of the last draw of a dragged piece
        last_draw_top: 0,
        // Does the piece need cleared from the starting square at the start of a drag?
        piece_not_lifted: true,
        // The white pieces are at the bottom of the screen
        white_down: true,
        pieces: new Image()
    },
    /**
    Responds to user interaction by updating the model and the view.
    @private
    **/
    _controller = {};
    
    /**
    Update the internal board with a new move.
    
    @param {string} sq1 - Current square (eg. e2).
    @param {string} sq2 - New square (eg. e4).
    **/
    _model.move = function (sq1, sq2) {
        var xy1,
            xy2,
            piece,
            pos = {
                position_array: CHESS.engine.clonePositionArray(this.position_array),
                white_to_move: this.white_to_move,
                en_passant: this.en_passant,
                active: this.active,
                gs_castle_kside_w: this.gs_castle_kside_w,
                gs_castle_qside_w: this.gs_castle_qside_w,
                gs_castle_kside_b: this.gs_castle_kside_b,
                gs_castle_qside_b: this.gs_castle_qside_b
            };
        if (this.last_move) {
            pos.last_move = {
                'sq1': this.last_move.sq1,
                'sq2': this.last_move.sq2
            };
        }
        if (!CHESS.engine.moveTemp(pos, sq1, sq2)) {
            _view.takeSnapshot();
            _view.refresh();
            return;
        }
        xy1 = CHESS.engine.getArrayPosition(sq1);
        xy2 = CHESS.engine.getArrayPosition(sq2);
        piece = this.position_array[xy1.substr(1, 1)][xy1.substr(0, 1)].substr(1, 1);
        
        // Apply position
        this.position_array = CHESS.engine.clonePositionArray(pos.position_array);
        this.white_to_move = pos.white_to_move;
        this.en_passant = pos.en_passant;
        this.active = pos.active;
        this.gs_castle_kside_w = pos.gs_castle_kside_w;
        this.gs_castle_qside_w = pos.gs_castle_qside_w;
        this.gs_castle_kside_b = pos.gs_castle_kside_b;
        this.gs_castle_qside_b = pos.gs_castle_qside_b;
        this.moves += 1;
        if (pos.last_move) {
            this.last_move = {
                'sq1': pos.last_move.sq1,
                'sq2': pos.last_move.sq2
            };
        }
        _view.takeSnapshot();
        _view.refresh();
        
        if (!this.active) {
            return;
        }
    };
    
    /**
    Redraw the board from the image buffer.
    **/
    _view.refresh = function () {
        this.ctx.clearRect(0, this.square_size * 8, this.square_size * 8, this.square_size * 2);
        this.ctx.drawImage(this.snapshot, 0, 0);
    };

    /**
    Draw the board to an image buffer.
    **/
    _view.takeSnapshot = function () {
        var i,
            j,
            ii,
            jj,
            x,
            y,
            piece,
            rows = 8;
            
        // Prepare canvas for snapshot
        if (_model.mode === 'setup') {
            rows = 10;
        }
        this.snapshot.width = this.square_size * 8;
        this.snapshot.height = this.square_size * rows;
        this.snapshot_ctx = this.snapshot.getContext('2d');
        
        // Draw chessboard
        this.snapshot_ctx.beginPath();
        this.snapshot_ctx.fillStyle = '#f3f3f3';
        this.snapshot_ctx.rect(0, 0, this.square_size * 8, this.square_size * 8);
        this.snapshot_ctx.fill();
        this.snapshot_ctx.beginPath();
        this.snapshot_ctx.fillStyle = '#7389b6';
        for (y = 0; y < 4; y+= 1) {
            for (x = 0; x < 4; x+= 1) {
                this.snapshot_ctx.rect(x * (this.square_size * 2) + this.square_size, y * (this.square_size * 2), this.square_size, this.square_size);
            }
        }
        for (y = 0; y < 4; y+= 1) {
            for (x = 0; x < 4; x+= 1) {
                this.snapshot_ctx.rect(x * (this.square_size * 2), y * (this.square_size * 2) + this.square_size, this.square_size, this.square_size);
            }
        }
        this.snapshot_ctx.fill();
        
        // Highlight last move, sq1
        /*if (typeof _model.last_move === 'object' && _model.last_move.sq1 !== undefined) {
            x = _model.last_move.sq1.substr(0, 1);
            y = _model.last_move.sq1.substr(1, 1);
            if (!this.white_down) {
                x = 7 - x;
                y = 7 - y;
            }
            this.snapshot_ctx.lineWidth = 2;
            this.snapshot_ctx.strokeStyle = '#ff8d8d';
            this.snapshot_ctx.strokeRect(x * this.square_size, y * this.square_size, this.square_size, this.square_size);

            x = _model.last_move.sq2.substr(0, 1);
            y = _model.last_move.sq2.substr(1, 1);
            if (!this.white_down) {
                x = 7 - x;
                y = 7 - y;
            }
            this.snapshot_ctx.strokeRect(x * this.square_size, y * this.square_size, this.square_size, this.square_size);
        }*/
        
        // Draw pieces
        for (i = 0; i < 8; i += 1) {
            for (j = 0; j < 8; j += 1) {
                if (!this.dragok || !(i === this.drag_clear_i && j === this.drag_clear_j)) {
                    piece = _model.position_array[i][j].substr(0, 2);
                    // Flip board for black
                    ii = i;
                    jj = j;
                    if (!this.white_down) {
                        ii = 7 - i;
                        jj = 7 - j;
                    }
                    x = jj * this.square_size;
                    y = ii * this.square_size;
                    if (piece !== '') {
                        this.drawPiece(piece, x, y);
                    }
                }
            }
        }
        
        if (_model.mode === 'setup') {
            // Draw piece box pieces
            for (i = 0; i < 2; i += 1) {
                for (j = 0; j < 8; j += 1) {
                    piece = _model.piecebox_array[i][j].substr(0, 2);
                    x = j * this.square_size;
                    y = (i + 8) * this.square_size;
                    if (piece !== '') {
                        this.drawPiece(piece, x, y);
                    }
                }
            }
        }
        
        // Clear drag piece
        if (this.dragok) {
            i = this.drag_clear_i,
            j = this.drag_clear_j;
            if (!this.white_down) {
                i = 7 - this.drag_clear_i;
                j = 7 - this.drag_clear_j;
            }
            this.snapshot_ctx.beginPath();
            this.snapshot_ctx.fillStyle = '#7389b6';
            if ((i + j) % 2 === 0) {
                this.snapshot_ctx.fillStyle = '#f3f3f3';
            }
            this.snapshot_ctx.rect(j * this.square_size, i * this.square_size, this.square_size, this.square_size);
            this.snapshot_ctx.fill();
        }
    };
    
    /**
    Draw a piece to the image buffer.

    @param {string} piece - The piece to draw.
    @param {number} x - The horizontal position in pixels.
    @param {number} y - The vertical position in pixels.
    **/
    _view.drawPiece = function (piece, x, y) {
        var scale_x,
            scale_y,
            scale = 1;
        this.snapshot_ctx.save();
        // 55 is the standard size of the piece image
        scale = this.square_size / 55;
        this.snapshot_ctx.scale(scale, scale);
        scale_x = x / scale;
        scale_y = y / scale;
        
        switch(piece) {
            case 'wk':
                this.snapshot_ctx.drawImage(this.pieces, 0, 0, 55, 55, scale_x, scale_y, 55, 55);
                break;
            case 'wq':
                this.snapshot_ctx.drawImage(this.pieces, 54, 0, 55, 55, scale_x, scale_y, 55, 55);
                break;
            case 'wr':
                this.snapshot_ctx.drawImage(this.pieces, 108, 0, 55, 55, scale_x, scale_y, 55, 55);
                break;
            case 'wb':
                this.snapshot_ctx.drawImage(this.pieces, 162, 0, 55, 55, scale_x, scale_y, 55, 55);
                break;
            case 'wn':
                this.snapshot_ctx.drawImage(this.pieces, 216, 0, 55, 55, scale_x, scale_y, 55, 55);
                break;
            case 'wp':
                this.snapshot_ctx.drawImage(this.pieces, 270, 0, 55, 55, scale_x, scale_y, 55, 55);
                break;
            case 'bk':
                this.snapshot_ctx.drawImage(this.pieces, 0, 55, 55, 55, scale_x, scale_y, 55, 55);
                break;
            case 'bq':
                this.snapshot_ctx.drawImage(this.pieces, 54, 55, 55, 55, scale_x, scale_y, 55, 55);
                break;
            case 'br':
                this.snapshot_ctx.drawImage(this.pieces, 108, 55, 55, 55, scale_x, scale_y, 55, 55);
                break;
            case 'bb':
                this.snapshot_ctx.drawImage(this.pieces, 162, 55, 55, 55, scale_x, scale_y, 55, 55);
                break;
            case 'bn':
                this.snapshot_ctx.drawImage(this.pieces, 216, 55, 55, 55, scale_x, scale_y, 55, 55);
                break;
            case 'bp':
                this.snapshot_ctx.drawImage(this.pieces, 270, 55, 55, 55, scale_x, scale_y, 55, 55);
                break;
            default:
                // Do nothing
        }
        this.snapshot_ctx.restore();
    };

    /**
    Respond to touch-leave or touch-cancel.
    
    @param e - The event object.
    **/
    _controller.myCancel = function (e) {
        e.preventDefault();
        _view.dragok = false;
        _view.drag_piece = '';
        _view.left = 0;
        _view.top = 0;
        _view.takeSnapshot();
        _view.refresh();
    };

    /**
    Respond to mouse-move or touch-move. No relation to the touch-move rule in chess ;).
    
    @param e - The event object.
    **/
    _controller.myMove = function (e) {
        e.preventDefault();
        var my_view = _view,
            i,
            j,
            ii,
            jj,
            piece,
            clip_start_x,
            clip_start_y,
            clip_width,
            clip_height,
            scale,
            scale_x,
            scale_y,
            draw_height,
            rect = my_view.canvas.getBoundingClientRect();
            
        if (my_view.dragok) {
            var i = parseInt(my_view.top / my_view.square_size, 10),
                j = parseInt(my_view.left / my_view.square_size, 10),
                clip_start_x = (j - 1) * my_view.square_size,
                clip_start_y = (i - 1) * my_view.square_size,
                clip_width = my_view.square_size * 3,
                clip_height = my_view.square_size * 3;
                
            // Make sure the piece is over the board
            if (!(i < 0 || i > 7 || j < 0 || j > 7)) {
                if (clip_start_x < 0) {
                    clip_start_x = 0;
                }
                if (clip_start_y < 0) {
                    clip_start_y = 0;
                }
                if (clip_start_x + clip_width > my_view.square_size * 8) {
                    clip_width = (my_view.square_size * 8) - clip_start_x;
                }
                if (clip_start_y + clip_height > my_view.square_size * 8) {
                    clip_height = (my_view.square_size * 8) - clip_start_y;
                }
                // Clear the section of the board where the drag piece was drawn
                my_view.ctx.drawImage(my_view.snapshot, clip_start_x, clip_start_y, clip_width, clip_height, clip_start_x, clip_start_y, clip_width, clip_height);
            }
            // Update values
            if ('clientX' in e) {
                // Mouse event
                my_view.left = e.clientX - rect.left;
                my_view.top = e.clientY - rect.top;
            } else if ('changedTouches' in e) {
                // Touch event
                my_view.left = e.changedTouches[0].pageX - rect.left;
                my_view.top = e.changedTouches[0].pageY - rect.top;
            } else {
                return;
            }
            i = parseInt(my_view.top / my_view.square_size, 10);
            j = parseInt(my_view.left / my_view.square_size, 10);
            
            // Make sure the piece is over the board
            if (i < 0 || i > 7 || j < 0 || j > 7) {
                return;
            }
            
            // Highlight hover square
            my_view.ctx.beginPath();
            if ((i + j) % 2 === 0) {
                my_view.ctx.fillStyle = '#b4d990';
            } else {
                my_view.ctx.fillStyle = '#85c249';
            }
            my_view.ctx.rect(j * my_view.square_size, i * my_view.square_size, my_view.square_size, my_view.square_size);
            my_view.ctx.fill();
            
            // Clear the piece from the starting square (first time only, in case a quick mouse move didn't allow the square to highlight, and never from piece box)
            if (my_view.piece_not_lifted && my_view.drag_clear_i < 8) {
                my_view.piece_not_lifted = false;
                my_view.ctx.beginPath();
                if ((my_view.drag_clear_i + my_view.drag_clear_j) % 2 === 0) {
                    my_view.ctx.fillStyle = '#f3f3f3';
                } else {
                    my_view.ctx.fillStyle = '#7389b6';
                }
                ii = my_view.drag_clear_i;
                jj = my_view.drag_clear_j;
                if (!my_view.white_down) {
                    ii = 7 - ii;
                    jj = 7 - jj;
                }
                my_view.ctx.rect(jj * my_view.square_size, ii * my_view.square_size, my_view.square_size, my_view.square_size);
                my_view.ctx.fill();
            }
            
            my_view.ctx.save();
            scale = (my_view.square_size / 55);
            my_view.ctx.scale(scale, scale);
            // Draw any piece that was sitting on the hover square
            ii = i;
            jj = j;
            if (!my_view.white_down) {
                ii = 7 - i;
                jj = 7 - j;
            }
            piece = _model.position_array[ii][jj].substr(0, 2);
            if (piece !== '' && !(ii === my_view.drag_clear_i && jj === my_view.drag_clear_j)) {
                scale_x = (j * my_view.square_size / scale) | 0;
                scale_y = (i * my_view.square_size / scale) | 0;
                
                switch(piece) {
                    case 'wk':
                        my_view.ctx.drawImage(my_view.pieces, 0, 0, 55, 55, scale_x, scale_y, 55, 55);
                        break;
                    case 'wq':
                        my_view.ctx.drawImage(my_view.pieces, 54, 0, 55, 55, scale_x, scale_y, 55, 55);
                        break;
                    case 'wr':
                        my_view.ctx.drawImage(my_view.pieces, 108, 0, 55, 55, scale_x, scale_y, 55, 55);
                        break;
                    case 'wb':
                        my_view.ctx.drawImage(my_view.pieces, 162, 0, 55, 55, scale_x, scale_y, 55, 55);
                        break;
                    case 'wn':
                        my_view.ctx.drawImage(my_view.pieces, 216, 0, 55, 55, scale_x, scale_y, 55, 55);
                        break;
                    case 'wp':
                        my_view.ctx.drawImage(my_view.pieces, 270, 0, 55, 55, scale_x, scale_y, 55, 55);
                        break;
                    case 'bk':
                        my_view.ctx.drawImage(my_view.pieces, 0, 55, 55, 55, scale_x, scale_y, 55, 55);
                        break;
                    case 'bq':
                        my_view.ctx.drawImage(my_view.pieces, 54, 55, 55, 55, scale_x, scale_y, 55, 55);
                        break;
                    case 'br':
                        my_view.ctx.drawImage(my_view.pieces, 108, 55, 55, 55, scale_x, scale_y, 55, 55);
                        break;
                    case 'bb':
                        my_view.ctx.drawImage(my_view.pieces, 162, 55, 55, 55, scale_x, scale_y, 55, 55);
                        break;
                    case 'bn':
                        my_view.ctx.drawImage(my_view.pieces, 216, 55, 55, 55, scale_x, scale_y, 55, 55);
                        break;
                    case 'bp':
                        my_view.ctx.drawImage(my_view.pieces, 270, 55, 55, 55, scale_x, scale_y, 55, 55);
                        break;
                    default:
                        // Do nothing
                }
            }
            // Draw drag piece
            piece = my_view.drag_piece.substr(0, 2);
            scale_x = ((my_view.left - (my_view.square_size / 2)) / scale) | 0;
            scale_y = ((my_view.top - (my_view.square_size / 2)) / scale) | 0;
            
            // Trim drawing region so it doesn't go into the piece box
            draw_height = 55;
            if (_model.mode === 'setup' && my_view.top > my_view.square_size * 7.5) {
                draw_height = draw_height - ((my_view.top - my_view.square_size * 7.5) / scale);
            }
            
            switch(piece) {
                case 'wk':
                     my_view.ctx.drawImage(my_view.pieces, 0, 0, 55, 55, scale_x, scale_y, 55, draw_height);
                    break;
                case 'wq':
                     my_view.ctx.drawImage(my_view.pieces, 54, 0, 55, 55, scale_x, scale_y, 55, draw_height);
                    break;
                case 'wr':
                     my_view.ctx.drawImage(my_view.pieces, 108, 0, 55, 55, scale_x, scale_y, 55, draw_height);
                    break;
                case 'wb':
                     my_view.ctx.drawImage(my_view.pieces, 162, 0, 55, 55, scale_x, scale_y, 55, draw_height);
                    break;
                case 'wn':
                     my_view.ctx.drawImage(my_view.pieces, 216, 0, 55, 55, scale_x, scale_y, 55, draw_height);
                    break;
                case 'wp':
                     my_view.ctx.drawImage(my_view.pieces, 270, 0, 55, 55, scale_x, scale_y, 55, draw_height);
                    break;
                case 'bk':
                     my_view.ctx.drawImage(my_view.pieces, 0, 55, 55, 55, scale_x, scale_y, 55, draw_height);
                    break;
                case 'bq':
                     my_view.ctx.drawImage(my_view.pieces, 54, 55, 55, 55, scale_x, scale_y, 55, draw_height);
                    break;
                case 'br':
                     my_view.ctx.drawImage(my_view.pieces, 108, 55, 55, 55, scale_x, scale_y, 55, draw_height);
                    break;
                case 'bb':
                     my_view.ctx.drawImage(my_view.pieces, 162, 55, 55, 55, scale_x, scale_y, 55, draw_height);
                    break;
                case 'bn':
                     my_view.ctx.drawImage(my_view.pieces, 216, 55, 55, 55, scale_x, scale_y, 55, draw_height);
                    break;
                case 'bp':
                     my_view.ctx.drawImage(my_view.pieces, 270, 55, 55, 55, scale_x, scale_y, 55, draw_height);
                    break;
                default:
                    // Do nothing
            }
            my_view.ctx.restore();
        }
    };

    /**
    Respond to mouse-down or touch-start.
    
    @param e - The event object.
    **/
    _controller.myDown = function (e) {
        e.preventDefault();
        var i,
            j,
            piece,
            piece_color,
            rect = _view.canvas.getBoundingClientRect();
        if (_model.active) {
            if ('clientX' in e) {
                // Mouse event
                _view.left = e.clientX - rect.left;
                _view.top = e.clientY - rect.top;
                _view.canvas.style.cursor = 'move';
            } else if ('changedTouches' in e) {
                // Touch event
                _view.left = e.changedTouches[0].pageX - rect.left;
                _view.top = e.changedTouches[0].pageY - rect.top;
            } else {
                return;
            }

            i = parseInt(_view.top / _view.square_size, 10);
            j = parseInt(_view.left / _view.square_size, 10);

            // Flip board for black
            if (!_view.white_down) {
                i = 7 - i;
                j = 7 - j;
            }

            if (i < 8) {
                // Dragging a piece on the board
                piece = _model.position_array[i][j];
            } else {
                // Dragging a piece in the piece box
                if (_model.mode === 'setup') {
                    piece = _model.piecebox_array[i - 8][j];
                }
            }
            piece_color = piece.substr(0, 1);
            if (_model.mode !== 'setup' && ((_model.white_to_move && piece_color === 'b') || (!_model.white_to_move && piece_color === 'w'))) {
                _view.canvas.style.cursor = 'default';
                return;
            }

            if (piece !== '') {
                _view.drag_clear_i = i;
                _view.drag_clear_j = j;
                _view.drag_piece = piece;
                _view.dragok = true;
                _view.takeSnapshot();
            } else {
                _view.canvas.style.cursor = 'default';
            }
        }
    };

    /**
    Respond to mouse-up or touch-end.
    
    @param e - The event object.
    **/
    _controller.myUp = function (e) {
        e.preventDefault();
        var sq1,
            sq2,
            alpha_conversion = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
            i,
            j,
            rect = _view.canvas.getBoundingClientRect();
            
        // Cannot move unless game is active and a piece has been selected
        if (_model.active && _view.dragok) {
            if ('clientX' in e) {
                // Mouse event
                i = parseInt((e.clientY - rect.top) / _view.square_size, 10);
                j = parseInt((e.clientX - rect.left) / _view.square_size, 10);
                _view.canvas.style.cursor = 'default';
            } else if ('changedTouches' in e) {
                // Touch event
                i = parseInt((e.changedTouches[0].pageY - rect.top) / _view.square_size, 10);
                j = parseInt((e.changedTouches[0].pageX - rect.left) / _view.square_size, 10);
            } else {
                return;
            }
            
            // Flip board for black
            if (!_view.white_down) {
                i = 7 - i;
                j = 7 - j;
            }

            // Hold the drag piece info
            drag_piece_temp = _view.drag_piece;
            
            // End the drag
            _view.dragok = false;
            _view.drag_piece = '';
            _view.left = 0;
            _view.top = 0;
            _view.piece_not_lifted = true;

            // Change position
            if (_view.drag_clear_i >= 8) {
                sq1 = 'piecebox';
            } else {
                sq1 = alpha_conversion[_view.drag_clear_j] + (8 - _view.drag_clear_i);
            }
            
            if (i >= 8) {
                sq2 = 'piecebox';
            } else {
                sq2 = alpha_conversion[j] + (8 - i);
            }
            
            xy1 = CHESS.engine.getArrayPosition(sq1);
            xy2 = CHESS.engine.getArrayPosition(sq2);

            if (_model.mode === 'setup') {
                if (sq1 !== sq2 && sq1 !== 'piecebox' && sq2 !== 'piecebox') {
                    _model.position_array[xy2.substr(1, 1)][xy2.substr(0, 1)] = drag_piece_temp;
                    _model.position_array[xy1.substr(1, 1)][xy1.substr(0, 1)] = '';
                } else {
                    if (sq1 === 'piecebox' && sq2 === 'piecebox') {
                        // Do nothing
                    } else if (sq1 === 'piecebox') {
                        _model.position_array[xy2.substr(1, 1)][xy2.substr(0, 1)] = drag_piece_temp;
                    } else if (sq2 === 'piecebox') {
                        _model.position_array[xy1.substr(1, 1)][xy1.substr(0, 1)] = '';
                    }
                }
            } else {
                _model.move(sq1, sq2);
            }
    
            _view.takeSnapshot();
            _view.refresh();
        }
    };
    
    /**
    Resize the board.

    @param {number} [height=0] - The new height of the board.
    @param {number} [width=0] - The new width of the board.
    **/
    _controller.resize = function (height, width) {
        var smaller_size = 0,
            rows = 8;
            
        // Clean
        height = height || 0;
        width = width || 0;
        height = parseInt(height, 10);
        width = parseInt(width, 10);
        
        // Attempt to fill the container if no values are found
        if (height === 0 || width === 0) {
            height = parseInt(window.getComputedStyle(_view.canvas.parentNode, null).getPropertyValue('height'), 10);
            width = parseInt(window.getComputedStyle(_view.canvas.parentNode, null).getPropertyValue('width'), 10);
        }
        smaller_size = (height < width ? height : width);
        if (_model.mode === 'setup') {
            rows = 10;
        }
        _view.square_size = (height < width ? parseInt(smaller_size / rows, 10) : parseInt(smaller_size / 8, 10));
        _view.canvas.height = _view.square_size * rows;
        _view.canvas.width = _view.square_size * 8;
    };

    /**
    Resize the board.

    @param {number} [height=0] - The new height of the board.
    @param {number} [width=0] - The new width of the board.
    **/
    board.resize = function (height, width) {
        _controller.resize(height, width);
        _view.takeSnapshot();
        _view.refresh();
    };

    /**
    Flip the board.
    **/
    board.flip = function () {
        _view.white_down = !_view.white_down;
        _view.takeSnapshot();
        _view.refresh();
    };

    /**
    Set the board to the starting position.
    **/
    board.positionStart = function () {
        _model.position_array = [['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'], ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'], ['', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', ''], ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'], ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr']];
        _model.last_move = {};
        _model.last_move_promotion = false;
        _model.en_passant = '';
        _model.white_to_move = true;
        _model.gs_castle_kside_w = true;
        _model.gs_castle_qside_w = true;
        _model.gs_castle_kside_b = true;
        _model.gs_castle_qside_b = true;
        _model.active = true;
        _model.moves = 0;
        
        _view.takeSnapshot();
        _view.refresh();
    };

    /**
    Clear the board.
    **/
    board.positionClear = function () {
        _model.position_array = [['', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '']];
        _model.last_move = {};
        _model.last_move_promotion = false;
        _model.en_passant = '';
        _model.white_to_move = true;
        _model.gs_castle_kside_w = true;
        _model.gs_castle_qside_w = true;
        _model.gs_castle_kside_b = true;
        _model.gs_castle_qside_b = true;
        _model.active = true;
        _model.moves = 0;
        
        _view.takeSnapshot();
        _view.refresh();
    };

    /**
    Change the board mode.

    @param {string} mode - Mode determines the default settings.
    **/
    board.setMode = function (mode) {
        _model.mode = mode;
        if (mode === 'setup') {
            _model.active = true;
        }
        _controller.resize(_view.canvas.height, _view.canvas.width);
        _view.takeSnapshot();
        _view.refresh();
    };

    /**
    Initialize the board module.

    @param {object} config - Default settings.
    **/
    board.init = function (config) {
        var time = new Date().getTime(),
            that = this,
            pgn_config,
            fen_arr,
            position = '',
            castling = '',
            row_array = [],
            row_item = '',
            starting_index = 0,
            color = '',
            piece = '',
            file = '',
            alpha_conversion = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
            i = 0,
            j = 0,
            k = 0;
    
        // Load CSS/JS with a timestamp to prevent caching
        CHESS.loadCSS(CHESS.config.library_path + '/board/board.css?' + time);
        CHESS.loadJS(CHESS.config.library_path + '/engine.js?' + time);
        
        // Setup canvas
        _view.snapshot = document.createElement('canvas');
        _view.canvas = document.getElementById(config.id);
        _view.ctx = _view.canvas.getContext('2d');
        
        // Mouse and touch events
        _view.canvas.onmousedown = _controller.myDown;
        _view.canvas.onmouseup = _controller.myUp;
        _view.canvas.onmousemove = _controller.myMove;
        _view.canvas.addEventListener('touchstart', _controller.myDown, false);
        _view.canvas.addEventListener('touchend', _controller.myUp, false);
        _view.canvas.addEventListener('touchmove', _controller.myMove, false);
        _view.canvas.addEventListener('touchleave', _controller.myCancel, false);
        _view.canvas.addEventListener('touchcancel', _controller.myCancel, false);
        window.onresize = function () {
            // Use controller instead of board?
            that.resize(config.height, config.width);
        };
        
        _model.mode = config.mode;
        
        if (_model.mode === 'pgn') {
            // Set the board
            this.positionStart();
            _model.active = false;
            
            // Load the PGN module
            CHESS.loadJS(CHESS.config.library_path + '/pgn/pgn.js?' + time, function () {
                pgn_config = {
                    pgn_id: config.pgn_id,
                    pgn_url: config.pgn_url,
                    width: config.width
                };
                CHESS.pgn.init(pgn_config);
            });
            
        } else if (config.fen) {
            // Prepare FEN values
            fen_arr = config.fen.split(' ');
            position = fen_arr[0];
            castling = fen_arr[2];
            row_array = position.split('/');
            
            // Set the model
            _model.en_passant = fen_arr[3];
            _model.white_to_move = (fen_arr[1] === 'w');
            if (castling === '-') {
                _model.gs_castle_kside_w = false;
                _model.gs_castle_qside_w = false;
                _model.gs_castle_kside_b = false;
                _model.gs_castle_qside_b = false;
            } else {
                if (castling.indexOf('K') >= 0) {
                    _model.gs_castle_kside_w = true;
                }
                if (castling.indexOf('Q') >= 0) {
                    _model.gs_castle_qkside_w = true;
                }
                if (castling.indexOf('k') >= 0) {
                    _model.gs_castle_kside_b = true;
                }
                if (castling.indexOf('q') >= 0) {
                    _model.gs_castle_qside_b = true;
                }
            }
            _model.position_array = [['-', '-', '-', '-', '-', '-', '-', '-'], ['-', '-', '-', '-', '-', '-', '-', '-'], ['-', '-', '-', '-', '-', '-', '-', '-'], ['-', '-', '-', '-', '-', '-', '-', '-'], ['-', '-', '-', '-', '-', '-', '-', '-'], ['-', '-', '-', '-', '-', '-', '-', '-'], ['-', '-', '-', '-', '-', '-', '-', '-'], ['-', '-', '-', '-', '-', '-', '-', '-']];
            _model.piecebox_array = [['-', 'wk', 'wq', 'wr', 'wb', 'wn', 'wp', '-'], ['-', 'bk', 'bq', 'br', 'bb', 'bn', 'bp', '-']];
            _model.white = 'human';
            _model.black = 'human2';
            _model.active = true;
            _model.moves = 0;
            _model.last_move = {};

            // Load FEN
            for (i = 0; i < row_array.length; i += 1) {
                for (j = 0; j < row_array[i].length; j += 1) {
                    row_item = row_array[i].charAt(j);
                    // Get starting index
                    for (k = 0; k < _model.position_array[i].length; k += 1) {
                        if (_model.position_array[i][k] === '-') {
                            starting_index = k;
                            k = _model.position_array[i].length; // break
                        }
                    }
                    if (/[0-9]/.test(row_item)) {
                        // Empty square(s)
                        for (k = 0; k < parseInt(row_item, 10); k += 1) {
                            _model.position_array[i][k + starting_index] = '';
                        }
                    } else {
                        color = 'w';
                        if (/[a-z]/.test(row_item)) {
                            color = 'b';
                        }
                        piece = row_item.toLowerCase();
                        file = '';
                        if (piece === 'p') {
                            file = alpha_conversion[starting_index];
                        }
                        _model.position_array[i][starting_index] = color + piece + file;
                    }
                }
            }
        } else {
            this.positionStart();
        }
        _controller.resize(config.height, config.width);
        
        // Preload pieces
        _view.pieces.src = CHESS.config.library_path + '/board/images/pieces.png';
        _view.pieces.onload = function () {
            _view.takeSnapshot();
            _view.refresh();
        };
    };

    return board;
})();

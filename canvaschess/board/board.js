// Global namespace
var CHESS = CHESS || {};

CHESS.board = (function () {
    var board = CHESS._publisher(),
    _model = {
        // Core data structures
        state: '',
        position_array: [],
        piecebox_array: [],
        white: '',
        black: '',
        last_move: {},
        last_move_promotion: false,
        my_username: '',

        // Stats on the current position
        en_passant: '',
        white_to_move: true,
        gs_castle_kside_w: true,
        gs_castle_qside_w: true,
        gs_castle_kside_b: true,
        gs_castle_qside_b: true,
        active: false,
        moves: 0,
    },
    _view = {
        canvas: '',
        ctx: '',
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
        support_toDataURL: true,
        pieces: new Image(),
    },
    _controller = {};
    
    _model.move = function (sq1, sq2) {
        var i = 0,
            sq_1,
            sq_2,
            xy1,
            xy2,
            piece,
            fen = '',
            old_fen = '',
            player_to_move = '',
            pos = {
                position_array: clonePositionArray(_model.position_array),
                white_to_move: _model.white_to_move,
                en_passant: _model.en_passant,
                active: _model.active,
                gs_castle_kside_w: _model.gs_castle_kside_w,
                gs_castle_qside_w: _model.gs_castle_qside_w,
                gs_castle_kside_b: _model.gs_castle_kside_b,
                gs_castle_qside_b: _model.gs_castle_qside_b
            },
            capture_piece = '';
        if (_model.last_move) {
            pos.last_move = {'sq1': _model.last_move.sq1, 'sq2': _model.last_move.sq2};
        }
        if (!_model.moveTemp(pos, sq1, sq2)) {
            _view.takeSnapshot();
            _view.refresh();
            return;
        }
        xy1 = getArrayPosition(sq1);
        xy2 = getArrayPosition(sq2);
        piece = _model.position_array[xy1.substr(1, 1)][xy1.substr(0, 1)].substr(1, 1);
        capture_piece = _model.position_array[xy2.substr(1, 1)][xy2.substr(0, 1)].substr(1, 1);
        
        // Create backup copy of current position
        _model.prev_position_array = clonePositionArray(_model.position_array);
        _model.prev_last_move = _model.last_move;
        _model.prev_en_passant = _model.en_passant;
        _model.prev_white_to_move = _model.white_to_move;
        _model.prev_gs_castle_kside_w = _model.gs_castle_kside_w;
        _model.prev_gs_castle_qside_w = _model.gs_castle_qside_w;
        _model.prev_gs_castle_kside_b = _model.gs_castle_kside_b;
        _model.prev_gs_castle_qside_b = _model.gs_castle_qside_b;
        _model.prev_active = _model.active;
        _model.prev_moves = _model.moves;
        
        // Apply position
        _model.position_array = clonePositionArray(pos.position_array);
        _model.white_to_move = pos.white_to_move;
        _model.en_passant = pos.en_passant;
        _model.active = pos.active;
        _model.gs_castle_kside_w = pos.gs_castle_kside_w;
        _model.gs_castle_qside_w = pos.gs_castle_qside_w;
        _model.gs_castle_kside_b = pos.gs_castle_kside_b;
        _model.gs_castle_qside_b = pos.gs_castle_qside_b;
        _model.moves += 1;
        if (pos.last_move) {
            _model.last_move = {'sq1': pos.last_move.sq1, 'sq2': pos.last_move.sq2};
        }
        _view.takeSnapshot();
        _view.refresh();
        
        if (!_model.active) {
            return;
        }

    };
    
    _model.moveTemp = function (pos, sq1, sq2) {
        var w_sq1,
            w_sq2,
            w_xy1,
            w_xy2,
            w_x1,
            w_y1,
            w_x2,
            w_y2,
            b_sq1,
            b_sq2,
            b_xy1,
            b_xy2,
            b_x1,
            b_y1,
            b_x2,
            b_y2,
            pawn_sq,
            captured_piece = '',
            piece,
            piece_color,
            current_time = 0;

        // Do not play if move is illegal
        if (!isLegal(pos, sq1, sq2)) {
            return false;
        }
        // Update game values
        pos.last_move = {'sq1':getArrayPosition(sq1), 'sq2':getArrayPosition(sq2)};

        if (pos.white_to_move) {
            w_sq1 = sq1;
            w_sq2 = sq2;
            w_xy1 = getArrayPosition(w_sq1);
            w_xy2 = getArrayPosition(w_sq2);
            w_x1 = parseInt(w_xy1.substr(0, 1));
            w_y1 = parseInt(w_xy1.substr(1, 1));
            w_x2 = parseInt(w_xy2.substr(0, 1));
            w_y2 = parseInt(w_xy2.substr(1, 1));
            captured_piece = pos.position_array[w_y2][w_x2];
            piece = pos.position_array[w_y1][w_x1];
            pos.position_array[w_y2][w_x2] = pos.position_array[w_y1][w_x1];
            pos.position_array[w_y1][w_x1] = '';
            // Pawn is eligible to be captured en passant
            w_xy1 = getArrayPosition(w_sq1);
            if (piece.substr(0, 2) === 'wp' && w_y2 - w_y1 === -2) {
                pos.en_passant = reverseArrayPosition((w_y2 + 1) + '' + w_x2);
            } else {
                pos.en_passant = '';
            }
            // En passant
            if (piece.substr(0, 2) === 'wp' && w_x2 !== w_x1 && captured_piece === '') {
                pos.position_array[w_y1][w_x2] = '';
                pawn_sq = w_sq2.substr(0, 1) + w_sq1.substr(1, 1);
            }
            // Pawn promotion
            if (piece.substr(0, 2) === 'wp' && w_y2 === 0) {
                pos.position_array[w_y2][w_x2] = 'wq';
            }
            // Castling
            if (piece === 'wk' && w_sq1 === 'e1') {
                if (w_sq2 === 'g1') {
                    pos.position_array[7][5] = 'wrk';
                    pos.position_array[7][7] = '';
                } else if (w_sq2 === 'c1') {
                    pos.position_array[7][3] = 'wrq';
                    pos.position_array[7][0] = '';
                }
            }
            // Lose castling ability
            if (piece === 'wk') {
                pos.gs_castle_kside_w = false;
                pos.gs_castle_qside_w = false;
            } else if (piece === 'wr' && w_sq1 === 'h1') {
                pos.gs_castle_kside_w = false;
            } else if (piece === 'wr' && w_sq1 === 'a1') {
                pos.gs_castle_qside_w = false;
            } else if (captured_piece === 'br' && w_sq2 === 'a8') {
                pos.gs_castle_qside_b = false;
            } else if (captured_piece === 'br' && w_sq2 === 'h8') {
                pos.gs_castle_kside_b = false;
            }
            pos.white_to_move = false;
        } else {
            // Black's turn
            b_sq1 = sq1;
            b_sq2 = sq2;
            b_xy1 = getArrayPosition(b_sq1);
            b_xy2 = getArrayPosition(b_sq2);
            b_x1 = parseInt(b_xy1.substr(0, 1));
            b_y1 = parseInt(b_xy1.substr(1, 1));
            b_x2 = parseInt(b_xy2.substr(0, 1));
            b_y2 = parseInt(b_xy2.substr(1, 1));
            captured_piece = pos.position_array[b_y2][b_x2];
            piece = pos.position_array[b_y1][b_x1];
            pos.position_array[b_y2][b_x2] = pos.position_array[b_y1][b_x1];
            pos.position_array[b_y1][b_x1] = '';
            // Pawn is eligible to be captured en passant
            b_xy1 = getArrayPosition(b_sq1);
            if (piece.substr(0, 2) === 'bp' && b_y2 - b_y1 === 2) {
                pos.en_passant = reverseArrayPosition((b_y2 - 1) + '' + b_x2);
            } else {
                pos.en_passant = '';
            }
            // En passant
            if (piece.substr(0, 2) === 'bp' && b_x2 !== b_x1 && captured_piece === '') {
                pos.position_array[b_y1][b_x2] = '';
                pawn_sq = b_sq2.substr(0, 1) + b_sq1.substr(1, 1);
            }
            // Pawn promotion
            if (piece.substr(0, 2) === 'bp' && b_y2 === 7) {
                pos.position_array[b_y2][b_x2] = 'bq';
            }
            // Castling
            if (piece === 'bk' && b_sq1 === 'e8') {
                if (b_sq2 === 'g8') {
                    pos.position_array[0][5] = 'brk';
                    pos.position_array[0][7] = '';
                } else if (b_sq2 === 'c8') {
                    pos.position_array[0][3] = 'brq';
                    pos.position_array[0][0] = '';
                }
            }
            // Lose castling ability
            if (piece === 'bk') {
                pos.gs_castle_kside_b = false;
                pos.gs_castle_qside_b = false;
            } else if (piece === 'br' && b_sq1 === 'h8') {
                pos.gs_castle_kside_b = false;
            } else if (piece === 'br' && b_sq1 === 'a8') {
                pos.gs_castle_qside_b = false;
            } else if (captured_piece === 'wr' && b_sq2 === 'a1') {
                pos.gs_castle_qside_w = false;
            } else if (captured_piece === 'wr' && b_sq2 === 'h1') {
                pos.gs_castle_kside_w = false;
            }
            pos.white_to_move = true;
        }
        // Check game ending conditions
        if (isMate(pos) || isStalemate(pos)) {
            pos.active = false;
        }
        return true;
    };
    
    _view.refresh = function () {
        _view.ctx.clearRect(0, _view.square_size * 8, _view.square_size * 8, _view.square_size * 2);
        _view.ctx.drawImage(_view.snapshot, 0, 0);
    };

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
        if (_model.state === 'setup') {
            rows = 10;
        }
        _view.snapshot.width = _view.square_size * 8;
        _view.snapshot.height = _view.square_size * rows;
        _view.snapshot_ctx = _view.snapshot.getContext('2d');
        
        // Draw chessboard
        _view.snapshot_ctx.beginPath();
        _view.snapshot_ctx.fillStyle = '#f3f3f3';
        _view.snapshot_ctx.rect(0, 0, _view.square_size * 8, _view.square_size * 8);
        _view.snapshot_ctx.fill();
        _view.snapshot_ctx.beginPath();
        _view.snapshot_ctx.fillStyle = '#7389b6';
        for (y = 0; y < 4; y+= 1) {
            for (x = 0; x < 4; x+= 1) {
                _view.snapshot_ctx.rect(x * (_view.square_size * 2) + _view.square_size, y * (_view.square_size * 2), _view.square_size, _view.square_size);
            }
        }
        for (y = 0; y < 4; y+= 1) {
            for (x = 0; x < 4; x+= 1) {
                _view.snapshot_ctx.rect(x * (_view.square_size * 2), y * (_view.square_size * 2) + _view.square_size, _view.square_size, _view.square_size);
            }
        }
        _view.snapshot_ctx.fill();
        
        // Highlight last move, sq1
        /*if (typeof _model.last_move === 'object' && _model.last_move.sq1 !== undefined) {
            x = _model.last_move.sq1.substr(0, 1);
            y = _model.last_move.sq1.substr(1, 1);
            if (_model.black === _model.my_username) {
                x = 7 - x;
                y = 7 - y;
            }
            _view.snapshot_ctx.lineWidth = 2;
            _view.snapshot_ctx.strokeStyle = '#ff8d8d';
            _view.snapshot_ctx.strokeRect(x * _view.square_size, y * _view.square_size, _view.square_size, _view.square_size);

            x = _model.last_move.sq2.substr(0, 1);
            y = _model.last_move.sq2.substr(1, 1);
            if (_model.black === _model.my_username) {
                x = 7 - x;
                y = 7 - y;
            }
            _view.snapshot_ctx.strokeRect(x * _view.square_size, y * _view.square_size, _view.square_size, _view.square_size);
        }*/
        
        // Draw pieces
        for (i = 0; i < 8; i += 1) {
            for (j = 0; j < 8; j += 1) {
                if (!_view.dragok || !(i === _view.drag_clear_i && j === _view.drag_clear_j)) {
                    piece = _model.position_array[i][j].substr(0, 2);
                    // Flip board for black
                    ii = i;
                    jj = j;
                    if (_model.black === _model.my_username) {
                        ii = 7 - i;
                        jj = 7 - j;
                    }
                    x = jj * _view.square_size;
                    y = ii * _view.square_size;
                    if (piece !== '') {
                        _view.drawPiece(piece, x, y);
                    }
                }
            }
        }
        
        if (_model.state === 'setup') {
            // Draw piece box pieces
            for (i = 0; i < 2; i += 1) {
                for (j = 0; j < 8; j += 1) {
                    piece = _model.piecebox_array[i][j].substr(0, 2);
                    x = j * _view.square_size;
                    y = (i + 8) * _view.square_size;
                    if (piece !== '') {
                        _view.drawPiece(piece, x, y);
                    }
                }
            }
        }
        
        // Clear drag piece
        if (_view.dragok) {
            i = _view.drag_clear_i,
            j = _view.drag_clear_j;
            if (_model.black === _model.my_username) {
                i = 7 - _view.drag_clear_i;
                j = 7 - _view.drag_clear_j;
            }
            _view.snapshot_ctx.beginPath();
            //_view.snapshot_ctx.fillStyle = '#85c249';
            _view.snapshot_ctx.fillStyle = '#7389b6';
            if ((i + j) % 2 === 0) {
                //_view.snapshot_ctx.fillStyle = '#b4d990';
                _view.snapshot_ctx.fillStyle = '#f3f3f3';
            }
            _view.snapshot_ctx.rect(j * _view.square_size, i * _view.square_size, _view.square_size, _view.square_size);
            _view.snapshot_ctx.fill();
        }
        
        // When the snapshot is drawn with drawImage(), ImageData is faster than canvas if supported by the browser. Otherwise _view.snapshot can be used.
        _view.snapshot_img.src = _view.snapshot.toDataURL('image/png');
        if (_view.snapshot_img.src.indexOf('data:image/png') === -1) {
            _view.support_toDataURL = false;
        } else {
            _view.support_toDataURL = true;
        }
    };
    
    _view.drawPiece = function (piece, x, y) {
        var scale_x,
            scale_y,
            scale = 1;
        _view.snapshot_ctx.save();
        // 55 is the standard size of the piece image
        scale = _view.square_size / 55;
        _view.snapshot_ctx.scale(scale, scale);
        scale_x = x / scale;
        scale_y = y / scale;
        if (piece === 'wk') {
            _view.snapshot_ctx.drawImage(_view.pieces, 0, 0, 55, 55, scale_x, scale_y, 55, 55);
        } else if (piece === 'wq') {
            _view.snapshot_ctx.drawImage(_view.pieces, 54, 0, 55, 55, scale_x, scale_y, 55, 55);
        } else if (piece === 'wr') {
            _view.snapshot_ctx.drawImage(_view.pieces, 108, 0, 55, 55, scale_x, scale_y, 55, 55);
        } else if (piece === 'wb') {
            _view.snapshot_ctx.drawImage(_view.pieces, 162, 0, 55, 55, scale_x, scale_y, 55, 55);
        } else if (piece === 'wn') {
            _view.snapshot_ctx.drawImage(_view.pieces, 216, 0, 55, 55, scale_x, scale_y, 55, 55);
        } else if (piece === 'wp') {
            _view.snapshot_ctx.drawImage(_view.pieces, 270, 0, 55, 55, scale_x, scale_y, 55, 55);
        } else if (piece === 'bk') {
            _view.snapshot_ctx.drawImage(_view.pieces, 0, 55, 55, 55, scale_x, scale_y, 55, 55);
        } else if (piece === 'bq') {
            _view.snapshot_ctx.drawImage(_view.pieces, 54, 55, 55, 55, scale_x, scale_y, 55, 55);
        } else if (piece === 'br') {
            _view.snapshot_ctx.drawImage(_view.pieces, 108, 55, 55, 55, scale_x, scale_y, 55, 55);
        } else if (piece === 'bb') {
            _view.snapshot_ctx.drawImage(_view.pieces, 162, 55, 55, 55, scale_x, scale_y, 55, 55);
        } else if (piece === 'bn') {
            _view.snapshot_ctx.drawImage(_view.pieces, 216, 55, 55, 55, scale_x, scale_y, 55, 55);
        } else if (piece === 'bp') {
            _view.snapshot_ctx.drawImage(_view.pieces, 270, 55, 55, 55, scale_x, scale_y, 55, 55);
        }
        _view.snapshot_ctx.restore();
    };

    _controller.myCancel = function (e) {
        e.preventDefault();
        _view.dragok = false;
        _view.drag_piece = '';
        _view.left = 0;
        _view.top = 0;
        _view.takeSnapshot();
        _view.refresh();
    };

    _controller.myMove = function (e) {
        e.preventDefault();
        var i,
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
            rect = _view.canvas.getBoundingClientRect();
            
        if (_view.dragok) {
            var i = parseInt(_view.top / _view.square_size, 10),
                j = parseInt(_view.left / _view.square_size, 10),
                clip_start_x = (j - 1) * _view.square_size,
                clip_start_y = (i - 1) * _view.square_size,
                clip_width = _view.square_size * 3,
                clip_height = _view.square_size * 3;
                
            // Make sure the piece is over the board
            if (!(i < 0 || i > 7 || j < 0 || j > 7)) {
                if (clip_start_x < 0) {
                    clip_start_x = 0;
                }
                if (clip_start_y < 0) {
                    clip_start_y = 0;
                }
                if (clip_start_x + clip_width > _view.square_size * 8) {
                    clip_width = (_view.square_size * 8) - clip_start_x;
                }
                if (clip_start_y + clip_height > _view.square_size * 8) {
                    clip_height = (_view.square_size * 8) - clip_start_y;
                }
                // Clear the section of the board where the drag piece was drawn
                if (_view.support_toDataURL) {
                    // Need to draw from a canvas (toDataURL() is not supported on some Android devices)
                    _view.ctx.drawImage(_view.snapshot_img, clip_start_x, clip_start_y, clip_width, clip_height, clip_start_x, clip_start_y, clip_width, clip_height);
                } else {
                    // Drawing from ImageData is faster than drawing from a canvas
                    _view.ctx.drawImage(_view.snapshot, clip_start_x, clip_start_y, clip_width, clip_height, clip_start_x, clip_start_y, clip_width, clip_height);
                }
            }
            // Update values
            if ('clientX' in e) {
                // Mouse event
                _view.left = e.clientX - rect.left;
                _view.top = e.clientY - rect.top;
            } else if ('changedTouches' in e) {
                // Touch event
                _view.left = e.changedTouches[0].pageX - rect.left;
                _view.top = e.changedTouches[0].pageY - rect.top;
            } else {
                return;
            }
            i = parseInt(_view.top / _view.square_size, 10);
            j = parseInt(_view.left / _view.square_size, 10);
            
            // Make sure the piece is over the board
            if (i < 0 || i > 7 || j < 0 || j > 7) {
                return;
            }
            
            // Highlight hover square
            _view.ctx.beginPath()
            if ((i + j) % 2 === 0) {
                _view.ctx.fillStyle = '#b4d990';
            } else {
                _view.ctx.fillStyle = '#85c249';
            }
            _view.ctx.rect(j * _view.square_size, i * _view.square_size, _view.square_size, _view.square_size);
            _view.ctx.fill();
            
            // Clear the piece from the starting square (first time only, in case a quick mouse move didn't allow the square to highlight, and never from piece box)
            if (_view.piece_not_lifted && _view.drag_clear_i < 8) {
                _view.piece_not_lifted = false;
                _view.ctx.beginPath()
                if ((_view.drag_clear_i + _view.drag_clear_j) % 2 === 0) {
                    _view.ctx.fillStyle = '#f3f3f3';
                } else {
                    _view.ctx.fillStyle = '#7389b6';
                }
                _view.ctx.rect(_view.drag_clear_j * _view.square_size, _view.drag_clear_i * _view.square_size, _view.square_size, _view.square_size);
                _view.ctx.fill();
            }
            
            _view.ctx.save();
            scale = (_view.square_size / 55);
            _view.ctx.scale(scale, scale);
            // Draw any piece that was sitting on the hover square
            ii = i;
            jj = j;
            if (_model.black === _model.my_username) {
                ii = 7 - i;
                jj = 7 - j;
            }
            piece = _model.position_array[ii][jj].substr(0, 2);
            if (piece !== '' && !(ii === _view.drag_clear_i && jj === _view.drag_clear_j)) {
                scale_x = (j * _view.square_size / scale) | 0;
                scale_y = (i * _view.square_size / scale) | 0;
                if (piece === 'wk') {
                    _view.ctx.drawImage(_view.pieces, 0, 0, 55, 55, scale_x, scale_y, 55, 55);
                } else if (piece === 'wq') {
                    _view.ctx.drawImage(_view.pieces, 54, 0, 55, 55, scale_x, scale_y, 55, 55);
                } else if (piece === 'wr') {
                    _view.ctx.drawImage(_view.pieces, 108, 0, 55, 55, scale_x, scale_y, 55, 55);
                } else if (piece === 'wb') {
                    _view.ctx.drawImage(_view.pieces, 162, 0, 55, 55, scale_x, scale_y, 55, 55);
                } else if (piece === 'wn') {
                    _view.ctx.drawImage(_view.pieces, 216, 0, 55, 55, scale_x, scale_y, 55, 55);
                } else if (piece === 'wp') {
                    _view.ctx.drawImage(_view.pieces, 270, 0, 55, 55, scale_x, scale_y, 55, 55);
                } else if (piece === 'bk') {
                    _view.ctx.drawImage(_view.pieces, 0, 55, 55, 55, scale_x, scale_y, 55, 55);
                } else if (piece === 'bq') {
                    _view.ctx.drawImage(_view.pieces, 54, 55, 55, 55, scale_x, scale_y, 55, 55);
                } else if (piece === 'br') {
                    _view.ctx.drawImage(_view.pieces, 108, 55, 55, 55, scale_x, scale_y, 55, 55);
                } else if (piece === 'bb') {
                    _view.ctx.drawImage(_view.pieces, 162, 55, 55, 55, scale_x, scale_y, 55, 55);
                } else if (piece === 'bn') {
                    _view.ctx.drawImage(_view.pieces, 216, 55, 55, 55, scale_x, scale_y, 55, 55);
                } else if (piece === 'bp') {
                    _view.ctx.drawImage(_view.pieces, 270, 55, 55, 55, scale_x, scale_y, 55, 55);
                }
            }
            // Draw drag piece
            piece = _view.drag_piece.substr(0, 2);
            scale_x = ((_view.left - (_view.square_size / 2)) / scale) | 0;
            scale_y = ((_view.top - (_view.square_size / 2)) / scale) | 0;
            
            // Trim drawing region so it doesn't go into the piece box
            draw_height = 55;
            if (_model.state === 'setup' && _view.top > _view.square_size * 7.5) {
                draw_height = draw_height - ((_view.top - _view.square_size * 7.5) / scale);
            }
            
            if (piece === 'wk') {
                _view.ctx.drawImage(_view.pieces, 0, 0, 55, 55, scale_x, scale_y, 55, draw_height);
            } else if (piece === 'wq') {
                _view.ctx.drawImage(_view.pieces, 54, 0, 55, 55, scale_x, scale_y, 55, draw_height);
            } else if (piece === 'wr') {
                _view.ctx.drawImage(_view.pieces, 108, 0, 55, 55, scale_x, scale_y, 55, draw_height);
            } else if (piece === 'wb') {
                _view.ctx.drawImage(_view.pieces, 162, 0, 55, 55, scale_x, scale_y, 55, draw_height);
            } else if (piece === 'wn') {
                _view.ctx.drawImage(_view.pieces, 216, 0, 55, 55, scale_x, scale_y, 55, draw_height);
            } else if (piece === 'wp') {
                _view.ctx.drawImage(_view.pieces, 270, 0, 55, 55, scale_x, scale_y, 55, draw_height);
            } else if (piece === 'bk') {
                _view.ctx.drawImage(_view.pieces, 0, 55, 55, 55, scale_x, scale_y, 55, draw_height);
            } else if (piece === 'bq') {
                _view.ctx.drawImage(_view.pieces, 54, 55, 55, 55, scale_x, scale_y, 55, draw_height);
            } else if (piece === 'br') {
                _view.ctx.drawImage(_view.pieces, 108, 55, 55, 55, scale_x, scale_y, 55, draw_height);
            } else if (piece === 'bb') {
                _view.ctx.drawImage(_view.pieces, 162, 55, 55, 55, scale_x, scale_y, 55, draw_height);
            } else if (piece === 'bn') {
                _view.ctx.drawImage(_view.pieces, 216, 55, 55, 55, scale_x, scale_y, 55, draw_height);
            } else if (piece === 'bp') {
                _view.ctx.drawImage(_view.pieces, 270, 55, 55, 55, scale_x, scale_y, 55, draw_height);
            }
            _view.ctx.restore();
        }
    };

    _controller.myDown = function (e) {
        e.preventDefault();
        var i,
            j,
            piece,
            piece_color,
            rect = _view.canvas.getBoundingClientRect();
        
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
        if (_model.black === _model.my_username) {
            i = 7 - i;
            j = 7 - j;
        }
        
        if (i < 8) {
            // Dragging a piece on the board
            piece = _model.position_array[i][j];
        } else {
            // Dragging a piece in the piece box
            if (_model.state === 'setup') {
                piece = _model.piecebox_array[i - 8][j];
            }
        }
        piece_color = piece.substr(0, 1);
        
        if (piece !== '') {
            _view.drag_clear_i = i;
            _view.drag_clear_j = j;
            _view.drag_piece = piece;
            _view.dragok = true;
            _view.takeSnapshot();
        } else {
            _view.canvas.style.cursor = 'default';
        }
    };

    _controller.myUp = function (e) {
        e.preventDefault();
        var sq1,
            sq2,
            alpha_conversion = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
            i,
            j,
            pos,
            rect = _view.canvas.getBoundingClientRect(),
            drag_piecebox_piece;
            
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
            if (_model.black === _model.my_username) {
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
            
            xy1 = CHESS._getArrayPosition(sq1);
            xy2 = CHESS._getArrayPosition(sq2);

            if (_model.state === 'setup') {
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
    
    _controller.resize = function (height, width) {
        var smaller_size = 0,
            rows = 8;
            
        // Set values if nothing was passed
        if (typeof(height) === 'undefined') {
            height = 0;
        }
        if (typeof(width) === 'undefined') {
            width = 0;
        }
        
        // Clean
        height = parseInt(height, 10);
        width = parseInt(width, 10);
        
        // Attempt to fill the container if no values are found
        if (height === 0 || width === 0) {
            height = parseInt(window.getComputedStyle(_view.canvas.parentNode, null).getPropertyValue('height'), 10);
            width = parseInt(window.getComputedStyle(_view.canvas.parentNode, null).getPropertyValue('width'), 10);
        }
        smaller_size = (height < width ? height : width);
        if (_model.state === 'setup') {
            rows = 10;
        }
        _view.square_size = (height < width ? parseInt(smaller_size / rows, 10) : parseInt(smaller_size / 8, 10));
        _view.canvas.height = _view.square_size * rows;
        _view.canvas.width = _view.square_size * 8;
    };

    /**
    Tell the board to resize

    @method resize
    **/
    board.resize = function (height, width) {
        _controller.resize(height, width);
        _view.takeSnapshot();
        _view.refresh();
    }

    /**
    Initializes the board module.

    @method init
    **/
    board.init = function (config) {
        var time = new Date().getTime(),
            fen_arr = config.fen.split(' '),
            position = fen_arr[0],
            castling = fen_arr[2],
            row_array = position.split('/'),
            row_item = '',
            starting_index = 0,
            color = '',
            piece = '',
            file = '',
            alpha_conversion = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
            i = 0,
            j = 0,
            k = 0;
        CHESS._loadCSS('board.css?' + time, CHESS._config.library_path + '/board/');
        CHESS._loadJS('engine.js?' + time, CHESS._config.library_path + '/board/');
        
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
        window.onresize = function (event) {
            board.resize(config.height, config.width);
        };
        
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
        _model.my_username = (_model.white_to_move ? _model.white : _model.black);
        _model.state = config.state;
        
        _controller.resize(config.height, config.width);
        
        // Preload pieces
        _view.pieces.src = CHESS._config.library_path + '/board/images/pieces.png';
        _view.pieces.onload = function () {
            _view.takeSnapshot();
            _view.refresh();
        };
    };

    return board;
})();

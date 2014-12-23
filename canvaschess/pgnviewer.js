// Global namespace
var CHESS = CHESS || {};

CHESS.PgnViewer = function (config) {

    var
        init,

        controller = {},

        model = {

            black: '',
            date: '',
            event: '',
            result: '',
            round: '',
            site: '',
            white: '',
            fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            game_list: []

        },

        view = {

            board: null,
            board_control_box: null,
            container: null,
            control_box: null,
            control_end_elem: null,
            control_next_elem: null,
            control_pause_elem: null,
            control_play_elem: null,
            control_prev_elem: null,
            control_start_elem: null,
            current_move: null,
            download_btn: null,
            flip_board_btn: null,
            game_list: null,
            header_box: null,
            header_date_elem: null,
            header_details_box: null,
            header_event_elem: null,
            header_players_elem: null,
            header_result_elem: null,
            header_site_elem: null,
            main_box: null,
            move_control_box: null,
            move_list: null,
            ply: 0,
            start_end_variation: false

        };

    controller.goEnd = function () {

        if (view.current_move !== null) {

            view.changeMove(view.current_move.parentNode.lastChild);

        }

    };

    controller.goNext = function () {

        var next_move;

        if (view.current_move !== null) {

            next_move = view.getSiblingMove(view.current_move, 1);
            view.changeMove(next_move);

        }

    };

    controller.goPrev = function () {

        var prev_move;

        if (view.current_move !== null) {

            prev_move = view.getSiblingMove(view.current_move, -1);
            view.changeMove(prev_move);

        }

    };

    controller.goStart = function () {

        if (view.current_move !== null) {

            view.changeMove(view.current_move.parentNode.firstChild);

        }

    };

    controller.updateBoard = function (e) {

        var i,
            gc,
            gc_color;

        // Update the board
        view.board.setPosition(e.currentTarget.fen);
        view.board.setLastMove(e.currentTarget.move.sq1, e.currentTarget.move.sq2);

        // Draw graphic commentary
        view.board.removeAllArrows();
        view.board.removeAllSquares();

        if (typeof(e.currentTarget.gc) === 'object') {

            gc = e.currentTarget.gc;

            // Arrows
            if (gc.arrows.length >= 1) {

                for (i = 0; i < gc.arrows.length; i += 1) {

                    if (gc.arrows[i].color === 'R') {

                        gc_color = '#F00'; // Red

                    } else if (gc.arrows[i].color === 'Y') {

                        gc_color = '#FF0'; // Yellow

                    } else {

                        gc_color = '#0F0'; // Green

                    }

                    view.board.addArrow(gc.arrows[i].sq1, gc.arrows[i].sq2, gc_color);

                }

            }

            // Squares
            if (gc.squares.length >= 1) {

                for (i = 0; i < gc.squares.length; i += 1) {

                    if (gc.squares[i].color === 'R') {

                        gc_color = '#F00'; // Red

                    } else if (gc.squares[i].color === 'Y') {

                        gc_color = '#FF0'; // Yellow

                    } else {

                        gc_color = '#0F0'; // Green

                    }

                    view.board.addSquare(gc.squares[i].sq, gc_color);

                }

            }

        }

        view.board.display();
        view.board.setActive(true);

        // Update the current move
        if (view.current_move !== null) {

            view.current_move.removeAttribute('class');

        }

        e.currentTarget.className = 'current';
        view.current_move = e.currentTarget;

    };

    view.buildHtml = function (config, canvas) {

        var i,
            doc = document,
            all_move_btns,
            margin_px;

        // Find the container element if the ID was provided
        if (config.id !== undefined) {

            this.container = document.getElementById(config.id);

        }

        // No ID was provided, or element could not be found
        if (this.container === undefined || this.container === null) {

            // Create a container element in the location where this script was executed.
            document.write('<div id=\'canvaschess\' class=\'canvaschesspgn\'></div>');
            this.container = document.getElementById('canvaschess');

            // Remove ID so more PGN's can be created.
            this.container.removeAttribute('id');

        }

        this.container.setAttribute('tabindex', 0);

        // Main box
        this.main_box = doc.createElement('div');
        this.main_box.className = 'pgn_main_box';
        this.container.appendChild(this.main_box);

        this.buildHtmlHeader();
        this.buildHtmlControls();

        // Move the canvas to the main box and add the move list
        this.main_box.appendChild(canvas);
        this.move_list = doc.createElement('ol');
        this.move_list.className = 'move_list';
        this.main_box.appendChild(this.move_list);

        // Calculate sizes if configured
        if (config.width !== null) {

            this.container.style.width = config.width + 'px';

        }

        if (config.board_width !== null) {

            this.header_details_box.style.width = config.board_width + 'px';

        }

        if (config.move_list_width !== null) {

            this.game_list.style.width = config.move_list_width + 'px';
            this.move_list.style.width = (config.move_list_width - 30) + 'px';
            this.move_list.style.height = (parseInt(config.board_width / 8, 10) * 8) + 'px';
            this.move_control_box.style.width = config.move_list_width + 'px';

            // Calculate margin for move buttons
            all_move_btns = document.getElementsByClassName('pgn_ctrl_btn');
            margin_px = parseInt((config.move_list_width - 120) / 8, 10);

            for (i = 0; i < all_move_btns.length; i += 1) {

                all_move_btns[i].style.margin = '0 ' + margin_px + 'px';

            }

        }

    };

    view.buildHtmlControls = function () {

        var doc = document;

        // Control box
        this.control_box = doc.createElement('div');
        this.control_box.className = 'pgn_control_box';
        this.container.appendChild(this.control_box);

        // Board control box
        this.board_control_box = doc.createElement('span');
        this.board_control_box.className = 'board_controls';
        this.control_box.appendChild(this.board_control_box);

        // Flip board
        this.flip_board_btn = doc.createElement('a');
        this.flip_board_btn.className = 'board_ctrl_btn board_flip';
        this.flip_board_btn.title = 'Flip';
        this.flip_board_btn.onclick = this.board.flip;

        // Download PGN
        this.download_btn = doc.createElement('a');
        this.download_btn.className = 'board_ctrl_btn board_download';
        this.download_btn.title = 'Download PGN';

        // Add board buttons to board control box
        this.board_control_box.appendChild(this.flip_board_btn);
        this.board_control_box.appendChild(this.download_btn);

        // Move control box
        this.move_control_box = doc.createElement('span');
        this.move_control_box.className = 'move_controls';
        this.control_box.appendChild(this.move_control_box);

        // Play
        this.control_play_elem = doc.createElement('a');
        this.control_play_elem.className = 'pgn_ctrl_btn pgn_play';
        this.control_play_elem.title = 'Play';
        this.control_play_elem.onclick = controller.goPlay;

        // Pause
        this.control_pause_elem = doc.createElement('a');
        this.control_pause_elem.className = 'pgn_ctrl_btn pgn_pause';
        this.control_pause_elem.title = 'Pause';
        this.control_pause_elem.onclick = controller.goPause;

        // Start
        this.control_start_elem = doc.createElement('a');
        this.control_start_elem.className = 'pgn_ctrl_btn pgn_start';
        this.control_start_elem.title = 'Start';
        this.control_start_elem.onclick = controller.goStart;

        // Prev
        this.control_prev_elem = doc.createElement('a');
        this.control_prev_elem.className = 'pgn_ctrl_btn pgn_prev';
        this.control_prev_elem.title = 'Previous';
        this.control_prev_elem.onclick = controller.goPrev;

        // Next
        this.control_next_elem = doc.createElement('a');
        this.control_next_elem.className = 'pgn_ctrl_btn pgn_next';
        this.control_next_elem.title = 'Next';
        this.control_next_elem.onclick = controller.goNext;

        // End
        this.control_end_elem = doc.createElement('a');
        this.control_end_elem.className = 'pgn_ctrl_btn pgn_end';
        this.control_end_elem.title = 'End';
        this.control_end_elem.onclick = controller.goEnd;

        // Add move buttons to move control box
        this.move_control_box.appendChild(this.control_start_elem);
        this.move_control_box.appendChild(this.control_prev_elem);
        this.move_control_box.appendChild(this.control_next_elem);
        this.move_control_box.appendChild(this.control_end_elem);

    };

    view.buildHtmlHeader = function () {

        var doc = document;

        // Header box
        this.header_box = doc.createElement('div');
        this.header_box.className = 'pgn_header_box';
        this.container.insertBefore(this.header_box, this.container.firstChild);

        // Header details box
        this.header_details_box = doc.createElement('div');
        this.header_details_box.className = 'pgn_header_details_box';
        this.header_box.appendChild(this.header_details_box);

        // Players
        this.header_players_elem = doc.createElement('span');
        this.header_players_elem.className = 'pgn_players';
        this.header_players_elem.title = 'Players';

        // Event
        this.header_event_elem = doc.createElement('span');
        this.header_event_elem.className = 'pgn_event';
        this.header_event_elem.title = 'Event';

        // Site
        this.header_site_elem = doc.createElement('span');
        this.header_site_elem.className = 'pgn_site';
        this.header_site_elem.title = 'Site';

        // Date
        this.header_date_elem = doc.createElement('span');
        this.header_date_elem.className = 'pgn_date';
        this.header_date_elem.title = 'Date';

        // Result
        this.header_result_elem = doc.createElement('span');
        this.header_result_elem.className = 'pgn_result';
        this.header_result_elem.title = 'Result';

        // Add game details to header details box
        this.header_details_box.appendChild(this.header_players_elem);
        this.header_details_box.appendChild(this.header_event_elem);
        this.header_details_box.appendChild(this.header_site_elem);
        this.header_details_box.appendChild(this.header_date_elem);
        this.header_details_box.appendChild(this.header_result_elem);

        // Create game list
        this.game_list = doc.createElement('select');
        this.game_list.className = 'game_list';
        this.game_list.onchange = function (e) {

            view.changeGame(e.currentTarget.value);

        };

        // Add game list to header box
        this.header_box.appendChild(this.game_list);

    };

    view.changeGame = function (game_index) {

        var i,
            pgn_str,
            header,
            header_data,
            move_text,
            move_array,
            first_move,
            second_move,
            nag_coded,
            nag_uncoded,
            nag,
            comments,
            comment_data = {
                comment: '',
                gc: null
            };

        // Reset model
        model.event = '';
        model.site = '';
        model.date = '';
        model.round = '';
        model.white = '';
        model.black = '';
        model.result = '';
        model.fen = '';

        // Reset view
        while (this.move_list.firstChild) {

            this.move_list.removeChild(this.move_list.firstChild);

        }

        this.current_move = null;

        // Get the selected game text
        pgn_str = model.game_list[game_index];

        // Get array of headers (entire line for each header value)
        // Must exclude % symbol or it will pick up graphic commentary
        header = pgn_str.match(/\[([^\[%]+)\]/g);
        for (i = 0; i < header.length; i += 1) {

            // Extract the tag names and values
            header_data = header[i].match(/\[(\S+)\s"(.+?)"\]/);
            header_data[1] = header_data[1].replace(/\s+$/, '');
            header_data[2] = header_data[2].replace(/\s+$/, '');

            switch (header_data[1].toLowerCase()) {
            case 'event':
                model.event = header_data[2];
                break;
            case 'site':
                model.site = header_data[2];
                break;
            case 'date':
                model.date = header_data[2];
                break;
            case 'round':
                model.round = header_data[2];
                break;
            case 'white':
                model.white = header_data[2];
                break;
            case 'black':
                model.black = header_data[2];
                break;
            case 'result':
                model.result = header_data[2];
                break;
            case 'fen':
                model.fen = header_data[2];
                break;
            }

        }

        if (model.fen === '') {

            model.fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

        }

        this.displayHeader();

        // Get move text (begins with the first character after the final header)
        move_text = pgn_str.match(/\]\s+([{\w][\s\S]+$)/)[1];

        // Remove result
        move_text = move_text.replace(/\s*1-0\s*$/, '');
        move_text = move_text.replace(/\s*0-1\s*$/, '');
        move_text = move_text.replace(/\s*1\/2-1\/2\s*$/, '');
        move_text = move_text.replace(/\s*\*\s*$/, '');

        // Extract comments
        comments = move_text.match(/\{[^{]*\}/g);
        move_text = move_text.replace(/\{[^{]*\}/g, '{}');

        /* Get an array of moves, with each index holding white move and black move (with comment markers)
         *
         * ^({})|           Initial comment or...
         * \d+[.]{1,3}      Move number (ex: "1.", "2...").
         * .+?              All text that follows, but don't go beyond...
         * (?=              ... and don't include ...
         *   (\d+[.]{1,3})  The next move number
         *   |$             or end of string.
         * )
         */
        move_array = move_text.match(/^(\{\})|(\d+[.]{1,3}).+?(?=(\d+[.]{1,3})|$)/g);

        // Look for initial comment marker
        if (move_array[0] === '{}') {

            comment_data = this.getComment(comments);

            // Play move
            this.move(null, comment_data.comment, null, comment_data.gc);

            // Clear comment data
            comment_data.comment = '';
            comment_data.gc = null;

        }

        for (i = 0; i < move_array.length; i += 1) {

            // First move
            first_move = move_array[i].match(/\d+[.]{1,3}\s?((?:[^ )]+)\s?(?:\$[\d]+)?)\s?(?:\{\})?/);
            if (first_move !== null) {

                // Get NAG
                nag_uncoded = first_move[1].match(/[!?=]+/);
                nag_uncoded = (nag_uncoded && nag_uncoded[0] ? nag_uncoded[0] : null);
                nag_coded = first_move[1].match(/\$(\d+)/);
                nag_coded = (nag_coded && nag_coded[1]? nag_coded[1] : null);
                nag_coded = CHESS.nag_code[nag_coded];

                if (nag_coded) {

                    nag = nag_coded;

                } else if (nag_uncoded) {

                    nag = nag_uncoded;

                } else {
                    
                    nag = '';

                }

                // Strip uncoded NAG
                first_move[1] = first_move[1].replace(/[^1-8a-hRNBQKOx\-]*$/, '');

                // Strip coded NAG
                first_move[1] = first_move[1].replace(/\s*\$.*$/, '');

                // Look for comment marker
                if (/\{\}/.test(first_move[0])) {

                    comment_data = this.getComment(comments);

                }

                // Play first move
                this.move(first_move[1], comment_data.comment, nag, comment_data.gc);

                // Clear comment data
                comment_data.comment = '';
                comment_data.gc = null;

                // Second move
                move_array[i] = move_array[i].replace(first_move[0], '');
                second_move = move_array[i].match(/((?:\w[^ )]+)\s?(?:\$[\d]+)?)\s?(?:\{\})?/);
                if (second_move !== null) {

                    // Get NAG
                    nag_uncoded = second_move[1].match(/[!?=]+/);
                    nag_uncoded = (nag_uncoded && nag_uncoded[0] ? nag_uncoded[0] : null);
                    nag_coded = second_move[1].match(/\$(\d+)/);
                    nag_coded = (nag_coded && nag_coded[1]? nag_coded[1] : null);
                    nag_coded = CHESS.nag_code[nag_coded];

                    if (nag_coded) {

                        nag = nag_coded;

                    } else if (nag_uncoded) {

                        nag = nag_uncoded;

                    } else {

                        nag = '';

                    }

                    // Strip uncoded NAG
                    second_move[1] = second_move[1].replace(/[^1-8a-hRNBQKOx\-]*$/, '');
                    // Strip coded NAG
                    second_move[1] = second_move[1].replace(/\s*\$.*$/, '');

                    // Look for comment marker
                    if (/\{\}/.test(second_move[0])) {

                        comment_data = this.getComment(comments);

                    }

                    // Play second move
                    this.move(second_move[1], comment_data.comment, nag, comment_data.gc);

                    // Clear comment data
                    comment_data.comment = '';
                    comment_data.gc = null;

                }

                // Check for start/end variation markers
                if (/\)/.test(move_array[i])) {

                    this.endVariation();

                }

                if (/\(/.test(move_array[i])) {

                    this.startVariation();

                    // Look for leading comments
                    if (/\(\s?\{\}/.test(move_array[i])) {

                        comment_data = this.getComment(comments);

                        // This should be handled by move(). Clean up later.
                        var move_elem = document.createElement('li');
                        move_elem.move = '';
                        var move_comment = document.createElement('span');
                        move_comment.setAttribute('class', 'comment');
                        move_comment.innerHTML = comment_data.comment;
                        move_elem.appendChild(move_comment);
                        if (comment_data.gc !== undefined && comment_data.gc !== null) {
                            move_elem.gc = comment_data.gc;
                        }
                        move_elem.setAttribute('data-ply', this.ply);
                        move_elem.fen = view.getSiblingMove(this.current_move.parentNode.previousSibling, -1).fen;
                        move_elem.onclick = controller.updateBoard;
                        this.current_move.appendChild(move_elem);

                        // Clear comment data
                        comment_data.comment = '';
                        comment_data.gc = null;

                    }

                }

            }

        }

        // Reset current move to beginning
        this.current_move = view.move_list.getElementsByTagName('li')[0];
        this.board.setPosition(this.current_move.fen);
        controller.updateBoard({'currentTarget': this.current_move});

        // Reset the scroll position
        view.move_list.scrollTop = 0;

    };
    
    view.getComment = function (comments) {

        var i,
            data = {
                comment: '',
                gc: {
                    arrows: [],
                    squares: []
                }
            },
            gc_text,
            gc_list,
            gc_marker,
            gc_color,
            gc_sq1,
            gc_sq2;

        data.comment = comments.shift().replace(/\{/, '').replace(/\}/, '');

        // Look for graphic commentary arrows
        if (/\[%cal/.test(data.comment)) {

            gc_text = data.comment.match(/\[%cal (?:[GYR]\w{2}\w{2},?\s*)+\]/)[0];
            gc_list = gc_text.match(/[GYR]\w{2}\w{2},?\s*/g);
            
            for (i = 0; i < gc_list.length; i += 1) {

                gc_marker = gc_list[i].match(/([GYR])(\w{2})(\w{2}),?\s*/);
                gc_color = gc_marker[1];
                gc_sq1 = gc_marker[2];
                gc_sq2 = gc_marker[3];

                // Create graphic commentary object
                data.gc.arrows.push({
                    color: gc_color,
                    sq1: gc_sq1,
                    sq2: gc_sq2
                });

            }

            // Remove from comment
            data.comment = data.comment.replace(gc_text, '');

        }

        // Look for graphic commentary squares
        if (/\[%csl/.test(data.comment)) {

            gc_text = data.comment.match(/\[%csl (?:[GYR]\w{2},?\s*)+\]/)[0];
            gc_list = gc_text.match(/[GYR]\w{2},?\s*/g);
            
            for (i = 0; i < gc_list.length; i += 1) {

                gc_marker = gc_list[i].match(/([GYR])(\w{2}),?\s*/);
                gc_color = gc_marker[1];
                gc_sq1 = gc_marker[2];

                // Create graphic commentary object
                data.gc.squares.push({
                    color: gc_color,
                    sq: gc_sq1
                });

            }

            // Remove from comment
            data.comment = data.comment.replace(gc_text, '');

        }

        // Trim whitespace
        data.comment = data.comment.replace(/^\s+|\s+$/g, '');

        return data;

    };

    view.changeMove = function (new_move_elem) {

        var scroll_top;

        if (view.current_move !== new_move_elem) {

            if (view.current_move !== null && new_move_elem !== null) {

                view.current_move.removeAttribute('class');

            }

            if (new_move_elem !== null) {

                new_move_elem.className = 'current';

                // Manually trigger the click event
                controller.updateBoard({'currentTarget': new_move_elem});
                view.current_move = new_move_elem;

                // Scroll so that the move is at the top of the visible move list
                scroll_top = view.current_move.offsetTop - view.move_list.offsetTop;

                // Adjust so the move is in the center of the visible move list
                scroll_top -= parseInt(view.move_list.offsetHeight / 2, 10);

                view.move_list.scrollTop = scroll_top;

            }

        }

    };

    view.displayHeader = function () {

        if (config.show_tags === false) {

            this.header_details_box.style.display = 'none';

        } else {
            
            this.header_date_elem.innerHTML = this.getPgnDate(model.date);

            // Other headers
            this.header_players_elem.innerHTML = model.white + ' vs ' + model.black;
            this.header_event_elem.innerHTML = model.event;
            this.header_site_elem.innerHTML = model.site;
            this.header_result_elem.innerHTML = model.result;

        }

    };

    view.endVariation = function () {

        this.current_move = this.current_move.parentNode.parentNode.previousSibling;
        this.ply = (+this.current_move.getAttribute('data-ply'));
        this.start_end_variation = true;

        return this;

    };

    view.getPgnDate = function (date) {

        var month_list = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Jun', 'Sep', 'Oct', 'Nov', 'Dec'],
            date_array = date.split('.'),
            year = '',
            month = '',
            day = '',
            date_str;

        // Clean date
        if (date_array.length === 3 && date_array[0].length === 4 && date_array[1].length === 2 && date_array[2].length === 2) {

            year = date_array[0];
            month = parseInt(date_array[1], 10);
            day = parseInt(date_array[2], 10);
            month = (month > 0 && month < 13 ? month_list[month] : '');
            date_str = (day > 0 ? day + ' ' : '')
                     + (month !== '' ? month + ' ' : '')
                     + (year > 0 ? year + ' ' : '');
            date_str = date_str.replace(/\s+$/, '');

        }

        return date_str;

    };

    view.getSiblingMove = function (move_elem, direction) {
        
        if (direction === 1) {

            // Next move
            while (move_elem = move_elem.nextSibling) {

                if (!(/variation_list/.test(move_elem.className))) {

                    break;

                }
                
            }

        } else if (direction === -1) {

            // Previous move
            while (move_elem = move_elem.previousSibling) {

                if (!(/variation_list/.test(move_elem.className))) {

                    break;

                }

            }

        }

        return move_elem;

    };

    view.importFile = function (pgn_str) {

        var i,
            game,
            white,
            black,
            date,
            title,
            game_list_item;

        // Remove start/end whitespace on each line
        pgn_str = pgn_str.replace(/^ +/gm, '').replace(/$ +/gm, '');

        // Trim newlines and reduce whitespace
        pgn_str = pgn_str.replace(/\n/g, ' ').replace(/\s+/g, ' ');

        // Separate multiple games by a result followed by a header (eg. 1-0 [)
        model.game_list = pgn_str.split(/[^\w](?:(?:1-0)|(?:0-1)|(?:1\/2-1\/2)|\*)\s*(?=\[)/);

        // Game list
        if (model.game_list.length > 1) {

            for (i = 0; i < model.game_list.length; i += 1) {

                game = model.game_list[i];

                // White
                white = game.match(/\[\s*white\s+['"](.*?)['"]\]/i);
                white = (white !== null && white.length > 1 ? white[1] : '');

                // Black
                black = game.match(/\[\s*black\s+['"](.*?)['"]\]/i);
                black = (black !== null && black.length > 1 ? black[1] : '');

                // Date
                date = game.match(/\[\s*date\s+['"]([0-9.?]+)['"]\]/i);
                date = (date !== null && date.length > 1 ? date[1] : '');

                title = white + ' vs. ' + black;

                game_list_item = document.createElement('option');
                game_list_item.value = i;
                game_list_item.text = title;

                this.game_list.appendChild(game_list_item);

            }

        } else {

            this.game_list.style.display = 'none';
            
        }

        this.changeGame(0);

    };

    view.move = function (move, comment, nag, gc) {

        var move_elem,
            move_text,
            move_figurine,
            move_comment,
            fullmove,
            fen,
            pos,
            long_notation,
            move_array,
            fen_info,
            side_to_move;

        // Validation
        if (!move && !comment && !gc) {

            return this;

        }

        // Initialize current move
        if (this.current_move === null) {

            move_elem = document.createElement('li');

            if (model.fen.length > 0) {

                move_elem.fen = model.fen;
                fen_info = move_elem.fen.match(/\s+([wbWB])\s+([-kqKQ]+)\s+([-\w]{1,2})\s+(\d+)\s+(\d+)\s*$/);
                side_to_move = fen_info[1].toLowerCase();
                fullmove = +fen_info[5];
                this.ply = (fullmove * 2) - (side_to_move === 'w' ? 2 : 1);
                move_elem.setAttribute('data-ply', this.ply);

            } else {

                move_elem.setAttribute('data-ply', 0);

            }

            move_elem.move = '';
            move_elem.onclick = controller.updateBoard;

            this.move_list.appendChild(move_elem);
            this.current_move = move_elem;

            // Add initial comment if set
            if (!move && typeof comment === 'string') {

                move_comment = document.createElement('span');
                move_comment.setAttribute('class', 'comment');
                move_comment.innerHTML = comment;
                move_elem.appendChild(move_comment);

                // Add graphic commendary if set
                if (gc !== undefined && gc !== null) {

                    move_elem.gc = gc;

                }

                return;

            }

        }

        // Determine how to display the move number
        fullmove = (this.ply % 2 === 0 ? (parseInt(this.ply / 2, 10) + 1) + '.&nbsp;' : '');

        // Black move number
        if (this.ply % 2 === 1 && this.start_end_variation) {

            fullmove = (parseInt((this.ply - 1) / 2, 10) + 1) + '...';

        }

        this.start_end_variation = false;

        // Increment
        this.ply += 1;

        move_figurine = move;

        // Change to check for figurine config setting
        if (config.figurine !== false) {
            switch (move.charAt(0)) {
                case 'K':
                    move_figurine = "<span class='figurine fig_k'>K</span>" + move.substring(1);
                    break;
                case 'Q':
                    move_figurine = "<span class='figurine fig_q'>Q</span>" + move.substring(1);
                    break;
                case 'R':
                    move_figurine = "<span class='figurine fig_r'>R</span>" + move.substring(1);
                    break;
                case 'B':
                    move_figurine = "<span class='figurine fig_b'>B</span>" + move.substring(1);
                    break;
                case 'N':
                    move_figurine = "<span class='figurine fig_n'>N</span>" + move.substring(1);
                    break;
            }
        }

        // Create move text element
        move_text = document.createElement('span');
        move_text.setAttribute('class', 'move_text');
        move_text.innerHTML = fullmove + move_figurine + nag + ' ';

        // Create move element
        move_elem = document.createElement('li');
        move_elem.setAttribute('data-ply', this.ply);
        move_elem.appendChild(move_text);

        // Get the current FEN
        if (this.current_move.fen === undefined) {

            if (this.current_move.className === 'variation') {

                // We are at the start of a variation
                fen = view.getSiblingMove(this.current_move.parentNode.previousSibling, -1).fen;

            }

        } else {

            fen = this.current_move.fen;

        }

        // Calculate the new FEN based on the current + move
        pos = CHESS.engine.createPosition(fen);
        long_notation = CHESS.engine.getLongNotation(pos, move);
        move_array = long_notation.split('-');
        CHESS.engine.moveTemp(pos, move_array[0], move_array[1]);
        fen = CHESS.engine.getFEN(pos);

        // Add fen/move/gc properties and click event
        move_elem.move = {'sq1': move_array[0], 'sq2': move_array[1]};
        move_elem.fen = fen;

        if (gc !== undefined && gc !== null) {

            move_elem.gc = gc;

        }

        move_elem.onclick = controller.updateBoard;

        // Append to document
        if (this.current_move.tagName.toLowerCase() === 'ol') {

            this.current_move.appendChild(move_elem);

        } else {

            this.current_move.parentNode.appendChild(move_elem);

        }

        // Add comment
        if (comment) {

            move_comment = document.createElement('span');
            move_comment.setAttribute('class', 'comment');
            move_comment.innerHTML = comment;
            move_elem.appendChild(move_comment);

        }

        // Update the current move
        this.current_move = move_elem;

        return this;

    };

    view.startVariation = function () {

        var variation_list,
            variation;

        // Check if there is already a variation list before creating one
        if (this.current_move.nextSibling === null) {

            variation_list = document.createElement('li');
            variation_list.setAttribute('class', 'variation_list');

        } else {

            variation_list = this.current_move.nextSibling;

        }

        variation = document.createElement('ol');
        variation.setAttribute('class', 'variation');
        variation_list.appendChild(variation);

        this.current_move.parentNode.appendChild(variation_list);
        this.current_move = variation;
        this.ply -= 1;
        this.start_end_variation = true;

        return this;

    };

    this.flip = function () {

        view.board.flip();

    };

    this.load = function (url, callback) {

        var xmlhttp = new XMLHttpRequest();

        view.download_btn.href = url;

        // Request the PGN file
        xmlhttp.onreadystatechange = function () {

            var pgn_str;

            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {

                pgn_str = xmlhttp.responseText;
                view.importFile(pgn_str);

                if (typeof callback === 'function') {

                    callback();

                }

            }

        };

        xmlhttp.open('GET', url, true);
        xmlhttp.send();

    };

    this.loadText = function (pgn_str) {
        view.importFile(pgn_str);
    };

    init = function (api) {
        var ratio_arr,
            ratio;

        if (config.width === undefined) {

            // Width will be set by CSS instead
            config.width = null;
            config.board_width = null;
            config.move_list_width = null;

        } else {

            // Set the ratio for board:movelist
            ratio = 0.5;
            if (config.board_movelist_ratio !== undefined) {
                ratio_arr = config.board_movelist_ratio.split(':');
                if (ratio_arr.length === 2) {
                    ratio_arr[0] = parseInt(ratio_arr[0], 10);
                    ratio_arr[1] = parseInt(ratio_arr[1], 10);
                    if (ratio_arr[1] !== 0) {
                        ratio = ratio_arr[0] / (ratio_arr[0] + ratio_arr[1]);
                        if (ratio > 3) {
                            ratio = 3;
                        } else if (ratio < 0.3) {
                            ratio = 0.3;
                        }
                    }
                }
            }
            config.width = parseInt(config.width, 10);
            config.board_width = parseInt((config.width) * ratio, 10);
            config.move_list_width = parseInt(config.width, 10) - config.board_width;

        }

        // Initialize the board
        view.board = new CHESS.Board({

            height: config.board_width,
            width: config.board_width,
            square_color_light: config.square_color_light,
            square_color_dark: config.square_color_dark,
            square_hover_dark: config.square_hover_dark,
            square_hover_light: config.square_hover_light,
            square_dark: config.square_dark,
            square_light: config.square_light,
            gc_opacity: config.gc_opacity,
            highlight_move: config.highlight_move,
            highlight_move_color: config.highlight_move_color,
            highlight_move_opacity: config.highlight_move_opacity,
            show_row_col_labels: config.show_row_col_labels,
            piece_set: config.piece_set

        });

        // Create container elements
        view.buildHtml(config, view.board.getCanvas());

        // Container keyboard control
        view.container.onkeydown = function (e) {

            e.stopPropagation();

            if (e.keyCode === 37) {

                controller.goPrev();

            } else if (e.keyCode === 39) {

                controller.goNext();

            }

        };

        // Canvas keyboard control
        view.container.getElementsByClassName('chessboard')[0].addEventListener('keydown', function (e) {

            e.stopPropagation();

            if (e.keyCode === 37) {

                controller.goPrev();

            } else if (e.keyCode === 39) {

                controller.goNext();

            }

        });

        if (config.url !== undefined) {

            api.load(config.url);

        } else if (config.pgn_text !== undefined) {

            api.loadText(config.pgn_text);

        }

    };

    init(this);

};

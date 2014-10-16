// Global namespace
var CHESS = CHESS || {};

CHESS.pgn = (function () {
    var pgn = CHESS.publisher(),
    _model = {
        event: '',
        site: '',
        date: '',
        round: '',
        white: '',
        black: '',
        result: ''
    },
    _view = {
        box: null,
        pgn_controls: null,
        pgn_list: null,
        current_move: null,
        ply: 0,
        start_end_variation: false
    };
    
    _view.import = function (pgn_str) {
        var i,
            header,
            header_data,
            move_text,
            move_array,
            first_move,
            second_move,
            comments,
            comment;
    
        // Remove start/end whitespace on each line
        pgn_str = pgn_str.replace(/^ +/gm, '').replace(/$ +/gm, '');
        
        // Trim newlines and reduce whitespace
        pgn_str = pgn_str.replace(/\n/g, ' ').replace(/\s+/g, ' ');
        
        // Get array of headers (entire line for each header value)
        header = pgn_str.match(/\[([^\[]+)\]/g);
        
        for (i = 0; i < header.length; i += 1) {
            // Extract the tag names and values
            //header_data = header[i].match(/[^"\[\]]+[\w]/);
            header_data = header[i].match(/\[(\S+)\s"(.+?)"\]/);
            switch (header_data[1]) {
                case 'Event':
                    _model.event = header_data[2];
                    break;
                case 'Site':
                    _model.site = header_data[2];
                    break;
                case 'Date':
                    _model.date = header_data[2];
                    break;
                case 'Round':
                    _model.round = header_data[2];
                    break;
                case 'White':
                    _model.white = header_data[2];
                    break;
                case 'Black':
                    _model.black = header_data[2];
                    break;
                case 'Result':
                    _model.result = header_data[2];
                    break;
                default:
                    break;
            }
        }
        
        this.displayHeader();
        
        // Get move text (begins with the first character after the final header)
        move_text = pgn_str.match(/]\s+([{\w][\s\S]+$)/)[1];
        
        // Remove result
        move_text = move_text.replace(/\s*1-0\s*$/, '');
        move_text = move_text.replace(/\s*0-1\s*$/, '');
        move_text = move_text.replace(/\s*1\/2-1\/2\s*$/, '');
        move_text = move_text.replace(/\s*\*\s*$/, '');
        
        // Extract comments
        comments = move_text.match(/{[^{]*}/g);
        move_text = move_text.replace(/{[^{]*}/g, '{}');
        
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
        move_array = move_text.match(/^({})|(\d+[.]{1,3}).+?(?=(\d+[.]{1,3})|$)/g);
        for (i = 0; i < move_array.length; i += 1) {
            first_move = move_array[i].match(/\d+[.]{1,3}\s?([^ )]+)\s?(?:{})?/);
            // Play move
            if (first_move !== null) {
                // Look for comment marker
                comment = '';
                if (/{}/.test(first_move[0])) {
                    comment = comments.shift().replace(/{/, '').replace(/}/, '');
                }
                this.move(first_move[1], comment);
                move_array[i] = move_array[i].replace(first_move[0], '');
                second_move = move_array[i].match(/(\w[^ )]+)\s?(?:{})?/);
                if (second_move) {
                    // Look for comment marker
                    comment = '';
                    if (/{}/.test(second_move[0])) {
                        comment = comments.shift().replace(/{/, '').replace(/}/, '');
                    }
                    // Play move
                    this.move(second_move[1], comment);
                }
                // Check for start/end variation markers
                if (/\)/.test(move_array[i])) {
                    this.endVariation();
                }
                if (/\(/.test(move_array[i])) {
                    this.startVariation();
                }
            }
        }
    };
    
    _view.displayHeader = function () {
        var pgn_viewer = document.getElementById('pgn_viewer');
        pgn_viewer.getElementsByClassName('pgn_players')[0].innerHTML = _model.white + ' vs ' + _model.black;
        pgn_viewer.getElementsByClassName('pgn_event')[0].innerHTML = _model.event;
        pgn_viewer.getElementsByClassName('pgn_site')[0].innerHTML = _model.site;
        pgn_viewer.getElementsByClassName('pgn_date')[0].innerHTML = _model.date;
        pgn_viewer.getElementsByClassName('pgn_result')[0].innerHTML = _model.result;
        
    };
    
    _view.updateBoard = function (fen) {
        var that = this;
        return function (e) {
            // Update the board
            CHESS.board.setPosition(fen);
            
            // Update the current move
            that.current_move.removeAttribute('class');
            e.currentTarget.className = 'current';
            that.current_move = e.currentTarget;
        };
    };
    
    _view.move = function (move, comment) {
        var move_elem,
            move_text,
            move_comment,
            fullmove,
            fen,
            pos,
            long_notation,
            move_array;
        
        // Validation
        if (!move) {
            return this;
        }
        
        // Initialize current move
        if (this.current_move === null) {
            this.current_move = this.pgn_list;
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
        
        // Create move text element
        move_text = document.createElement('span');
        move_text.setAttribute('class', 'move_text');
        move_text.innerHTML = fullmove + move + ' ';
        
        // Create move element
        move_elem = document.createElement('li');
        move_elem.setAttribute('data-ply', this.ply);
        move_elem.appendChild(move_text);
        
        // Get the current FEN
        if (this.current_move.fen === undefined) {
            if (this.current_move.className === 'variation') {
                // We are at the start of a variation
                fen = this.current_move.parentNode.previousSibling.previousSibling.fen;
            } else {
                // We are at the start of the PGN
                fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
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
        
        // Add fen property and click event
        move_elem.fen = fen;
        move_elem.onclick = this.updateBoard(fen);
        
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
    
    _view.startVariation = function () {
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
    
    _view.endVariation = function () {
        this.current_move = this.current_move.parentNode.parentNode.previousSibling;
        this.ply = (+ this.current_move.getAttribute('data-ply'));
        this.start_end_variation = true;
        return this;
    };
    
    /**
    Initializes the pgn module.
    
    @param {object} config - Default settings.
    **/
    pgn.init = function (config) {
        var time = new Date().getTime(),
            xmlhttp = new XMLHttpRequest(),
            pgn_str = '';
        
        // Load CSS with a timestamp to prevent caching
        CHESS.loadCSS(CHESS.config.library_path + '/pgn/pgn.css?' + time);
        
        // Get the list
        _view.box = document.getElementById(config.pgn_id);
        _view.box.style.width = parseInt(config.width, 10) + 'px';
        _view.pgn_list = _view.box.getElementsByClassName('pgn_list')[0];
        
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200)
            {
                pgn_str = xmlhttp.responseText;
                _view.import(pgn_str);
            }
        };
        xmlhttp.open('GET', config.pgn_url, true);
        xmlhttp.send();
    };
    
    return pgn;
})();

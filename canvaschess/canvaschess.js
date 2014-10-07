// Global namespace
var CHESS = CHESS || {};

CHESS.config = {
    library_path: 'canvaschess'
};


/**
Provides the base module interface class. All modules with return an interface object that extends this, giving them the power to publish events that other modules can subscribe to.

@module publisher
**/
CHESS.publisher = function () {
    return {
        subscribers: {
            any: []
        },
        subscribe: function (fn, type) {
            type = type || 'any';
            if (typeof this.subscribers[type] === 'undefined') {
                this.subscribers[type] = [];
            }
            this.subscribers[type].push(fn);
        },
        unsubscribe: function (fn, type) {
            this.visitSubscribers('unsubscribe', fn, type);
        },
        publish: function (publication, type) {
            this.visitSubscribers('publish', publication, type);
        },
        visitSubscribers: function (action, arg, type) {
            var pubtype = type || 'any',
                subscribers = this.subscribers[pubtype],
                i,
                max = 0;
            if (subscribers !== undefined) {
                max = subscribers.length;
            }
            for (i = 0; i < max; i += 1) {
                if (action === 'publish') {
                    subscribers[i](arg);
                } else {
                    if (subscribers[i] === arg) {
                        subscribers.splice(i, 1);
                    }
                }
            }
        }
    };
};

// Lazy loading
CHESS.loadJS = function (file, callback) {
    var new_js = document.createElement('script');
    if (typeof callback === 'function') {
        new_js.onload = function () {
            callback();
        };
    }
    new_js.src = file;
    if (new_js) {
        document.getElementsByTagName('head')[0].appendChild(new_js);
    }
};

// Lazy loading
CHESS.loadCSS = function (file) {
    var new_css = document.createElement('link');
        new_css.setAttribute('rel', 'stylesheet');
        new_css.setAttribute('type', 'text/css');
        new_css.setAttribute('href', file);
    if (new_css) {
        document.getElementsByTagName('head')[0].appendChild(new_css);
    }
};

// Get time
CHESS.getTime = function () {
    var currentTime = new Date(),
        hours = currentTime.getHours(),
        minutes = currentTime.getMinutes(),
        suffix = 'AM';

    if (hours >= 12) {
        suffix = 'PM';
        hours = hours - 12;
    }

    if (hours === 0) {
        hours = 12;
    }

    if (minutes < 10) {
        minutes = '0' + minutes;
    }

    return hours + ':' + minutes + ' ' + suffix;
};
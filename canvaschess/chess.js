// Global namespace
var CHESS = CHESS || {};

CHESS._config = {
    library_path: 'canvaschess'
};


/**
Provides the base module interface class. All modules with return an interface object that extends this, giving them the power to publish events that other modules can subscribe to.

@module publisher
**/
CHESS._publisher = function () {
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
    }
};

// Lazy loading
CHESS._loadJS = function (file, path) {
    var fileref = document.createElement('script');
    fileref.setAttribute('type', 'text/javascript');
    fileref.setAttribute('src', path + file);
    if (fileref) {
        document.getElementsByTagName('head')[0].appendChild(fileref);
    }
};

// Lazy loading
CHESS._loadCSS = function (file, path) {
    var fileref = document.createElement('link');
        fileref.setAttribute('rel', 'stylesheet');
        fileref.setAttribute('type', 'text/css');
        fileref.setAttribute('href', path + file);
    if (fileref) {
        document.getElementsByTagName('head')[0].appendChild(fileref);
    }
};

// Get time
CHESS._getTime = function () {
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

CHESS._getArrayPosition = function (sq) {
    var x = sq.substr(0, 1).toLowerCase(),
        y = sq.substr(1, 1);
    x = x.charCodeAt(0) - 97;
    y = 8 - y;
    return x + '' + y;
};

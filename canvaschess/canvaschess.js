'use strict';

// Global namespace
var CHESS = CHESS || {};

CHESS.nag_code = {
    '0': '',
    '1': '!',
    '2': '?',
    '3': '!!',
    '4': '??',
    '5': '!?',
    '6': '?!',
    '10': '=',
    '14': '+/=',
    '15': '=/+',
    '16': '+/-',
    '17': '-/+',
    '18': '+-',
    '19': '-+'
};

CHESS.hexToRgba = function (hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return (result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: 1
    } : null);
};

// Other JS files will get appended here on deployment...

// AMD compatibility
if (typeof define === 'function' && define.amd) {
    define('chess', [], function () {
        return CHESS;
    });
}
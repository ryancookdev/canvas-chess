'use strict';

// Global namespace
var CHESS = CHESS || {};

CHESS.nag_code = {
    0: {
        symbol: '',
        desc: ''
    },
    1: {
        symbol: '!',
        desc: 'Good move'
    },
    2: {
        symbol: '?',
        desc: 'Poor move'
    },
    3: {
        symbol: '!!',
        desc: 'Brilliant'
    },
    4: {
        symbol: '??',
        desc: 'Blunder / mistake'
    },
    5: {
        symbol: '!?',
        desc: 'Speculative / interesting'
    },
    6: {
        symbol: '?!',
        desc: 'Questionable / dubious'
    },
    10: {
        symbol: '=',
        desc: 'Even / drawish'
    },
    11: {
        symbol: '=',
        desc: 'Equal chances, quite position'
    },
    12: {
        symbol: '=',
        desc: 'Equal chances, active position'
    },
    13: {
        symbol: '&infin;',
        desc: 'Unclear position'
    },
    14: {
        symbol: '+/=',
        desc: 'White has a slight advantage'
    },
    15: {
        symbol: '=/+',
        desc: 'Black has a slight advantage'
    },
    16: {
        symbol: '&plusmn;', // +/-
        desc: 'White has a moderate advantage'
    },
    17: {
        symbol: '&#8723;', // -/+
        desc: 'Black has a moderate advantage'
    },
    18: {
        symbol: '+-',
        desc: 'White has a decisive advantage'
    },
    19: {
        symbol: '-+',
        desc: 'Black has a decisive advantage'
    }
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
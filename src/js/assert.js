var CHESS = CHESS || {};

CHESS.env = 'development';

CHESS.assert = (CHESS.env === 'production'
    ? function () {}
    : function (test, message) {
        if (!test) {
            throw new Error('Assertion failed: ' + message);
        }
    }
);

CHESS.assertClass = (CHESS.env === 'production'
    ? function () {}
    : function (param, constructor) {
        if (typeof param !== 'object') {
            throw new Error(
                'Assertion failed:\nClass ' + constructor.name +
                ' expected, but ' + (typeof param) + ' found.'
            );
        }
        if (param.constructor !== constructor) {
            throw new Error(
                'Assertion failed:\nClass ' + constructor.name +
                ' expected, but ' + param.constructor.name + ' found.'
            );
        }

    }
);

CHESS.assertPattern = (CHESS.env === 'production'
    ? function () {}
    : function (param, pattern) {
        this.assertString(param);
        if (!pattern.test(param)) {
            throw new Error('Expected pattern:\n\t' + pattern + '\n  Actual:\n\t' + param);
        }
    }
);

CHESS.assertNumber = (CHESS.env === 'production'
    ? function () {}
    : function (param) {
        this.assertType(param, 'number');
    }
);

CHESS.assertNumberRange = (CHESS.env === 'production'
    ? function () {}
    : function (param, low, high) {
        this.assertNumber(param);
        this.assertNumber(low);
        this.assertNumber(high);
        if (param < low || param > high) {
            throw new Error('Number:\n\t' + param + '\n  Not in range:\n\t' + low + ' ... ' + high);
        }
    }
);

CHESS.assertString = (CHESS.env === 'production'
    ? function () {}
    : function (param) {
        this.assertType(param, 'string');
    }
);

CHESS.assertStringLength = (CHESS.env === 'production'
    ? function () {}
    : function (param, length) {
        this.assertString(param);
        this.assertNumber(length);
        if (param.length !== length) {
            throw new Error('String:\n\t' + param + '\n  Expected length:\n\t' + length + '\n  Actual length:\n\t' + param.length);
        }
    }
);

CHESS.assertType = (CHESS.env === 'production'
    ? function () {}
    : function (param, expectedType) {
        var actualType = typeof param;
        if (expectedType !== actualType) {
            throw new Error('Expected type:\n\t' + expectedType + '\n  Actual type:\n\t' + actualType);
        }
    }
);

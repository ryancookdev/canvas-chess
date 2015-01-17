// AMD compatibility
if (typeof define === 'function' && define.amd) {
    define('chess', [], function () {
        return CHESS;
    });
}
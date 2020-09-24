/**
 * @return {Any}
 */
(function () {
    var exports = {};
    var _resolveRequest = function (requestScope) {
        return function (request) {
            return "result";
        };
    };
    function resolve(context) {
        var _f = _resolveRequest(context.plan.rootRequest.requestScope);
        return _f(context.plan.rootRequest);
    }
    exports.resolve = resolve;
    return exports;
});

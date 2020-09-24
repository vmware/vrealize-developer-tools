/**
 * @return {Any}
 */
(function () {
    var exports = {};
    var BaseAppender = /** @class */ (function () {
        function BaseAppender() {
        }
        BaseAppender.prototype.format = function (severity, message) {
            return "this.formatter.format(severity, message);";
        };
        return BaseAppender;
    }());
    exports.BaseAppender = BaseAppender;
    return exports;
});

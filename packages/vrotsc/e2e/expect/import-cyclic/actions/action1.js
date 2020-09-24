/**
 * @return {Any}
 */
(function () {
    var __global = System.getContext() || (function () {
        return this;
    }).call(null);
    var VROES = __global.__VROES || (__global.__VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES()), exports = {};
    var action2_1 = VROES.importLazy("com.vmware.pscoe.vrotsc.action2");
    var Action1 = /** @class */ (function () {
        function Action1() {
        }
        Action1.prototype.print = function (str) {
            action2_1._.action2(str);
        };
        return Action1;
    }());
    exports.Action1 = Action1;
    return exports;
});

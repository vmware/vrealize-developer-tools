/**
 * @return {Any}
 */
(function () {
    var __global = System.getContext() || (function () {
        return this;
    }).call(null);
    var VROES = __global.__VROES || (__global.__VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES()), exports = {};
    var __extends = VROES.tslib.__extends;
    var action1_1 = VROES.importLazy("com.vmware.pscoe.vrotsc.action1");
    var Class2 = /** @class */ (function (_super) {
        __extends(Class2, _super);
        function Class2() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Class2;
    }(action1_1._.Class1));
    exports.Class2 = Class2;
    return exports;
});

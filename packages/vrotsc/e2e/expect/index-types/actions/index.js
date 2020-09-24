/**
 * @return {Any}
 */
(function () {
    var __global = System.getContext() || (function () {
        return this;
    }).call(null);
    var VROES = __global.__VROES || (__global.__VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES()), exports = {};
    var action1_1 = VROES.importLazy("com.vmware.pscoe.vrotsc.action1");
    exports.Class1 = action1_1._.Class1;
    var action2_1 = VROES.importLazy("com.vmware.pscoe.vrotsc.sub/action2");
    exports.Class2 = action2_1._.Class2;
    return exports;
});

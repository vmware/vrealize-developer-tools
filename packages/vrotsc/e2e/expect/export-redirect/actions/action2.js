/**
 * @return {Any}
 */
(function () {
    var __global = System.getContext() || (function () {
        return this;
    }).call(null);
    var VROES = __global.__VROES || (__global.__VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES()), exports = {};
    var subaction2_1 = VROES.importLazy("com.vmware.pscoe.vrotsc.sub/subaction2");
    exports.TestClass4 = subaction2_1._.TestClass4;
    var subaction1_1 = VROES.importLazy("com.vmware.pscoe.vrotsc.sub/subaction1");
    exports.default = subaction1_1._.default;
    var subaction2_2 = VROES.importLazy("com.vmware.pscoe.vrotsc.sub/subaction2");
    exports.TestCls3 = subaction2_2._.default;
    return exports;
});

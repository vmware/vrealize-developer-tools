/**
 * @return {Any}
 */
(function () {
    var __global = System.getContext() || (function () {
        return this;
    }).call(null);
    var VROES = __global.__VROES || (__global.__VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES()), require = VROES.require, exports = {};
    var subaction1_1 = VROES.importLazy("com.vmware.pscoe.vrotsc.sub/subaction1");
    exports.TestClass2 = subaction1_1._.TestClass2;
    var subaction1_2 = VROES.importLazy("com.vmware.pscoe.vrotsc.sub/subaction1"), nsImport = subaction1_2._;
    exports.def1 = subaction1_2._.default;
    exports.namedImport = nsImport;
    var subaction1_3 = VROES.importLazy("com.vmware.pscoe.vrotsc.sub/subaction1");
    exports.def2 = subaction1_3._.default;
    require("buffer");
    exports.default = subaction1_3._.default;
    return exports;
});

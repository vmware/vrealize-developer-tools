/**
 * @return {Any}
 */
(function () {
    var __global = System.getContext() || (function () {
        return this;
    }).call(null);
    var VROES = __global.__VROES || (__global.__VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES()), exports = {};
    var action3 = VROES.importLazy("com.vmware.pscoe.vrotsc.action3");
    module.exports = action3._;
    return exports;
});

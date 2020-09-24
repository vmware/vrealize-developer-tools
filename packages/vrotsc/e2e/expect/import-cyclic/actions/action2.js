/**
 * @return {Any}
 */
(function () {
    var __global = System.getContext() || (function () {
        return this;
    }).call(null);
    var VROES = __global.__VROES || (__global.__VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES()), exports = {};
    var action3_1 = VROES.importLazy("com.vmware.pscoe.vrotsc.sub/action3");
    function action2(str) {
        action3_1._.action3(str);
    }
    exports.action2 = action2;
    return exports;
});

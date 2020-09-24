/**
 * @return {Any}
 */
(function () {
    var __global = System.getContext() || (function () {
        return this;
    }).call(null);
    var VROES = __global.__VROES || (__global.__VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES()), exports = {};
    // String
    var str = "the brown fox jumped over the lazy dog";
    VROES.Shims.stringStartsWith(str, "the brown");
    return exports;
});

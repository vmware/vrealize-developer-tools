/**
 * @return {Any}
 */
(function () {
    var __global = System.getContext() || (function () {
        return this;
    }).call(null);
    var VROES = __global.__VROES || (__global.__VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES()), require = VROES.require, exports = {};
    var keys = VROES.importLazy("com.vmware.pscoe.vrotsc.constants/metadata_keys");
    require("com.vmware.pscoe.vrotsc.constants/metadata_keys");
    exports.METADATA_KEY = keys._;
    return exports;
});

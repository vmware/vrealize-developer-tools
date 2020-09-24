/**
 * @return {Any}
 */
(function () {
    var __global = System.getContext() || (function () {
        return this;
    }).call(null);
    var VROES = __global.__VROES || (__global.__VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES()), exports = {};
    var action2 = VROES.importLazy("com.vmware.pscoe.vrotsc.action2");
    var action3 = VROES.importLazy("com.vmware.pscoe.vrotsc.action3");
    exports.action3 = action3._;
    var obj1 = {
        action2: action2._,
        action3: action3._
    };
    exports.obj1 = obj1;
    action2 = {
        action2: action2._,
    };
    var obj2 = {
        action2: action2,
        action3: action3._,
    };
    exports.obj2 = obj2;
    exports.default = action3._;
    return exports;
});

/**
 * @return {Any}
 */
(function () {
    var __global = System.getContext() || (function () {
        return this;
    }).call(null);
    var VROES = __global.__VROES || (__global.__VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES());
    var VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
    var TestClass1 = VROES.class(function TestClass1(s) {
    }, {
        test1: function () {
        },
        test2: function () {
        }
    });
    return VROES.export().named("TestClass1", TestClass1);
});

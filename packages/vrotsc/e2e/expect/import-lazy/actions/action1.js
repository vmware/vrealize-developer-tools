/**
 * @return {Any}
 */
(function () {
    var __global = System.getContext() || (function () {
        return this;
    }).call(null);
    var VROES = __global.__VROES || (__global.__VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES()), require = VROES.require, exports = {};
    var action2 = VROES.importLazy("com.vmware.pscoe.vrotsc.action2");
    exports.action2 = action2._;
    var TestClass1 = /** @class */ (function () {
        function TestClass1(action2) {
            this.action2 = action2;
        }
        TestClass1.prototype.test1 = function (p) {
            action2._(p);
            action2._.action2(p);
            action2._.action2.action2(p);
            this.action2(p);
            this.action2.action2(p);
            action2._(p);
        };
        TestClass1.prototype.test2 = function (action2, p) {
            action2.action2(p);
        };
        TestClass1.prototype.test3 = function (p) {
            return require(p);
        };
        TestClass1.prototype.test4 = function (p) {
            var mod = VROES.importLazy(p);
            return mod._;
        };
        return TestClass1;
    }());
    exports.TestClass1 = TestClass1;
    Object.keys(action2._);
    var arr1 = VROES.Shims.spreadArrays(action2._, [""]);
    var obj1 = VROES.Shims.objectAssign({}, action2._, { prop1: "val",
        prop2: 5 });
    exports.default = action2._;
    return exports;
});

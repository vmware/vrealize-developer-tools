/**
 * @return {Any}
 */
(function () {
    var __global = System.getContext() || (function () {
        return this;
    }).call(null);
    var VROES = __global.__VROES || (__global.__VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES()), exports = {};
    var __extends = VROES.tslib.__extends;
    var action2_1 = VROES.importLazy("com.vmware.pscoe.vrotsc.sub-path/action2");
    var TestClass1 = /** @class */ (function (_super) {
        __extends(TestClass1, _super);
        function TestClass1(s) {
            return _super.call(this, s) || this;
        }
        return TestClass1;
    }(action2_1._.default));
    exports.default = TestClass1;
    var TestClass2 = /** @class */ (function (_super) {
        __extends(TestClass2, _super);
        function TestClass2(s) {
            return _super.call(this, s) || this;
        }
        return TestClass2;
    }(action2_1._.TestSubClass2));
    exports.TestClass2 = TestClass2;
    return exports;
});

/**
 * @return {Any}
 */
(function () {
    var __global = System.getContext() || (function () {
        return this;
    }).call(null);
    var VROES = __global.__VROES || (__global.__VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES()), exports = {};
    var __extends = VROES.tslib.__extends;
    var TestClass1 = /** @class */ (function () {
        function TestClass1(s) {
        }
        TestClass1.prototype.test1 = function () { };
        TestClass1.prototype.test2 = function () { };
        return TestClass1;
    }());
    exports.TestClass1 = TestClass1;
    var TestClass2 = /** @class */ (function (_super) {
        __extends(TestClass2, _super);
        function TestClass2(s) {
            return _super.call(this, s) || this;
        }
        TestClass2.prototype.test1 = function () {
            _super.prototype.test1.call(this);
        };
        TestClass2.prototype.test2 = function () {
            _super.prototype.test2.call(this);
        };
        TestClass2.prototype.test3 = function () {
        };
        return TestClass2;
    }(TestClass1));
    exports.TestClass2 = TestClass2;
    var TestClass3 = /** @class */ (function (_super) {
        __extends(TestClass3, _super);
        function TestClass3(s) {
            return _super.call(this, s) || this;
        }
        TestClass3.prototype.test1 = function () {
            _super.prototype.test1.call(this);
        };
        TestClass3.prototype.test2 = function () {
            _super.prototype.test2.call(this);
        };
        TestClass3.prototype.test3 = function () {
            _super.prototype.test3.call(this);
        };
        return TestClass3;
    }(TestClass2));
    exports.TestClass3 = TestClass3;
    return exports;
});

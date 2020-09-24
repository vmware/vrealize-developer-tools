/**
 * @return {Any}
 */
(function () {
    var exports = {};
    var TestClass1 = /** @class */ (function () {
        function TestClass1() {
        }
        return TestClass1;
    }());
    exports.TestClass1 = TestClass1;
    var TestClass2 = /** @class */ (function () {
        function TestClass2() {
        }
        return TestClass2;
    }());
    exports.TestCls2 = TestClass2;
    var TestVar = 10;
    exports.TestVar = TestVar;
    var TestConst = 10;
    exports.TestConst = TestConst;
    return exports;
});

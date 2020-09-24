/**
 * @return {Any}
 */
(function () {
    var exports = {};
    (function (exp1) {
        exp1.test();
    });
    function testFunc(exp1) {
        exp1.test();
    }
    exports.testFunc = testFunc;
    var TestClass1 = /** @class */ (function () {
        function TestClass1(exp1) {
            exp1.test();
        }
        TestClass1.prototype.test1 = function (exp1) {
            exp1.test();
        };
        return TestClass1;
    }());
    exports.TestClass1 = TestClass1;
    return exports;
});

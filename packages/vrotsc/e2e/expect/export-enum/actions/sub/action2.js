/**
 * @return {Any}
 */
(function () {
    var exports = {};
    var TestEnum;
    (function (TestEnum) {
        TestEnum[TestEnum["ALA"] = 0] = "ALA";
        TestEnum[TestEnum["BALA"] = 1] = "BALA";
    })(TestEnum = exports.TestEnum || (exports.TestEnum = {}));
    var TestSubClass2 = /** @class */ (function () {
        function TestSubClass2(s) {
        }
        return TestSubClass2;
    }());
    exports.TestSubClass2 = TestSubClass2;
    return exports;
});

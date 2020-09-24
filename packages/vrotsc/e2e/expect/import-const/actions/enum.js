/**
 * @return {Any}
 */
(function () {
    var exports = {};
    var TestEnum;
    (function (TestEnum) {
        TestEnum[TestEnum["VAL1"] = 0] = "VAL1";
        TestEnum[TestEnum["VAL2"] = 1] = "VAL2";
        TestEnum[TestEnum["VAL3"] = 2] = "VAL3";
    })(TestEnum = exports.TestEnum || (exports.TestEnum = {}));
    return exports;
});

/**
 * @return {Any}
 */
(function () {
    var exports = {};
    var TestClass1 = /** @class */ (function () {
        function TestClass1() {
        }
        Object.defineProperty(TestClass1.prototype, "prop1", {
            get: function () {
                return this.field1;
            },
            set: function (value) {
                this.field1 = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TestClass1.prototype, "prop2", {
            get: function () {
                return "prop2";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TestClass1.prototype, "prop3", {
            set: function (value) {
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TestClass1, "static_prop1", {
            get: function () {
                return this.staticField1;
            },
            set: function (value) {
                this.staticField1 = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TestClass1, "static_prop2", {
            get: function () {
                return "prop2";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TestClass1, "static_prop3", {
            set: function (value) {
            },
            enumerable: true,
            configurable: true
        });
        return TestClass1;
    }());
    exports.TestClass1 = TestClass1;
    return exports;
});

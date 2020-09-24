/**
 * @return {Any}
 */
(function () {
    var __global = System.getContext() || (function () {
        return this;
    }).call(null);
    var VROES = __global.__VROES || (__global.__VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES()), exports = {};
    var __decorate = VROES.tslib.__decorate;
    var __metadata = VROES.tslib.__metadata;
    var __param = VROES.tslib.__param;
    var decorators_1 = VROES.importLazy("com.vmware.pscoe.vrotsc.decorators");
    /** Some leading class comment */
    var TestClass1 = /** @class */ (function () {
        /** Some leading constructor comment */
        function TestClass1(someVar) {
            /** in-constructor comment */
            console.log("some stuff");
        }
        /** Some leading instance method comment */
        TestClass1.prototype.method1 = function () {
            /** in-inst member comment */
            console.log("some stuff");
        };
        /** Some leading static method comment */
        TestClass1.method2 = function () {
            /** in-staic member comment */
            console.log("some stuff");
        };
        __decorate([
            decorators_1._.FieldDecorator(1),
            __metadata("design:type", String)
        ], TestClass1.prototype, "field1", void 0);
        __decorate([
            decorators_1._.MethodDecorator("bar"),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", void 0)
        ], TestClass1.prototype, "method1", null);
        __decorate([
            decorators_1._.StaticFieldDecorator,
            __metadata("design:type", Number)
        ], TestClass1, "field2", void 0);
        __decorate([
            decorators_1._.StaticMethodDecorator,
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", void 0)
        ], TestClass1, "method2", null);
        TestClass1 = __decorate([
            decorators_1._.ClassDecorator,
            decorators_1._.ClassDecorator2("foo")
            /** More leading class comment */
            ,
            __param(0, decorators_1._.inject()),
            __metadata("design:paramtypes", [Object])
        ], TestClass1);
        return TestClass1;
    }());
    exports.TestClass1 = TestClass1;
    return exports;
});

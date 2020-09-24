/**
 * @return {Any}
 */
(function () {
    var __global = System.getContext() || (function () {
        return this;
    }).call(null);
    var VROES = __global.__VROES || (__global.__VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES()), exports = {};
    var __awaiter = VROES.tslib.__awaiter;
    var __generator = VROES.tslib.__generator;
    var Promise = VROES.Promise;
    var _this = this;
    function promiseFunc() {
        return Promise.resolve(5);
    }
    function somethingAsync() {
        return __awaiter(this, void 0, void 0, function () {
            var value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, promiseFunc()];
                    case 1:
                        value = _a.sent();
                        [1, 2, 3].forEach(function (v) {
                            if (v == 1) {
                                throw new Error("at value: " + v);
                            }
                        });
                        return [2 /*return*/, value];
                }
            });
        });
    }
    function somethingElseAsync() {
        return __awaiter(this, void 0, void 0, function () {
            var value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, promiseFunc()];
                    case 1:
                        value = _a.sent();
                        return [2 /*return*/, Promise.reject(value)];
                }
            });
        });
    }
    var arrowFunction = function () {
        return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, promiseFunc()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    var arrowFunction2 = function () {
        return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, promiseFunc()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return exports;
});

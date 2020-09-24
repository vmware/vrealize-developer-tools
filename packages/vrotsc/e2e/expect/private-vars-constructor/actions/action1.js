/**
 * @return {Any}
 */
(function () {
    var exports = {};
    var Test = /** @class */ (function () {
        function Test(v2, v3, v4, v5, v6, v7) {
            if (v4 === void 0) {
                v4 = "40";
            }
            if (v5 === void 0) {
                v5 = 30;
            }
            if (v6 === void 0) {
                v6 = true;
            }
            if (v7 === void 0) {
                v7 = null;
            }
            this.v3 = v3;
            this.v4 = v4;
            this.v5 = v5;
            this.v6 = v6;
            this.v7 = v7;
            this.v1 = "10";
            this.v2 = v2;
        }
        Test.prototype.print = function () {
            System.log(this.v1);
            System.log(this.v2);
            System.log(this.v3);
            System.log(this.v4);
            System.log(this.v5.toString());
            System.log(this.v6 ? "true" : "false");
            System.log(this.v7);
        };
        return Test;
    }());
    exports.Test = Test;
    return exports;
});

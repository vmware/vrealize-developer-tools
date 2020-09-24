/**
 * @return {Any}
 */
(function () {
    var __global = System.getContext() || (function () {
        return this;
    }).call(null);
    var exports = {};
    var MyNamespace = __global.MyNamespace || (__global.MyNamespace = {});
    (function (MyNamespace) {
        function decorate(decorators, target) { }
        MyNamespace.decorate = decorate;
        function decorate2(decorators, target) { }
        MyNamespace.hasOwn = "val1";
        var hasOwn2 = "val2";
        var Mirror = /** @class */ (function () {
            function Mirror() {
            }
            Mirror.prototype.reflect = function (params) { };
            return Mirror;
        }());
        MyNamespace.Mirror = Mirror;
        var Mirror2 = /** @class */ (function () {
            function Mirror2() {
            }
            Mirror2.prototype.reflect = function (params) { };
            return Mirror2;
        }());
    })(MyNamespace);
    return exports;
});

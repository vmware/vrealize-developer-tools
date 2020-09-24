/**
 * @return {Any}
 */
(function () {
    var exports = {};
    var MyNamespace;
    (function (MyNamespace) {
        function decorate(decorators, target) { }
        MyNamespace.decorate = decorate;
        function decorate2(decorators, target) { }
        MyNamespace.hasOwn = "val1";
        var hasOwn2 = "val2";
        var Mirror2 = /** @class */ (function () {
            function Mirror2() {
            }
            Mirror2.prototype.reflect = function (params) { };
            return Mirror2;
        }());
        var Mirror = /** @class */ (function () {
            function Mirror() {
            }
            Mirror.prototype.reflect = function (params) { };
            return Mirror;
        }());
        MyNamespace.Mirror = Mirror;
    })(MyNamespace = exports.MyNamespace || (exports.MyNamespace = {}));
    function somethingElse() { }
    exports.somethingElse = somethingElse;
    return exports;
});

/**
 * @return {Any}
 */
(function () {
    var exports = {};
    function ClassDecorator(target) {
        return target;
    }
    exports.ClassDecorator = ClassDecorator;
    function ClassDecorator2(param1) {
        return function ClassDecorator(target) {
            return target;
        };
    }
    exports.ClassDecorator2 = ClassDecorator2;
    function FieldDecorator(param1) {
        return function (target, propertyName) {
        };
    }
    exports.FieldDecorator = FieldDecorator;
    function StaticFieldDecorator(target, propertyName) {
        Object.getOwnPropertyDescriptor(target, propertyName);
    }
    exports.StaticFieldDecorator = StaticFieldDecorator;
    function MethodDecorator(param1) {
        return function (target, propertyName, propertyDesciptor) {
            return propertyDesciptor || Object.getOwnPropertyDescriptor(target, propertyName);
        };
    }
    exports.MethodDecorator = MethodDecorator;
    function StaticMethodDecorator(target, propertyName) {
        return target[propertyName];
    }
    exports.StaticMethodDecorator = StaticMethodDecorator;
    return exports;
});

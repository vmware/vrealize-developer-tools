/**
 * @return {Any}
 */
(function () {
    var __global = System.getContext() || (function () {
        return this;
    }).call(null);
    var VROES = __global.__VROES || (__global.__VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES());
    var VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
    var TestClass1 = VROES.class(function TestClass1(s) {
    }, {
        test1: function () {
        },
        test2: function () {
        }
    });
    var TestClass2 = VROES.class(function TestClass2(s) {
        TestClass1.call(this, s);
    }, {
        test1: function () {
            TestClass1.prototype.test1.call(this);
        },
        test2: function () {
            TestClass1.prototype.test2.call(this);
        },
        test3: function () {
        }
    }, {}, TestClass1);
    var TestClass3 = VROES.class(function TestClass3(s) {
        TestClass2.call(this, s);
    }, {
        test1: function () {
            TestClass2.prototype.test1.call(this);
        },
        test2: function () {
            TestClass2.prototype.test2.call(this);
        },
        test3: function () {
            TestClass2.prototype.test3.call(this);
        }
    }, {}, TestClass2);
    return VROES.export().named("TestClass1", TestClass1).named("TestClass2", TestClass2).named("TestClass3", TestClass3).build();
});

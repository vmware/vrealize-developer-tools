/**
 * @return {Any}
 */
(function () {
    var __global = System.getContext() || (function () {
        return this;
    }).call(null);
    var VROES = __global.__VROES || (__global.__VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES()), exports = {};
    var data1 = {
        field1: "value1",
        field2: "value2",
    };
    var data2 = VROES.Shims.objectAssign({}, { field3: "value3" }, data1);
    var data3 = VROES.Shims.objectAssign({}, data2, { field4: "value4" });
    var data4 = VROES.Shims.objectAssign({}, { field3: "value3" }, data3, { field4: "value4" }, VROES.Shims.objectAssign({}, {
        field5: "value6",
    }, { field6: "value5" }, {
        field7: "value7",
    }, VROES.Shims.objectAssign({}, { field8: "value8" }, {
        field9: "value9",
    })));
    var data5 = [1, 2, 3];
    var data6 = VROES.Shims.spreadArrays([0], data5, [4], [5, 6], VROES.Shims.spreadArrays([7, 8], [9], VROES.Shims.spreadArrays([9], [10, 11], [12])));
    console.log(JSON.stringify(data4));
    return exports;
});

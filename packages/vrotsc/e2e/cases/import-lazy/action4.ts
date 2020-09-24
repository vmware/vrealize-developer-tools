var action2 = require("./action2");
var action3 = require("./action3");

const obj1 = {
    action2: action2,
    action3: action3
};

action2 = {
    action2: action2,
};

const obj2 = {
    action2: action2,
    action3: action3,
};

export default action3;

export {
    action3,
    obj1,
    obj2,
};
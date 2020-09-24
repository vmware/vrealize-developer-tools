import { asyncTest1, asyncTest2, asyncTest3, asyncThrowAnError, all } from "./action2";

asyncTest1()
    .then(value => console.log(value))
    .then(_ => asyncTest2())
    .then(value => console.log(value))
    .then(_ => asyncTest3())
    .then(value => console.log(value))
    .then(_ => asyncThrowAnError())
    .catch(value => console.log(value))
    .then(_ => all())
    .then(values => console.log(JSON.stringify(values)));
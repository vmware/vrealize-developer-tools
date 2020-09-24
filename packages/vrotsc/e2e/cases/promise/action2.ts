export async function asyncTest1(): Promise<string> {
    return `test1.${await asyncTest2()}`;
}

export async function asyncTest2(): Promise<string> {
    return `test2.${await asyncTest3()}`;
}

export async function asyncTest3(): Promise<string> {
    return new Promise((resolve, reject) => {
        resolve("test3");
    });
}

export async function asyncThrowAnError(): Promise<void> {
    throw new Error("test error");
}

export function all(): Promise<string[]> {
    return Promise.all(
        [
            Promise.resolve("test1"),
            new Promise((resolve) => {
                resolve("test2");
            }),
            Promise.resolve("test3")
        ]);
}

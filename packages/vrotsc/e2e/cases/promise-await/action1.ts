
function promiseFunc(): Promise<Number> {
	return Promise.resolve(5);
}

async function somethingAsync(): Promise<Number> {
	const value = await promiseFunc();
	[1, 2, 3].forEach(v => {
        if (v == 1) {
            throw new Error(`at value: ${v}`);
        }
	});

	return value;
}

async function somethingElseAsync() {
    const value = await promiseFunc();
    return Promise.reject(value);
}

const arrowFunction = async () => await promiseFunc()
const arrowFunction2 = async () => { return await promiseFunc() }

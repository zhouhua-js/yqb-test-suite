export function sum(a, b) {
    return a + b;
}

export function delay(shouldResolve) {
    return new Promise((resolve, reject) => {
        if (shouldResolve) {
            resolve('resolve');
        }
        else {
            reject(new Error('reject'));
        }
    });
}

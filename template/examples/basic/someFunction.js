export function sum(a, b) {
    return a + b;
}

export function delay(shouldResolve) {
    return new Promise((resolve, reject) => {
        if (shouldResolve) {
            resolve('done');
        }
        else {
            reject(new Error('fail'));
        }
    });
}

export function longDelay(finish) {
    setTimeout(finish, 100000);
}

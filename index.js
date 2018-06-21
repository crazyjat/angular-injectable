function createInjectable(...args) {
    const numArgs = args.length;

    if (numArgs === 0) throw "No arguments provided to createInjectable";

    const name = (typeof args[0] === "string") ? args[0] : "";
    const deps = (typeof args[0] === "string" && numArgs > 1) ? args[1] : args[0];
    const init = (typeof args[numArgs - 1] === "function") ? args[numArgs - 1] : undefined;

    const fn = function() {
        const args = Array.prototype.slice.call(arguments);
        const scope = this || {};

        deps.forEach((current, index, arr) => {
            scope[current] = args[index];
        });

        if (init) {
            return init.call(scope);
        }
        else if (scope.init) {
            scope.init();
        }
    };

    Object.defineProperty(fn, 'name', { writable: true, value: name });
    Object.defineProperty(fn, '$inject', { writable: false, value: deps });

    return fn;
}

class Injectable {
    constructor() {
        const args = [...arguments];
        const argNames = this.__proto__.constructor.$inject;

        if (args.length !== argNames.length) {
            throw "Something is wrong. The list of arguments and $inject module names do not match.";
        }

        argNames.forEach((current, index) => {
            this[current] = args[index];
        });
    }
}

export default ({
    createInjectable,
    Injectable,
});
// @see https://github.com/kirillrogovoy/promised-pipe/blob/master/index.js

type PromiseAny = Promise<any>;

interface IPipeFn {
  (...args: any): any;
  // (...args: any): Promise<any>;
  pipeCatch?: boolean;
}

const chain = (p: PromiseAny, fn: IPipeFn) => {
  if (fn.pipeCatch === true) {
    return p.catch(fn);
  }

  return p.then(fn);
};

export function createPipe<T>(...fns: IPipeFn[]) {
    if (fns.length < 1) {
        throw Error("pipe requires at least one argument");
    }

    fns.forEach((fn, i) => {
        if (typeof fn !== "function") {
            throw Error(
              `pipe requires each argument to be a function. Argument #${i + 1} is of type "${typeof fn}"`,
            );
        }
    });

    // shift out the 1st function for multiple arguments
    const start = fns.shift();

    if (!start) {
      throw Error("pipe requires at least one argument");
    }

    return (...args: any): Promise<T> => fns.reduce(
      chain,
      start(...args),
    );
}

export function pipe<T>(...fns: IPipeFn[]): Promise<T> {
  return createPipe<T>(...fns)();
}

export function catchAll(fn: IPipeFn) {
  fn.pipeCatch = true;
  return fn;
}

export function catchInstanceOf(instanceClass: any, fn: IPipeFn) {
  const catchFn = (error: any) => {
    if (error instanceof instanceClass) {
      return fn(error);
    } else {
      throw error;
    }
  };

  catchFn.pipeCatch = true;

  return catchFn;
}

export function catchCode(code: string|number, fn: IPipeFn) {
  const catchFn = (error: any) => {
    if (error && error.code === code) {
      return fn(error);
    } else {
      throw error;
    }
  };

  catchFn.pipeCatch = true;

  return catchFn;
}

export function catchInstanceOfAndCode(instanceClass: any, code: string|number, fn: IPipeFn) {
  const catchFn = (error: any) => {
    if (error && error instanceof instanceClass && error.code === code) {
      return fn(error);
    } else {
      throw error;
    }
  };

  catchFn.pipeCatch = true;

  return catchFn;
}

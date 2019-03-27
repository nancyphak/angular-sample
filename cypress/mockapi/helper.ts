export function Get(url: string) {
  return function (target: any, decoratedFnName: string, descriptor: PropertyDescriptor) {
    const decoratedFn = descriptor.value;
    const newFn = function () {

      const obj = decoratedFn.apply(target, arguments);

      return {
        ...obj,
        url: url,
        status: 200,
        method: 'GET'
      };
    };

    descriptor.value = newFn;
    return descriptor;
  }
}

export function Post(url: string) {
  return function (target: any, decoratedFnName: string, descriptor: PropertyDescriptor) {
    const decoratedFn = descriptor.value;
    const newFn = function () {

      const obj = decoratedFn.apply(target, arguments);

      return {
        ...obj,
        url: url,
        status: 200,
        method: 'POST'
      };
    };

    descriptor.value = newFn;
    return descriptor;
  }
}

export function Put(url: string) {
  return function (target: any, decoratedFnName: string, descriptor: PropertyDescriptor) {
    const decoratedFn = descriptor.value;
    const newFn = function () {

      const obj = decoratedFn.apply(target, arguments);

      return {
        ...obj,
        url: url,
        status: 200,
        method: 'PUT'
      };
    };

    descriptor.value = newFn;
    return descriptor;
  }
}

export function Delete(url: string) {
  return function (target: any, decoratedFnName: string, descriptor: PropertyDescriptor) {
    const decoratedFn = descriptor.value;
    const newFn = function () {

      const obj = decoratedFn.apply(target, arguments);

      return {
        ...obj,
        url: url,
        status: 200,
        method: 'DELETE'
      };
    };

    descriptor.value = newFn;
    return descriptor;
  }
}

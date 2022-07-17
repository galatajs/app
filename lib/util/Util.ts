export const Util = {
  toCamelCase: (str: string): string => {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, "");
  },
  transformToReadonly: <T extends object>(data: T): T => {
    const obj: ProxyHandler<T> = {
      set(target: T, prop: string | symbol, receiver: any): boolean {
        throw new Error("Cannot set property on readonly object");
      },
    };
    return new Proxy<T>(data, obj);
  },
};

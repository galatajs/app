export const warn = (msg: string, ...args: any[]): void => {
  const warnArgs = [`[istanbul warn]: ${msg}`, ...args];
  if (global.__TEST__) {
    console.warn(...warnArgs);
  }
};

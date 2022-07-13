export const warn = (msg: string, ...args: any[]): void => {
  const warnArgs = [`[istanbul warn]: ${msg}`, ...args];
  if (__TEST__) console.warn(...warnArgs);
};

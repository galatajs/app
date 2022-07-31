export interface OnModuleInstalled {
  onModuleInstalled(): void | Promise<void>;
}

export interface OnAppStarted {
  onAppStarted(): void | Promise<void>;
}

export interface OnAppFinished {
  onAppFinished(signal: string): void | Promise<void>;
}

export function isOnModuleInstalled(module: any): module is OnModuleInstalled {
  return module && module.onModuleInstalled;
}

export function isOnAppStarted(module: any): module is OnAppStarted {
  return module && module.onAppStarted;
}

export function isOnAppFinished(module: any): module is OnAppFinished {
  return module && module.onAppFinished;
}

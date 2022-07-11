/*
 * istanbul @app
 * Copyright(c) 2022 Sami Salih İBRAHİMBAŞ
 * MIT Licensed
 */

global.__VERSION__ = process.env.npm_package_version!;
global.__TEST__ = process.env.NODE_ENV === "test";
global.__DEV__ = process.env.NODE_ENV === "development";
global.__PROD__ = process.env.NODE_ENV === "production";

export * from "./hooks";
export * from "./modules";
export * from "./plugins";
export * from "./config";
export * from "./types/app.type";
export * from "./warning/warning";

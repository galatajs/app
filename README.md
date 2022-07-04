
## !! Not ready for production, experimental

<p align="center">
<br>
<img src="https://avatars.githubusercontent.com/u/76786120?v=4" width="128" height="128" style="border-radius: 50px; margin-right: 10px;" />
</p>
<h3 align="center">@istanbul/app</h3>
<p align="center">
  Main package of <code>istanbul</code> framework. 
</p>

### What Is It?

This package is pretty flexible and goes wherever you pull it. CLI, Rest, Graphql, Websocket, Microservice or any.

In shortly, it is the package that defines ``istanbul`` framework.

With this package you can currently do the following:

- create application
- create plugin
- create core plugin
- do something as soon as the app is running

### Installation

```sh
npm install @istanbul/app
```

> or with yarn
>
> ```
> yarn add @istanbul/app
> ```

### Basic Usage

```typescript
import {createApp, App} from '@istanbul/app';
import {someCorePlugin} from "@istanbul/some-core-plugin"
import {somePlugin} from "some-plugin"

const app = createApp<App>();
app.use(somePlugin);
app.register(someCorePlugin);
app.start();
```

### Module System Usage

create a main module

```typescript
import {createModule} from "@istanbul/app";

export const mainModule = createModule("mainModule");
mainModule.onAppStarted(() => {
    console.log("App started");
})
```

Register main module to app

```typescript
import {createApp} from "@istanbul/app";
import {mainModule} from "./main.module";

const app = createApp(mainModule);
app.start();
```

### Modules With Dependencies

create modules

```typescript
import {createModule} from "@istanbul/app";

const childModule = createModule("childModule");

export const mainModule = createModule("mainModule", [childModule]);
```

Register main module to app

```typescript
import {createApp} from "@istanbul/app";
import {mainModule} from "./main.module";

const app = createApp(mainModule);
app.start();
```

### Create your own plugin

You can develop your own plugins with the ``istanbul framework``. Whether you use it or present it te people, the `istanbul framework` offers a high degree of customizability.

create plugin:

```typescript
import {createPlugin} from "@istanbul/app";

export const somePlugin = createPlugin({
    name: "somePlugin",
    multiple: true, // if set to false the plugin can be intalled once, if set to true the plugin can be installed multiple times
    install: (app: App, ...options: any[]) => {
        console.log("Plugin installed");
    }
});
somePlugin.onAppStarted((app) => {
    console.log("App started");
})
```

```typescript
import {createApp} from "@istanbul/app";
import {somePlugin} from "some-plugin"

const app = createApp();
app.use(somePlugin); // install plugin
app.start();
```
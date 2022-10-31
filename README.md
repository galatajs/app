<p align="center">
<br>
<img src="https://avatars.githubusercontent.com/u/108695351?s=200&v=4" width="128" height="128">
</p>
<h3 align="center">@galatajs/app</h3>
<p align="center">
  Main package of <code>galatajs</code> framework. 
</p>

### What Is It?

This package is pretty flexible and goes wherever you pull it. CLI, Rest, Graphql, Websocket, Microservice or any.

In shortly, it is the package that defines ``galatajs`` framework.

With this package you can currently do the following:

- create application
- create plugin
- create core plugin
- do something as soon as the app is running

### Installation

```sh
npm install @galatajs/app
```

> or with yarn
>
> ```
> yarn add @galatajs/app
> ```

### Basic Usage

```typescript
import {createApp, App} from '@galatajs/app';
import {someCorePlugin} from "@galatajs/some-core-plugin"
import {somePlugin} from "some-plugin"

const app = createApp<App>();
app.use(somePlugin);
app.register(someCorePlugin);
app.start();
```

### Module System Usage

`galatajs` supports module-based system such as Angular and NestJS. -However, it does not make mandatory, it behaves as you wish, friendly ;)-

If you want to use the module-based system, which is the solution we recommend, although not mandatory, you can follow the steps below.

#### create a main module

`galatajs` processes module-based system such as NestJS and Angular with the inductive method in the background. So it needs the main module for the starting point.

```typescript
// src/main.ts
import { createModule } from "@galatajs/app";

export const mainModule = createModule("mainModule", {
    imports: [
        // your modules
    ]
});
```

#### Register main module to app

We have to do this for your `galatajs` project to recognize the main module. Just like you need the internet to google something.

```typescript
import { createApp } from "@galatajs/app";
import { mainModule } from "./src/main";

const app = createApp(mainModule);
app.start();
```

If you've read the doc from the very beginning, you've noticed that `createApp` works in different 2 ways. If you take a main module as a parameter and don't give it a module, it will act as if you are not using a module-based system.

#### Modules With Dependencies

Let's face it, no one is going to go into production using just the main module. Adding your own modules is pretty easy. Let's try!

```typescript
// src/modules/product/product.service.ts

export class ProductService {
    constructor(){}

    getAll = () : string => {
        return 'Hello world!';
    }
}
```

```typescript
// src/modules/product/product.module.ts
import { createModule } from "@galatajs/app";
import { ProductService } from "./product.service";

export const productModule = createModule('product', {
    providers: [ProductService],
    exports: [ProductService]
});
```

A little info while yo're here.

> provider is the equivalent of all the dependencies you will use in the module. For example, if your `ProductController` is dependent on `ProductService`, you should provide it here.
>
> export exists for any provider in this module to be used in an external module. For example, if you want to use `ProductService` in an external module, you should provide and export it.
> 
> `galatajs` itself manages the singleton structure for you!

#### Register your module

Now that you've created your module, you can register it to the app.

```typescript
// src/main.ts
import { createModule } from "@galatajs/app";
import { productModule } from "./src/modules/product";

export const mainModule = createModule("mainModule", {
    imports: [
        productModule
    ]
});
```

that's it!

### Create your own plugin

You can develop your own plugins with the ``galatajs framework``. Whether you use it or present it te people, the `galatajs framework` offers a high degree of customizability.

create plugin:

```typescript
import {createPlugin} from "@galatajs/app";

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
import {createApp} from "@galatajs/app";
import {somePlugin} from "some-plugin"

const app = createApp();
app.use(somePlugin); // install plugin
app.start();
```

import { createApp, App } from "@istanbul/app";
import { createHttpServer } from "@istanbul/http";
import { createMongodbApp } from "@istanbul/mongodb";
import { mainModule } from "./src/main.module";

const app: App = createApp(mainModule);
app.register(
  createMongodbApp({
    url: "mongodb://localhost:27017/istanbul-test",
  })
);
app.register(createHttpServer());

app.start();

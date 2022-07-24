import { createApp, App } from "@istanbul/app";
import { createHttpServer } from "@istanbul/http";
import { createTypeorm } from "@istanbul/typeorm";
import { mainModule } from "./src/main.module";

const app: App = createApp(mainModule);
app.register(createHttpServer());
app.register(
  createTypeorm({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "12345",
    database: "test",
  })
);

app.start();

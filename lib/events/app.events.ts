import { App } from "../types/app.type";
import { createEvent } from "@galatajs/events";

export const appCreatedEvent = createEvent<boolean>("appCreated");
export const appStartedEvent = createEvent<App>("appStarted");
export const appFinishedEvent = createEvent<string>("appFinished");

import { App } from "../types/app.type";
import { createEvent } from "@istanbul/events";

export const appCreatedEvent = createEvent<boolean>("appCreated");
export const appStartedEvent = createEvent<App>("appStarted");

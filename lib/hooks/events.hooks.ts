import { appFinishedEvent } from "../events/app.events";
import { CorePlugin, isCloseable } from "../plugins";

export const listenPlatformEvents = (
  plugins: Map<string, CorePlugin>
): void => {
  const publishEvent = (event: string): void => {
    appFinishedEvent.publish(event);
  };

  const closePlugins = (): void => {
    for (const plugin of plugins.values()) {
      if (isCloseable(plugin)) {
        plugin.close();
      }
    }
  };

  ["SIGBREAK", "SIGHUP", "SIGTERM", "SIGINT", "SIGBREAK"].forEach((signal) => {
    process.on(signal, () => {
      publishEvent(signal);
      closePlugins();
      process.exit(0);
    });
  });
};

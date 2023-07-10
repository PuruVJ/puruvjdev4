import { Miniflare, Log, LogLevel } from 'miniflare';
import { dev } from '$app/environment';

export const fallBackPlatformToMiniFlareInDev = async (_platform: App.Platform) => {
  if (!dev) return _platform;

  if (_platform) return _platform;
  const mf = new Miniflare({
    log: new Log(LogLevel.INFO),
    kvPersist: '.kv-data', // Use filebase or in memory store
    kvNamespaces: ['LIKES'], //Declare array with NameSpaces

    // wranglerConfigPath: new URL('../wrangler.toml', import.meta.url).pathname,

    script: `
		addEventListener("fetch", (event) => {
			event.waitUntil(Promise.resolve(event.request.url));
			event.respondWith(new Response(event.request.headers.get("X-Message")));
		});
		addEventListener("scheduled", (event) => {
			event.waitUntil(Promise.resolve(event.scheduledTime));
		});
		`,
  });

  // await mf.dispatchFetch('https://host.tld');

  // const env = await mf.getBindings();

  // // @ts-ignore
  // const platform: App.Platform = { env };

  // return platform;
};

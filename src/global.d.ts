/// <reference types="@sveltejs/kit" />
/// <reference types="bun-types" />
/// <reference types="vite/client" />
/// <reference types="@cloudflare/workers-types" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
  interface Platform {
    env?: {
      LIKES: KVNamespace;
    };
  }
}

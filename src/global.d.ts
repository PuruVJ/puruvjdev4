/// <reference types="@sveltejs/kit" />
/// <reference types="svelte" />
/// <reference types="vite/client" />

declare namespace App {
  interface Platform {
    env: {
      LIKES: KVNamespace;
    };
    context: {
      waitUntil(promise: Promise<any>): void;
    };
  }
}

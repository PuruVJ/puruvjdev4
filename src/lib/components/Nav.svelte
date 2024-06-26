<script lang="ts">
  import { inview } from 'svelte-inview';
  import ThemeSwitcher from '../components/ThemeSwitcher.svelte';
  import RssLink from '../components/RSSLink.svelte';
  import { theme } from '../stores/theme.store';
  import SiteLogo from './SiteLogo.svelte';
  import { page as skPage } from '$app/stores';

  let intersecting = false;

  export let page: string;
</script>

<nav
  class:dark={$theme === 'dark'}
  class:radioactive={$theme === 'radioactive'}
  class:shadow={!intersecting}
>
  <ul>
    <li>
      <a data-sveltekit-prefetch aria-current={page === '/' ? 'page' : 'false'} href="/"> HOME </a>
    </li>
    <li>
      <a
        data-sveltekit-prefetch
        aria-current={page?.startsWith('/blog') ? 'page' : 'false'}
        href="/blog"
      >
        BLOG
      </a>
    </li>
    <li>
      <a data-sveltekit-prefetch aria-current={page === '/works' ? 'page' : 'false'} href="/works">
        WORKS
      </a>
    </li>
  </ul>
  <div class="brand">
    <SiteLogo />
    <span>puruvj.dev</span>
  </div>
  <span class="flex" />
  <span class="theme-switcher">
    <RssLink />
    <ThemeSwitcher initialTheme={$skPage.data.theme} />
  </span>
</nav>

<div use:inview on:inview_change={({ detail }) => (intersecting = detail.inView)} class="smigget" />

<style lang="scss">
  nav {
    display: grid;
    align-items: center;
    grid-template-columns: 1fr auto 0 1fr;

    font-family: 'Jetbrains Mono', monospace;
    font-size: 1.2rem;

    background: var(--app-color-shell);

    width: 61.8%;

    position: fixed;
    top: 0;
    z-index: 20;

    padding-right: 0.6rem;

    border-radius: 0 0 1rem 1rem;

    transition:
      box-shadow 150ms ease-out,
      background-color var(--transition-duration) ease-in;

    &.dark.shadow {
      background-color: #383a3e;
    }

    &.radioactive.shadow {
      background-color: #202046;
    }

    &.shadow {
      box-shadow:
        0 3.4px 6.3px rgba(0, 0, 0, 0.099),
        0 27px 50px rgba(0, 0, 0, 0.1);
    }
  }

  .smigget {
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 2px;
  }

  ul {
    display: flex;
    align-items: center;
    // justify-content: center;

    list-style: none;

    padding: 0;
    margin: 0;
  }

  a {
    --color: var(--app-color-primary);
    --color-rgb: var(--app-color-primary-rgb);
    --marker-height: 6px;
    --marker-opacity: 0.4;
    --border-radius: 0;

    display: inline-block;

    user-select: none;

    z-index: 22;

    padding: 0rem 0.3rem;
    margin: 0.5rem 0.5rem;

    font-weight: 500;
    color: var(--color) !important;

    position: relative;

    transition: all 170ms ease-in;

    &:focus-visible,
    &:hover {
      --border-radius: 4px;
      --marker-height: 100%;
      --marker-opacity: 1;
      --color: var(--app-color-primary-contrast) !important;

      &::after {
        transform: scaleX(1);
      }
    }

    &[aria-current='page'] {
      &::after {
        transform: scaleX(1);
      }
    }
  }

  a::after {
    content: '';

    position: absolute;
    bottom: 0;
    left: 0;
    z-index: -1;

    width: 100%;
    height: var(--marker-height);

    transform: scaleX(0);
    transform-origin: bottom;

    border-radius: var(--border-radius);

    will-change: trasnform;
    transition: all 170ms ease-in;

    background-color: rgba(var(--color-rgb), var(--marker-opacity));
  }

  .brand {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 600;
    color: var(--app-color-primary);
    font-size: 1.5rem;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    // padding: 0 0 0 0.75rem;

    height: 100%;

    span {
      line-height: 1 !important;
    }

    :global(path),
    :global(rect) {
      transition: fill 200ms ease-in;
      // transition-delay: -100ms;
    }

    & :global(svg) {
      --size: 2rem;
      height: var(--size);
      width: var(--size);

      margin-right: 0.75rem;
    }
  }

  .theme-switcher {
    display: flex;
    justify-content: flex-end;
  }

  @media screen and (max-width: 1100px) {
    nav {
      width: 95%;
    }
  }

  @media screen and (max-width: 600px) {
    .brand {
      display: none !important;
    }

    nav {
      grid-template-columns: auto 0 1fr auto;
    }
  }

  @media screen and (max-width: 405px) {
    a {
      padding-block: 0.3rem;
      margin: 0.2rem 0.2rem !important;
    }
  }
</style>

<script>
  import { mdiDevTo, mdiGithub, mdiTwitter } from '@mdi/js';
  import Icon from './Icon.svelte';

  let size = 30;
</script>

<!-- hehe -->
<footer>
  <div class="copy-area">
    <p>Made with</p>
    <img src="/emojis/love.svg" width="36" height="36" alt="❤" />
    <p>by Puru Vijay</p>
  </div>
  <div class="social-links">
    <a
      href="https://twitter.com/puruvjdev"
      rel="noreferrer"
      data-sveltekit-reload
      target="_blank"
      id="twitter"
      aria-label="Puru Vijay's Twitter Profile"
    >
      <Icon {size} path={mdiTwitter} />
    </a>
    <a
      href="https://github.com/puruvj"
      rel="noreferrer"
      data-sveltekit-reload
      target="_blank"
      id="github"
      aria-label="Puru Vijay's Github Profile"
    >
      <Icon {size} path={mdiGithub} />
    </a>
    <a
      href="https://dev.to/puruvj"
      rel="noreferrer"
      data-sveltekit-reload
      target="_blank"
      id="devto"
      aria-label="Puru Vijay's Dev.to Profile"
    >
      <Icon {size} path={mdiDevTo} />
    </a>
  </div>
</footer>

<style lang="scss">
  footer {
    padding: 1rem;

    display: flex;

    font-family: 'JetBrains Mono', monospace;

    font-size: 1rem;
  }

  img {
    height: 1em;
    vertical-align: middle;
  }

  .copy-area {
    flex: 1 1 auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .social-links {
    display: flex;
    align-items: center;
  }

  .social-links a {
    fill: var(--app-color-dark);

    display: flex;
    align-items: center;

    transition: fill 120ms ease-out;

    margin: 0 4px;

    transition: transform 200ms ease-in;

    &:hover,
    &:focus-visible {
      transform: scale(1.2);
    }
  }
  @media screen and (max-width: 600px) {
    footer {
      padding: 0.5rem;
    }

    .copy-area {
      font-size: 0.7rem;
    }
  }
</style>

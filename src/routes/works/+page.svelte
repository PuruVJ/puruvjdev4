<script lang="ts">
  import { fadeIn, fadeOut } from '$lib/fade';
  import { onMount } from 'svelte';
  import type { PageData } from './$types';

  export let data: PageData;
  $: ({ works } = data);

  onMount(() => {
    document.body.classList.add('background');
    import('lazysizes');
  });
</script>

<svelte:head>
  <title>Works // Puru Vijay</title>
</svelte:head>

<main in:fadeIn out:fadeOut>
  {#each works as { title, image, url, repo, description }}
    <section>
      <div class="img-preview">
        <figure style="--padding-top: {image.aspectHTW * 100}%;">
          <picture>
            <source
              type="image/{image.format}"
              media="(min-width: 1001px)"
              data-srcset={image.small.org.replace('../', '/')}
            />
            <source
              type="image/{image.format}"
              media="(max-width: 1000px)"
              data-srcset={image.large.org.replace('../', '/')}
            />
            <img
              alt="{title} photo"
              data-src={image.large.org.replace('../', '/')}
              class="lazyload blog-img"
            />
          </picture>
        </figure>
      </div>
      <div class="info-section">
        <div class="title">{title}</div>
        <div class="description">{@html description}</div>
        <div class="links">
          {#if url}
            <a href={url}>Demo</a>
          {/if}
          {#if repo.url}
            <a href={repo.url}>Source</a>
          {/if}
        </div>
      </div>
    </section>
  {/each}
</main>

<style lang="scss">
  main {
    margin-top: 1rem;

    display: grid;
    grid-template-rows: repeat(auto, 1fr);
    gap: 3rem;
  }

  section {
    display: flex;

    border-radius: 1rem;
  }

  .img-preview {
    max-width: 100%;

    object-fit: contain;

    figure {
      --bgcolor: var(--app-color-primary);

      width: 25rem;

      padding-top: var(--padding-top);
      margin: 0;

      position: relative;
      border-radius: 0.75rem;

      background-color: var(--bgcolor);

      picture {
        border-radius: inherit;

        width: inherit;
      }

      img {
        height: auto;
        width: inherit;

        position: absolute;
        top: 0;

        opacity: 0;

        transition: opacity 200ms ease-in;

        border-radius: inherit;

        &:global(.lazyloaded) {
          opacity: 1;
        }
      }
    }
  }

  .info-section {
    display: grid;
    grid-template-rows: auto 1fr auto;

    padding: 0 0 0 1rem;
  }

  .title {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 500;
    font-size: 1.5rem;
    line-height: 1;
  }

  .links {
    font-size: 1.5rem;
  }

  main :global(a[href]) {
    --distance: calc(50% - 0.375rem);
    --opacity: 0.35;
    --duration: 100ms;
    --easing: ease-in-out;

    font-weight: 600 !important;

    padding: 0 0.25rem;

    background-image: linear-gradient(
      transparent 0%,
      transparent var(--distance),
      rgba(var(--app-color-primary-rgb), var(--opacity)) var(--distance),
      rgba(var(--app-color-primary-rgb), var(--opacity)) 100%
    );
    background-size: 100% 200%;
    background-position: 0 0;

    transition: color var(--duration) var(--easing),
      background-position var(--duration) var(--easing),
      background-image var(--duration) var(--easing), border-radius var(--duration) var(--easing),
      --opacity var(--duration) var(--easing);
  }

  main :global(a[href]:hover),
  main :global(a[href]:focus-visible) {
    background-position: 0 100%;

    color: var(--app-color-primary-contrast);
    font-weight: 600 !important;

    border-radius: 0.25rem;

    --opacity: 1;
  }

  @media screen and (max-width: 1000px) {
    section {
      flex-direction: column;

      figure {
        width: 100% !important;
      }
    }

    .info-section {
      padding: 0;
    }

    .title {
      line-height: 1.618;
    }
  }
</style>

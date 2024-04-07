<script lang="ts">
  import { enhance } from '$app/forms';
  import Icon from '$lib/components/Icon.svelte';
  import Toc from '$lib/components/TOC.svelte';
  import { fadeIn, fadeOut } from '$lib/fade';
  import { formatDate } from '$lib/helpers/format-date';
  import { readingProgress } from '$lib/stores/progress.store';
  import { theme } from '$lib/stores/theme.store';
  import { mdiHeart, mdiHeartOutline } from '@mdi/js';
  import { onDestroy, onMount } from 'svelte';
  import { throttle } from 'throttle-debounce';
  import '../../../css/blog-page-style.scss';

  export let data;
  export let form;

  $: ({ blogData, likes } = data);
  $: ({ title, body, date, description, cover_image, id, reading_time, series, toc } = blogData);
  $: browserTitle = title.replace(/<img.*?alt="(.*?)"[^\>]+>/g, '$1');

  function handleProgressBar() {
    const { scrollHeight, clientHeight, scrollTop } = document.documentElement;

    $readingProgress = scrollTop / (scrollHeight - clientHeight);
  }

  let throttledHandler: () => void;
  onMount(() => {
    marked = !!localStorage.getItem(`like:${id}`);
    document.body.classList.remove('background');

    import('lazysizes');

    throttledHandler = throttle(50, handleProgressBar, { noLeading: true });
    document.addEventListener('scroll', throttledHandler);
    return () => document.removeEventListener('scroll', throttledHandler);
  });

  onDestroy(() => {
    $readingProgress = 0;
  });

  let marked = false;
</script>

<svelte:head>
  <title>{browserTitle} Puru Vijay</title>
  <meta name="description" content={description} />

  <meta property="og:title" content="{browserTitle} Puru Vijay" />
  <meta property="og:description" content={description} />
  <meta property="og:image" content="https://puruvj.dev/{cover_image}" />
  <meta property="og:url" content="https://puruvj.dev/blog/{id}" />

  <link rel="canonical" href="https://puruvj.dev/blog/{id}" />
</svelte:head>

<main in:fadeIn out:fadeOut>
  <Toc {toc} />

  <form
    class="like-button-form"
    method="POST"
    use:enhance={({ formData }) => {
      return ({ update }) => {
        update();
        marked = !marked;

        const operation = formData.get('operation');
        if (operation === 'inc') {
          localStorage.setItem(`like:${id}`, 'true');
        } else {
          localStorage.removeItem(`like:${id}`);
        }
      };
    }}
  >
    <input type="hidden" name="blogID" value={id} />
    <input type="hidden" name="operation" value={marked ? 'dec' : 'inc'} />
    <button class="like-button" class:marked class:dark={$theme === 'dark'} type="submit">
      <Icon size={30} path={marked ? mdiHeart : mdiHeartOutline} />
      <span>{form?.likes ?? likes}</span>
    </button>
  </form>

  <div class="progress" aria-roledescription="progress">
    <div class="indicator" style="transform: scaleX({$readingProgress})" />
  </div>
  <span class="series">
    {#if series}
      <mark>SERIES</mark> {series}
    {/if}
  </span>
  <h1>{@html title}</h1>
  <p><time>{formatDate(date)}</time> &bull; <span>{Math.ceil(reading_time)} min read</span></p>
  <article id="blog-content">
    {@html body}
  </article>
</main>

<style lang="scss">
  p {
    margin: 0;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 500;
    font-size: 1.2rem;
    color: var(--app-color-primary);

    text-align: center;
  }

  #blog-content {
    font-size: 1.3rem;
    font-weight: 400 !important;
  }

  div.progress {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 21;

    margin: 0;

    width: 100%;
    height: 4px;

    .indicator {
      height: 100%;
      width: 100%;

      background-color: var(--app-color-primary);

      transform: scaleX(0);
      transform-origin: 0 0;
    }
  }

  .series {
    font-size: 1.3rem;

    color: rgba(var(--app-color-dark-rgb), 0.6);

    letter-spacing: 1px;
    font-family: 'JetBrains Mono', monospace;

    mark {
      font-family: 'Jetbrains Mono', monospace;
      font-weight: 600;
    }
  }

  .like-button {
    background: transparent;

    border: none;
    border-radius: 30px;

    cursor: pointer;

    display: flex;
    align-items: center;
    gap: 5px;

    padding: 0.5rem 0.9rem;

    fill: #dd2e44;
    font-size: 1.3rem;
    color: var(--app-color-dark);
    font-weight: 600;
    font-family: 'JetBrains Mono', monospace;

    transition: all 200ms ease-in;

    &.marked {
      box-shadow: 0 0 0 2px var(--app-color-primary);
    }

    &:hover,
    &:focus {
      background: var(--app-color-primary-tint);
      box-shadow:
        0 7.9px 8.6px rgba(0, 0, 0, 0.085),
        0 63px 69px rgba(0, 0, 0, 0.17);
    }
  }

  .like-button-form {
    position: fixed;
    z-index: 100;

    left: calc(61.8% + 19.1%);
    top: 50%;

    margin-top: -17px;
    width: calc((100% - 61.8%) / 2);

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  @media screen and (max-width: 1100px) {
    .like-button-form {
      left: auto;
      top: auto;
      right: 0 !important;
      bottom: 0 !important;

      height: 120px;
      width: 140px;
    }

    .like-button {
      background: var(--app-color-shell);

      box-shadow:
        0 3px 8.6px rgba(0, 0, 0, 0.27),
        0 24px 69px rgba(0, 0, 0, 0.54);

      &.dark {
        background-color: #383a3e;
      }
    }
  }
</style>

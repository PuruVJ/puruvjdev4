<script lang="ts">
  import { enhance } from '$app/forms';
  import { mdiMoonFull, mdiWhiteBalanceSunny } from '@mdi/js';
  import { onMount } from 'svelte';
  import type { Theme } from '../stores/theme.store';
  import { theme } from '../stores/theme.store';
  import Icon from './Icon.svelte';
  import Moon from './Moon.svelte';
  import RadioactiveSvg from './RadioactiveSVG.svelte';

  export let initialTheme: Theme | undefined;

  // List of themes
  const themes: Theme[] = ['light', 'midday', 'dark', 'radioactive'];
  let currentThemeIndex = initialTheme ? themes.indexOf(initialTheme) : 0;

  function nextTheme(currentThemeIndex: number) {
    const { length } = themes;

    return (currentThemeIndex + 1) % length;
  }

  onMount(() => {
    // Initialize with localstorage
    const browserPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    currentThemeIndex = initialTheme ? themes.indexOf(initialTheme) : browserPrefersDark ? 2 : 0;
  });

  $: $theme = themes[currentThemeIndex];
</script>

<svelte:head>
  <meta
    name="theme-color"
    content={['white', '#f9dec9', '#222428', '#13132a'][currentThemeIndex]}
  />
</svelte:head>

<form
  method="post"
  action="/theme"
  use:enhance={() => {
    currentThemeIndex = nextTheme(currentThemeIndex);

    return ({ update }) => {
      update();
    };
  }}
>
  <input type="hidden" name="theme" value={themes[nextTheme(currentThemeIndex)]} />
  <button type="submit" aria-label={themes[currentThemeIndex]}>
    {#if currentThemeIndex === 0}
      <Icon path={mdiWhiteBalanceSunny} />
    {:else if currentThemeIndex === 1}
      <Icon path={mdiMoonFull} />
    {:else if currentThemeIndex === 2}
      <Moon />
    {:else}
      <RadioactiveSvg />
    {/if}
  </button>
</form>

<style>
  button {
    width: 2.3rem;
    height: 2.3rem;

    fill: var(--app-color-dark);

    border-radius: 50%;
  }

  button:hover,
  button:focus {
    background-color: rgba(var(--app-color-dark-rgb), 0.2);
  }
</style>

<script lang="ts">
  import { mdiHeart, mdiHeartOutline } from '@mdi/js';

  import { onMount } from 'svelte';
  import { fadeIn } from '../fade';
  import { emoStates } from '../stores/emos.store';
  import { theme } from '../stores/theme.store';
  import Icon from './Icon.svelte';

  // The ID of the blog
  export let blogID: string;
  export let likes: number;

  // Whether this component is marked
  let marked: boolean;

  async function toggleLikes() {
    const operation = marked ? 'dec' : 'inc';

    marked = !marked;

    if (operation === 'inc') {
      localStorage.setItem(`like:${blogID}`, 'true');
    } else {
      localStorage.removeItem(`like:${blogID}`);
    }
  }

  onMount(async () => {
    marked = !!localStorage.getItem(`like:${blogID}`);
  });
</script>

<form id="container" in:fadeIn>
  <button type="submit" on:click={toggleLikes} class:marked class:dark={$theme === 'dark'}>
    <Icon size={30} path={marked ? mdiHeart : mdiHeartOutline} />
    <span>{likes}</span>
  </button>
</form>

<style lang="scss">
</style>

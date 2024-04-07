<script lang="ts">
  import { browser } from '$app/environment';
  import BlogList from '$lib/components/BlogList.svelte';
  import { fadeIn, fadeOut } from '$lib/fade';
  import { onMount } from 'svelte';

  onMount(() => {
    document.body.classList.add('background');
  });

  export let data;
  $: ({ blogsList } = data);
</script>

<svelte:head>
  <title>Blog // Puru Vijay</title>

  <meta
    name="description"
    content="Read about web development, designing and programming on Puru Vijay's blog."
  />

  <meta property="og:title" content="Blog // Puru Vijay" />
  <meta
    property="og:description"
    content="Read about web development, designing and programming on Puru Vijay's blog."
  />
  <meta property="og:image" content="https://puruvj.dev/media/blog-social-intro.png" />
  <meta property="og:url" content="https://puruvj.dev/blog/" />

  <link rel="canonical" href="https://puruvj.dev/blog/" />
</svelte:head>

<div>
  <main tabindex="-1" in:fadeIn out:fadeOut>
    <h1>Blog</h1>

    <!-- This is here so sveltekit will prerender the blog pages too. Apparently it's not doing that 
    if I just mention the BlogList component here -->
    {#each blogsList as { id }}
      <!-- svelte-ignore a11y-missing-content -->
      <a hidden={browser} href="/blog/{id}" />
    {/each}
    <BlogList {blogsList} />
  </main>
</div>

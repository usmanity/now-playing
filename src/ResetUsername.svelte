<script>
  import { fly } from 'svelte/transition';
  import Cookies from 'js-cookie';
  let showReset = false;
  function resetUsername() {
    Cookies.remove('username');
    location = location;
  }
</script>

<div class="reset-container">
{#if showReset}
  <button transition:fly on:click={resetUsername}>
    Reset Username
  </button>
{/if}
<button class="little-x {showReset ? 'showing' : ''}" on:click={e => showReset = !showReset }>
  &#x00D7;
</button>
</div>



<style>
.reset-container {
  position: fixed;
  bottom: 10px;
  right: 10px;
}
.little-x {
  border-radius: 50%;
  width: 36px;
  height: 36px;
  padding: 0;
  padding-bottom: 2px;
  font-size: 26px;
  outline: none;
  transition: transform 0.2s;
  transform: rotate(45deg);
}
.showing {
  transform: rotate(90deg);
}
</style>

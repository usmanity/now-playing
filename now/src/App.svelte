<script>
	import { fade } from 'svelte/transition';
	import { username } from './fmStore.js';

	function saveUser() {
		username.set(username);
	}
</script>

<main>
	<div class="input-container">
		<input type="text" bind:value={$username} placeholder="Last.fm Username">
		{#if $username && $username.length > 0}
			<span on:click={saveUser} transition:fade="{{duration: 300}}" class="go-arrow">&#x2192;</span>
		{/if}
	</div>
</main>

<style type="text/scss">
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
		height: 100%;
		display: flex;
		justify-content: center;
		flex-direction: column;
		font-family: 'Inter', sans-serif;
	}

	input {
		font-size: 2em;
		width: 500px;
		margin: auto;
		text-align: center;
		outline: none;
		&:focus {
			border: 1px solid gray;
		}
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

	.go-arrow {
		position: absolute;
    margin-left: -60px;
    font-size: 2.5em;
    background-color: #8181ff;
    color: white;
    border-radius: 50%;
    width: 50px;
    text-align: center;
    height: 50px;
    margin-top: 9px;
		cursor: pointer;
		transition: background-color 0.3s;
		&:hover {
			background-color: #4747ff;
		}
	}
</style>

<script>
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import NowPlaying from './NowPlaying.svelte';
	// import ResetUsername from './ResetUsername.svelte';

	import Cookies from 'js-cookie';

	let username;
	let showNowPlaying = false;

	function eatCookies() {
		username = Cookies.get('username');
		showNowPlaying = !!username;
	}

	function saveUser() {
		saveToCookie(username);
		proceedToNowPlaying();
	}

	function saveToCookie(username) {
		Cookies.set('username', username, { expires: 7 } );
	}

	function proceedToNowPlaying() {
		showNowPlaying = true;
		console.log(username);
	}

	function handleSubmit(e) {
		if (e.key == 'Enter') {
			saveUser();
		}
	}

	onMount(eatCookies);
</script>

{#if showNowPlaying}
	<div class="now-playing-container">
		<NowPlaying {username}/>
	</div>
	<!-- <ResetUsername/> -->
{:else}
	<main>
		<div class="input-container">
			<input 
				type="text" 
				bind:value={username} 
				placeholder="Last.fm Username"
				on:keydown={ e => handleSubmit(e) }>
			{#if username && username.length > 0}
				<span on:click={saveUser} transition:fade="{{duration: 300}}" class="go-arrow">&#x2192;</span>
			{/if}
		</div>
	</main>
{/if}
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
	.now-playing-container {
		display: flex;
		width: 100%;
		height: 100%;
		justify-content: center;
		align-items: center;
		background-color: rgb(247, 249, 251);
	}

	@media (max-device-width: 480px) {
		input {
			max-width: 90%;
			font-size: 1em;
		}
		.go-arrow {
			margin-left: -31px;
    font-size: 1.2em;
    background-color: #8181ff;
    color: white;
    border-radius: 50%;
    width: 25px;
    text-align: center;
    height: 25px;
    margin-top: 4px;
		}
	}
</style>

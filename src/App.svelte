<script>
  import { fade } from 'svelte/transition';
  import { onMount } from 'svelte';
  import NowPlaying from './NowPlaying.svelte';
  import Cookies from 'js-cookie';

  let username = '';
  let showNowPlaying = false;
  let isFromUrl = false;

  function initApp() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlUser = urlParams.get('user') || urlParams.get('u');
    const hashUser = window.location.hash ? window.location.hash.replace(/^#\/?/, '').trim() : '';
    const initialUser = urlUser || hashUser || Cookies.get('username');

    if (initialUser) {
      username = initialUser;
      showNowPlaying = true;
      isFromUrl = Boolean(urlUser || hashUser);
    }
  }

  function saveUser() {
    if (!username || !username.trim()) return;
    username = username.trim();
    Cookies.set('username', username, { expires: 30 });
    showNowPlaying = true;
  }

  function resetUser() {
    Cookies.remove('username');
    const url = new URL(window.location);
    url.searchParams.delete('user');
    url.searchParams.delete('u');
    url.hash = '';
    window.history.replaceState({}, '', url);
    username = '';
    showNowPlaying = false;
    isFromUrl = false;
  }

  function handleKeydown(e) {
    if (e.key === 'Enter') {
      saveUser();
    }
  }

  onMount(initApp);
</script>

<div class="app-root">
  {#if showNowPlaying}
    <div class="now-playing-container">
      <NowPlaying {username} />
    </div>

    <!-- Bottom-right expanding refresh button -->
    <button
      class="change-user-btn"
      on:click={resetUser}
      title="Change username"
      aria-label="Change username"
    >
      <span class="refresh-icon">↺</span>
      <span class="btn-label">Change username</span>
    </button>
  {:else}
    <main class="welcome-screen">
      <div class="input-card">
        <div class="input-icon">🎵</div>
        <h1 class="welcome-title">Now Playing on Last.fm</h1>
        <p class="welcome-sub">Enter your Last.fm username to view your live card</p>

        <div class="input-wrapper">
          <input
            type="text"
            bind:value={username}
            placeholder="e.g. usmanity"
            on:keydown={handleKeydown}
          />
          {#if username && username.length > 0}
            <button class="submit-arrow" on:click={saveUser} transition:fade="{{ duration: 150 }}">
              →
            </button>
          {/if}
        </div>
      </div>
    </main>
  {/if}
</div>

<style>
  .app-root {
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #0b0d13;
    color: #f1f5f9;
    padding: 30px 16px;
    box-sizing: border-box;
  }

  .now-playing-container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* Bottom-Right Expanding Change Username Button */
  .change-user-btn {
    position: fixed;
    bottom: 24px;
    right: 24px;
    display: inline-flex;
    align-items: center;
    height: 42px;
    padding: 0 12px;
    border-radius: 9999px;
    background: rgba(22, 27, 38, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    color: #94a3b8;
    cursor: pointer;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 100;
  }

  .refresh-icon {
    font-size: 1.15rem;
    line-height: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.4s ease, color 0.2s ease;
    flex-shrink: 0;
  }

  .btn-label {
    max-width: 0;
    opacity: 0;
    overflow: hidden;
    white-space: nowrap;
    font-size: 0.82rem;
    font-weight: 500;
    color: #ffffff;
    transition: max-width 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease, margin-left 0.25s ease;
    margin-left: 0;
  }

  .change-user-btn:hover {
    color: #ffffff;
    background: rgba(30, 37, 52, 0.95);
    border-color: rgba(255, 255, 255, 0.25);
    padding: 0 16px 0 13px;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45);
  }

  .change-user-btn:hover .refresh-icon {
    transform: rotate(180deg);
    color: #60a5fa;
  }

  .change-user-btn:hover .btn-label {
    max-width: 150px;
    opacity: 1;
    margin-left: 8px;
  }

  /* Welcome Screen */
  .welcome-screen {
    width: 100%;
    max-width: 440px;
    margin: 0 auto;
    text-align: center;
  }

  .input-card {
    background: rgba(18, 21, 29, 0.75);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 36px 28px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
  }

  .input-icon {
    font-size: 2.2rem;
    margin-bottom: 12px;
  }

  .welcome-title {
    font-size: 1.4rem;
    font-weight: 700;
    margin: 0 0 8px 0;
    color: #ffffff;
    letter-spacing: -0.02em;
  }

  .welcome-sub {
    font-size: 0.88rem;
    color: #94a3b8;
    margin: 0 0 24px 0;
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    max-width: 320px;
    margin: 0 auto;
  }

  .input-wrapper input {
    width: 100%;
    padding: 12px 46px 12px 18px;
    font-size: 1rem;
    font-weight: 500;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    background: rgba(255, 255, 255, 0.05);
    color: #ffffff;
    outline: none;
    text-align: center;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .input-wrapper input:focus {
    border-color: #60a5fa;
    box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
  }

  .input-wrapper input::placeholder {
    color: #64748b;
  }

  .submit-arrow {
    position: absolute;
    right: 6px;
    width: 34px;
    height: 34px;
    border-radius: 8px;
    border: none;
    background: #3b82f6;
    color: #ffffff;
    font-size: 1.1rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .submit-arrow:hover {
    background: #2563eb;
  }
</style>

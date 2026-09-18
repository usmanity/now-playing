<script>
  import { fade } from 'svelte/transition';
  import { onMount } from 'svelte';
  import NowPlaying from './NowPlaying.svelte';
  import Cookies from 'js-cookie';

  let username = '';
  let showNowPlaying = false;
  let currentTheme = 'glass'; // 'glass' | 'editorial'
  let isFromUrl = false;

  function initApp() {
    // 1. Check URL parameters (?user= or ?u= or #hash)
    const urlParams = new URLSearchParams(window.location.search);
    const urlUser = urlParams.get('user') || urlParams.get('u');
    const hashUser = window.location.hash ? window.location.hash.replace(/^#\/?/, '').trim() : '';
    const initialUser = urlUser || hashUser || Cookies.get('username');

    // 2. Check theme param (?theme= or ?view= or localStorage)
    const urlTheme = urlParams.get('theme') || urlParams.get('view');
    const storedTheme = localStorage.getItem('np_theme');
    if (urlTheme === 'editorial' || urlTheme === 'glass') {
      currentTheme = urlTheme;
    } else if (storedTheme === 'editorial' || storedTheme === 'glass') {
      currentTheme = storedTheme;
    }

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

  function setTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('np_theme', theme);
    const url = new URL(window.location);
    url.searchParams.set('theme', theme);
    window.history.replaceState({}, '', url);
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

<div class="app-root theme-{currentTheme}">
  {#if showNowPlaying}
    <div class="now-playing-container">
      <NowPlaying {username} theme={currentTheme} />
    </div>

    <!-- Bottom Controls Floating Toolbar -->
    <div class="floating-controls">
      <div class="theme-switcher">
        <button
          class="theme-btn {currentTheme === 'glass' ? 'active' : ''}"
          on:click={() => setTheme('glass')}
          title="Dark Glassmorphic Theme"
        >
          <span class="theme-icon">✦</span> Glass
        </button>
        <button
          class="theme-btn {currentTheme === 'editorial' ? 'active' : ''}"
          on:click={() => setTheme('editorial')}
          title="Clean Editorial Theme"
        >
          <span class="theme-icon">◻</span> Editorial
        </button>
      </div>

      <button class="reset-btn" on:click={resetUser} title="Change Last.fm username">
        <span class="reset-icon">↺</span> Change User
      </button>
    </div>
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
    transition: background-color 0.4s ease, color 0.4s ease;
    padding: 30px 16px 80px 16px;
    box-sizing: border-box;
  }

  .app-root.theme-glass {
    background-color: #0b0d13;
    color: #f1f5f9;
  }

  .app-root.theme-editorial {
    background-color: #f8fafc;
    color: #0f172a;
  }

  .now-playing-container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* Floating Toolbar */
  .floating-controls {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px;
    border-radius: 9999px;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    z-index: 100;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
  }

  .theme-glass .floating-controls {
    background: rgba(22, 27, 38, 0.85);
    border: 1px solid rgba(255, 255, 255, 0.12);
  }

  .theme-editorial .floating-controls {
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid #e2e8f0;
  }

  .theme-switcher {
    display: flex;
    background: rgba(0, 0, 0, 0.15);
    border-radius: 9999px;
    padding: 2px;
  }

  .theme-btn {
    border: none;
    background: transparent;
    font-size: 0.78rem;
    font-weight: 600;
    padding: 5px 12px;
    border-radius: 9999px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    transition: all 0.2s ease;
  }

  .theme-glass .theme-btn {
    color: #94a3b8;
  }

  .theme-glass .theme-btn.active {
    background: rgba(255, 255, 255, 0.15);
    color: #ffffff;
  }

  .theme-editorial .theme-btn {
    color: #64748b;
  }

  .theme-editorial .theme-btn.active {
    background: #0f172a;
    color: #ffffff;
  }

  .reset-btn {
    border: none;
    background: transparent;
    font-size: 0.78rem;
    font-weight: 500;
    padding: 5px 12px;
    border-radius: 9999px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: all 0.2s ease;
  }

  .theme-glass .reset-btn {
    color: #94a3b8;
  }

  .theme-glass .reset-btn:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.1);
  }

  .theme-editorial .reset-btn {
    color: #64748b;
  }

  .theme-editorial .reset-btn:hover {
    color: #0f172a;
    background: #f1f5f9;
  }

  .reset-icon {
    font-size: 0.9rem;
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

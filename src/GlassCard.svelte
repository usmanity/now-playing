<script>
  export let trackName = '';
  export let artistName = '';
  export let albumName = '';
  export let imageUrl = '';
  export let isNowPlaying = false;
  export let timeAgo = '';
  export let isLoved = false;
  export let trackPlaycount = 0;
  export let artistPlaycount = 0;
  export let userScrobbles = 0;
  export let username = '';
  export let userAvatar = '';
  export let trackUrl = '';

  function getPercentage(track, artist) {
    let t = parseFloat(track);
    let a = parseFloat(artist);
    if (!a || isNaN(a) || !t || isNaN(t)) return 0;
    let divided = (t / a).toFixed(3);
    return (divided * 100).toFixed(1);
  }
</script>

<div class="glass-card-wrapper">
  <!-- Dynamic Ambient Glow -->
  {#if imageUrl}
    <div class="ambient-glow" style="background-image: url('{imageUrl}');"></div>
  {/if}

  <div class="glass-card">
    <div class="card-main">
      <div class="artwork-wrapper">
        {#if imageUrl}
          <img class="album-art" src={imageUrl} alt="{albumName || trackName} artwork" />
        {:else}
          <div class="album-art-placeholder">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
        {/if}
      </div>

      <div class="track-details">
        <div class="title-row">
          <a href={trackUrl || '#'} target="_blank" rel="noopener noreferrer" class="track-title" title={trackName}>
            {trackName}
          </a>
          {#if isLoved}
            <span class="loved-badge" title="Loved Track">❤️</span>
          {/if}
        </div>

        <div class="artist-name">{artistName}</div>
        {#if albumName}
          <div class="album-name">{albumName}</div>
        {/if}

        <div class="status-row">
          {#if isNowPlaying}
            <div class="equalizer-badge">
              <div class="equalizer-bars">
                <span class="bar bar-1"></span>
                <span class="bar bar-2"></span>
                <span class="bar bar-3"></span>
                <span class="bar bar-4"></span>
              </div>
              <span class="status-text">Now Playing</span>
            </div>
          {:else if timeAgo}
            <div class="idle-badge">
              <span class="status-dot"></span>
              <span class="status-text">Listened {timeAgo} ago</span>
            </div>
          {/if}
        </div>
      </div>
    </div>

    <!-- Stats Bar -->
    <div class="stats-section">
      <div class="stats-header">
        <a
          href="https://www.last.fm/user/{encodeURIComponent(username)}"
          target="_blank"
          rel="noopener noreferrer"
          class="user-pill"
          title="View {username}'s profile on Last.fm"
        >
          {#if userAvatar}
            <img src={userAvatar} alt="{username} avatar" class="user-avatar" />
          {/if}
          <span class="username">@{username}</span>
        </a>
        {#if userScrobbles}
          <span class="total-scrobbles">{parseInt(userScrobbles).toLocaleString()} scrobbles</span>
        {/if}
      </div>

      <div class="stats-content">
        {#if trackPlaycount}
          <div class="stat-item">
            <span class="stat-number">{parseInt(trackPlaycount).toLocaleString()}</span>
            <span class="stat-label">plays of this track</span>
            {#if artistPlaycount}
              <span class="stat-sub">({getPercentage(trackPlaycount, artistPlaycount)}% of artist)</span>
            {/if}
          </div>
        {/if}
        {#if artistPlaycount}
          <div class="stat-item">
            <span class="stat-number">{parseInt(artistPlaycount).toLocaleString()}</span>
            <span class="stat-label">plays of {artistName}</span>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .glass-card-wrapper {
    position: relative;
    width: 520px;
    max-width: 92vw;
    margin: 0 auto;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }

  .ambient-glow {
    position: absolute;
    top: -20px;
    left: -20px;
    right: -20px;
    bottom: -20px;
    background-size: cover;
    background-position: center;
    filter: blur(50px) saturate(1.8);
    opacity: 0.35;
    border-radius: 40px;
    z-index: 0;
    pointer-events: none;
    transition: background-image 0.8s ease-in-out;
  }

  .glass-card {
    position: relative;
    z-index: 1;
    background: rgba(18, 21, 29, 0.75);
    backdrop-filter: blur(28px) saturate(1.4);
    -webkit-backdrop-filter: blur(28px) saturate(1.4);
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.05);
    border-radius: 24px;
    overflow: hidden;
    color: #f1f5f9;
  }

  .card-main {
    display: flex;
    padding: 28px;
    gap: 24px;
    align-items: center;
  }

  .artwork-wrapper {
    position: relative;
    flex-shrink: 0;
    width: 170px;
    height: 170px;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: #0f1117;
  }

  .album-art {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .album-art-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748b;
  }

  .track-details {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .title-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
  }

  .track-title {
    font-size: 1.35rem;
    font-weight: 700;
    line-height: 1.3;
    color: #ffffff;
    text-decoration: none;
    letter-spacing: -0.02em;
    white-space: normal;
    word-break: break-word;
    transition: color 0.2s;
  }

  .track-title:hover {
    color: #93c5fd;
  }

  .loved-badge {
    font-size: 1.1rem;
    filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.6));
    flex-shrink: 0;
  }

  .artist-name {
    font-size: 1.05rem;
    font-weight: 600;
    color: #94a3b8;
    margin-bottom: 4px;
    letter-spacing: -0.01em;
  }

  .album-name {
    font-size: 0.9rem;
    color: #64748b;
    margin-bottom: 14px;
  }

  .status-row {
    display: flex;
    align-items: center;
    margin-top: 4px;
  }

  .equalizer-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(34, 197, 94, 0.12);
    border: 1px solid rgba(34, 197, 94, 0.25);
    padding: 6px 12px;
    border-radius: 9999px;
  }

  .equalizer-bars {
    display: flex;
    align-items: flex-end;
    gap: 3px;
    height: 15px;
    padding-bottom: 1px;
  }

  .bar {
    width: 3px;
    height: 100%;
    background: linear-gradient(180deg, #86efac 0%, #22c55e 100%);
    border-radius: 9999px;
    transform-origin: bottom;
    box-shadow: 0 0 6px rgba(74, 222, 128, 0.4);
    will-change: transform;
  }

  /* Vinyl Groove Equalizer Animation */
  .bar-1 { animation: vinyl-dance-1 1.8s cubic-bezier(0.25, 0.1, 0.25, 1) infinite; }
  .bar-2 { animation: vinyl-dance-2 1.45s cubic-bezier(0.25, 0.1, 0.25, 1) infinite; }
  .bar-3 { animation: vinyl-dance-3 2.05s cubic-bezier(0.25, 0.1, 0.25, 1) infinite; }
  .bar-4 { animation: vinyl-dance-4 1.65s cubic-bezier(0.25, 0.1, 0.25, 1) infinite; }

  @keyframes vinyl-dance-1 {
    0%, 100% { transform: scaleY(0.25); }
    25% { transform: scaleY(0.65); }
    50% { transform: scaleY(0.35); }
    75% { transform: scaleY(0.85); }
  }
  @keyframes vinyl-dance-2 {
    0%, 100% { transform: scaleY(0.5); }
    30% { transform: scaleY(0.2); }
    60% { transform: scaleY(0.95); }
  }
  @keyframes vinyl-dance-3 {
    0%, 100% { transform: scaleY(0.75); }
    35% { transform: scaleY(0.3); }
    70% { transform: scaleY(0.85); }
  }
  @keyframes vinyl-dance-4 {
    0%, 100% { transform: scaleY(0.3); }
    40% { transform: scaleY(0.75); }
    70% { transform: scaleY(0.35); }
  }

  .status-text {
    font-size: 0.8rem;
    font-weight: 600;
    color: #4ade80;
    letter-spacing: 0.02em;
  }

  .idle-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(148, 163, 184, 0.1);
    border: 1px solid rgba(148, 163, 184, 0.18);
    padding: 5px 12px;
    border-radius: 9999px;
  }

  .idle-badge .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #94a3b8;
  }

  .idle-badge .status-text {
    color: #cbd5e1;
    font-size: 0.8rem;
    font-weight: 500;
  }

  .stats-section {
    background: rgba(10, 12, 18, 0.6);
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    padding: 16px 28px;
  }

  .stats-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  .user-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    transition: opacity 0.2s ease;
  }

  .user-pill:hover {
    opacity: 0.8;
  }

  .user-pill:hover .username {
    color: #93c5fd;
  }

  .user-avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .username {
    font-size: 0.85rem;
    font-weight: 600;
    color: #e2e8f0;
  }

  .total-scrobbles {
    font-size: 0.8rem;
    font-weight: 500;
    color: #94a3b8;
    background: rgba(255, 255, 255, 0.06);
    padding: 3px 9px;
    border-radius: 6px;
  }

  .stats-content {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
  }

  .stat-item {
    font-size: 0.85rem;
    color: #cbd5e1;
    display: flex;
    align-items: baseline;
    gap: 6px;
  }

  .stat-number {
    font-weight: 700;
    color: #ffffff;
  }

  .stat-label {
    color: #94a3b8;
  }

  .stat-sub {
    color: #64748b;
    font-size: 0.8rem;
  }

  @media (max-width: 580px) {
    .card-main {
      flex-direction: column;
      text-align: center;
      padding: 22px 18px;
    }

    .artwork-wrapper {
      width: 140px;
      height: 140px;
      margin: 0 auto;
    }

    .title-row {
      justify-content: center;
    }

    .status-row {
      justify-content: center;
    }

    .stats-section {
      padding: 14px 18px;
    }

    .stats-content {
      flex-direction: column;
      gap: 6px;
    }
  }
</style>

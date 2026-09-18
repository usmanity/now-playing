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

<div class="editorial-card-wrapper">
  <div class="editorial-card">
    <div class="card-main">
      <div class="artwork-wrapper">
        {#if imageUrl}
          <img class="album-art" src={imageUrl} alt="{albumName || trackName} artwork" />
        {:else}
          <div class="album-art-placeholder">
            <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
        {/if}
      </div>

      <div class="track-details">
        <div class="header-line">
          {#if isNowPlaying}
            <div class="status-pill now-playing">
              <span class="live-dot"></span>
              <span>Now Playing</span>
            </div>
          {:else if timeAgo}
            <div class="status-pill idle">
              <span>Listened {timeAgo} ago</span>
            </div>
          {/if}

          {#if isLoved}
            <span class="loved-badge" title="Loved Track">❤️</span>
          {/if}
        </div>

        <a href={trackUrl || '#'} target="_blank" rel="noopener noreferrer" class="track-title" title={trackName}>
          {trackName}
        </a>

        <div class="artist-name">{artistName}</div>
        {#if albumName}
          <div class="album-name">{albumName}</div>
        {/if}
      </div>
    </div>

    <!-- Fine Hairline Divider -->
    <div class="hairline"></div>

    <!-- Stats Bar -->
    <div class="stats-bar">
      <div class="user-block">
        {#if userAvatar}
          <img src={userAvatar} alt="{username} avatar" class="user-avatar" />
        {/if}
        <span class="username">@{username}</span>
      </div>

      <div class="stats-metrics">
        {#if trackPlaycount}
          <div class="metric">
            <span class="metric-value">{parseInt(trackPlaycount).toLocaleString()}</span>
            <span class="metric-label">track plays</span>
            {#if artistPlaycount}
              <span class="metric-percentage">({getPercentage(trackPlaycount, artistPlaycount)}%)</span>
            {/if}
          </div>
        {/if}

        {#if artistPlaycount}
          <div class="metric">
            <span class="metric-value">{parseInt(artistPlaycount).toLocaleString()}</span>
            <span class="metric-label">artist plays</span>
          </div>
        {/if}

        {#if userScrobbles}
          <div class="metric total-metric">
            <span class="metric-value">{parseInt(userScrobbles).toLocaleString()}</span>
            <span class="metric-label">total</span>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .editorial-card-wrapper {
    width: 540px;
    max-width: 92vw;
    margin: 0 auto;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }

  .editorial-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 18px;
    box-shadow: 0 10px 30px -4px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03);
    overflow: hidden;
    color: #0f172a;
    transition: box-shadow 0.2s ease, border-color 0.2s ease;
  }

  .card-main {
    display: flex;
    padding: 24px;
    gap: 22px;
    align-items: center;
  }

  .artwork-wrapper {
    position: relative;
    flex-shrink: 0;
    width: 140px;
    height: 140px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
    background: #f8fafc;
    border: 1px solid #f1f5f9;
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
    color: #94a3b8;
  }

  .track-details {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .header-line {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .status-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 3px 10px;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  .status-pill.now-playing {
    background: #f0fdf4;
    color: #16a34a;
    border: 1px solid #bbf7d0;
  }

  .status-pill.idle {
    background: #f8fafc;
    color: #64748b;
    border: 1px solid #e2e8f0;
    text-transform: none;
  }

  .live-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #22c55e;
    box-shadow: 0 0 8px rgba(34, 197, 94, 0.8);
    animation: pulse 1.8s infinite;
  }

  @keyframes pulse {
    0% { transform: scale(0.95); opacity: 0.8; }
    50% { transform: scale(1.3); opacity: 1; }
    100% { transform: scale(0.95); opacity: 0.8; }
  }

  .loved-badge {
    font-size: 1rem;
    margin-left: auto;
  }

  .track-title {
    font-size: 1.3rem;
    font-weight: 700;
    line-height: 1.25;
    color: #0f172a;
    text-decoration: none;
    letter-spacing: -0.02em;
    margin-bottom: 4px;
    transition: color 0.15s;
  }

  .track-title:hover {
    color: #2563eb;
  }

  .artist-name {
    font-size: 1rem;
    font-weight: 600;
    color: #475569;
    margin-bottom: 2px;
  }

  .album-name {
    font-size: 0.85rem;
    color: #94a3b8;
  }

  .hairline {
    height: 1px;
    background: #f1f5f9;
    width: 100%;
  }

  .stats-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 24px;
    background: #fafafa;
    gap: 16px;
  }

  .user-block {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .user-avatar {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid #e2e8f0;
  }

  .username {
    font-size: 0.82rem;
    font-weight: 600;
    color: #334155;
  }

  .stats-metrics {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  .metric {
    display: inline-flex;
    align-items: baseline;
    gap: 4px;
    font-size: 0.82rem;
  }

  .metric-value {
    font-weight: 700;
    color: #0f172a;
  }

  .metric-label {
    color: #64748b;
    font-size: 0.78rem;
  }

  .metric-percentage {
    color: #94a3b8;
    font-size: 0.75rem;
  }

  .total-metric {
    border-left: 1px solid #e2e8f0;
    padding-left: 14px;
  }

  @media (max-width: 580px) {
    .card-main {
      flex-direction: column;
      text-align: center;
      padding: 20px 16px;
    }

    .artwork-wrapper {
      width: 130px;
      height: 130px;
      margin: 0 auto;
    }

    .header-line {
      justify-content: center;
      gap: 10px;
    }

    .stats-bar {
      flex-direction: column;
      gap: 10px;
      padding: 14px 16px;
    }

    .stats-metrics {
      justify-content: center;
      gap: 10px;
    }

    .total-metric {
      border-left: none;
      padding-left: 0;
    }
  }
</style>

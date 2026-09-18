<script>
  import { onMount, onDestroy } from 'svelte';
  import { formatDistance } from 'date-fns';
  import GlassCard from './GlassCard.svelte';
  import EditorialCard from './EditorialCard.svelte';

  export let username = '';
  export let theme = 'glass';

  let currentTrack = null;
  let trackName = '';
  let artistName = '';
  let albumName = '';
  let imageUrl = '';
  let isNowPlaying = false;
  let timeAgo = '';
  let isLoved = false;
  let trackPlaycount = 0;
  let artistPlaycount = 0;
  let userScrobbles = 0;
  let userAvatar = '';
  let trackUrl = '';
  let loading = true;
  let lastTrackSignature = '';
  let pollTimer = null;

  const apiKey = '30115c5279f79d6eea66d783895ba6c7';
  const baseURL = `https://ws.audioscrobbler.com/2.0/?api_key=${apiKey}&format=json&autocorrect=1`;

  function getBestImage(imageArray) {
    if (!Array.isArray(imageArray) || imageArray.length === 0) return '';
    // Priority: extralarge (index 3), large (index 2), medium (index 1)
    const preferredOrder = [3, 2, 1, 0];
    for (const idx of preferredOrder) {
      if (imageArray[idx] && imageArray[idx]['#text']) {
        let url = imageArray[idx]['#text'];
        // Last.fm image CDN supports upgrading to higher res
        if (url.includes('/300x300/')) {
          url = url.replace('/300x300/', '/600x600/');
        }
        return url;
      }
    }
    return '';
  }

  function getTimeAgo(epochSeconds) {
    if (!epochSeconds) return '';
    return formatDistance(new Date(), new Date(epochSeconds * 1000));
  }

  async function loadRecentTrack() {
    try {
      const fullUrl = `${baseURL}&limit=1&user=${encodeURIComponent(username)}&method=user.getrecenttracks`;
      const res = await fetch(fullUrl);
      const data = await res.json();

      const rawTracks = data?.recenttracks?.track;
      const song = Array.isArray(rawTracks) ? rawTracks[0] : rawTracks;

      if (!song) {
        loading = false;
        return;
      }

      const rawArtist = song.artist?.['#text'] || song.artist?.name || (typeof song.artist === 'string' ? song.artist : '');
      const rawAlbum = song.album?.['#text'] || song.album?.title || '';
      const rawTrack = song.name || '';
      const signature = `${rawArtist}:::${rawTrack}`;

      isNowPlaying = Boolean(song['@attr'] && song['@attr'].nowplaying === 'true');
      timeAgo = song.date ? getTimeAgo(parseInt(song.date.uts, 10)) : '';
      trackName = rawTrack;
      artistName = rawArtist;
      albumName = rawAlbum;
      imageUrl = getBestImage(song.image);
      trackUrl = song.url || '';

      // Only refetch deep metadata if track signature changed
      if (signature !== lastTrackSignature) {
        lastTrackSignature = signature;
        await Promise.all([
          getTrackInfo(artistName, trackName),
          getArtistInfo(artistName)
        ]);
      }
    } catch (err) {
      console.error('Error fetching recent track:', err);
    } finally {
      loading = false;
    }
  }

  async function getTrackInfo(artist, track) {
    if (!artist || !track) return;
    try {
      const fullUrl = `${baseURL}&user=${encodeURIComponent(username)}&method=track.getInfo&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(track)}`;
      const res = await fetch(fullUrl);
      const data = await res.json();
      if (data?.track) {
        trackPlaycount = parseInt(data.track.userplaycount, 10) || 0;
        isLoved = data.track.userloved === '1' || data.track.userloved === 1;
        if (!imageUrl && data.track.album?.image) {
          imageUrl = getBestImage(data.track.album.image);
        }
      }
    } catch (err) {
      console.error('Error fetching track info:', err);
    }
  }

  async function getArtistInfo(artist) {
    if (!artist) return;
    try {
      const fullUrl = `${baseURL}&user=${encodeURIComponent(username)}&method=artist.getInfo&artist=${encodeURIComponent(artist)}`;
      const res = await fetch(fullUrl);
      const data = await res.json();
      if (data?.artist?.stats) {
        artistPlaycount = parseInt(data.artist.stats.userplaycount, 10) || 0;
      }
    } catch (err) {
      console.error('Error fetching artist info:', err);
    }
  }

  async function getUserInfo() {
    try {
      const fullUrl = `${baseURL}&user=${encodeURIComponent(username)}&method=user.getInfo`;
      const res = await fetch(fullUrl);
      const data = await res.json();
      if (data?.user) {
        userScrobbles = parseInt(data.user.playcount, 10) || 0;
        if (data.user.image) {
          userAvatar = data.user.image[2]?.['#text'] || data.user.image[1]?.['#text'] || '';
        }
      }
    } catch (err) {
      console.error('Error fetching user info:', err);
    }
  }

  onMount(() => {
    loadRecentTrack();
    getUserInfo();
    pollTimer = setInterval(loadRecentTrack, 20000);
  });

  onDestroy(() => {
    if (pollTimer) clearInterval(pollTimer);
  });
</script>

{#if loading}
  <div class="skeleton-container theme-{theme}">
    <div class="skeleton-box">
      <div class="skeleton-art"></div>
      <div class="skeleton-lines">
        <div class="skeleton-line w-75"></div>
        <div class="skeleton-line w-50"></div>
        <div class="skeleton-line w-40"></div>
      </div>
    </div>
  </div>
{:else}
  {#if theme === 'editorial'}
    <EditorialCard
      {trackName}
      {artistName}
      {albumName}
      {imageUrl}
      {isNowPlaying}
      {timeAgo}
      {isLoved}
      {trackPlaycount}
      {artistPlaycount}
      {userScrobbles}
      {username}
      {userAvatar}
      {trackUrl}
    />
  {:else}
    <GlassCard
      {trackName}
      {artistName}
      {albumName}
      {imageUrl}
      {isNowPlaying}
      {timeAgo}
      {isLoved}
      {trackPlaycount}
      {artistPlaycount}
      {userScrobbles}
      {username}
      {userAvatar}
      {trackUrl}
    />
  {/if}
{/if}

<style>
  .skeleton-container {
    width: 520px;
    max-width: 92vw;
    margin: 0 auto;
    border-radius: 20px;
    padding: 28px;
  }

  .skeleton-container.theme-glass {
    background: rgba(18, 21, 29, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .skeleton-container.theme-editorial {
    background: #ffffff;
    border: 1px solid #e2e8f0;
  }

  .skeleton-box {
    display: flex;
    gap: 20px;
    align-items: center;
  }

  .skeleton-art {
    width: 140px;
    height: 140px;
    border-radius: 12px;
    background: linear-gradient(90deg, rgba(148, 163, 184, 0.15) 25%, rgba(148, 163, 184, 0.25) 50%, rgba(148, 163, 184, 0.15) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  .skeleton-lines {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .skeleton-line {
    height: 16px;
    border-radius: 8px;
    background: linear-gradient(90deg, rgba(148, 163, 184, 0.15) 25%, rgba(148, 163, 184, 0.25) 50%, rgba(148, 163, 184, 0.15) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  .w-75 { width: 75%; height: 22px; }
  .w-50 { width: 50%; }
  .w-40 { width: 40%; }

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
</style>

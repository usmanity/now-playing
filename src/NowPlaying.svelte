<script>
  import { onMount } from 'svelte';
  import { formatDistance } from 'date-fns';

  export let username;
  let recentTracks;
  let currentSong;
  let baseURL = "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&api_key=30115c5279f79d6eea66d783895ba6c7&format=json&limit=1";
  
  function getTimeAgo(latest) {
    return formatDistance(new Date(), latest);
  }

  let fetchSong = loadLatestSong();

  async function loadLatestSong() {
    console.log('doing the due');
    let fullUrl = baseURL + `&user=${username}`;
    const res = await fetch(fullUrl);
    recentTracks = await res.json();
    currentSong = recentTracks.recenttracks.track[0];
    return recentTracks;
  }

  let interval = setInterval(loadLatestSong, 20000);

  loadLatestSong();

</script>
<div class="current-song">
{#await fetchSong}
  <div class="loading">
  Loading...
  </div>
{:then recentTracks}
  <div class="track-details">
    <div class="image-container">
      <img src={currentSong.image[2]['#text']} alt="album cover">
    </div>
    <div class="track-info">
      <div>
        {currentSong.name}
      </div>
      <div>
        {currentSong.artist['#text']}
      </div>
      <div>
        {currentSong.album['#text']}
      </div>
      {#if currentSong['@attr']}
      <div class="now-playing-animation">
        <img src="sound.gif" alt="now playing animation">
      </div>
      {:else}
      <div class="last-played">
      Listened {getTimeAgo(parseInt(currentSong.date.uts) * 1000)} ago
      </div>
      {/if}
    </div>
  </div>
{/await}
</div>

<style type="text/scss">
.current-song {
  border: 1px solid black;
  padding: 20px;
  background-color: white;
  width: 400px;
  height: 180px;
  max-width: 80%;
}
.track-details {
  display: flex;
}
.track-info {
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  > div {
    margin-bottom: 8px;
  }
}
.loading {
  width: 100%;
  height: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
.now-playing-animation img {
  width: 20px;
}
</style>

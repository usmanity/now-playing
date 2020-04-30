<script>
  import { onMount } from 'svelte';
  import { formatDistance } from 'date-fns';

  export let username;
  let recentTracks;
  let currentSong;
  let trackPlaycount;
  let artistPlaycount;
  let userScrobbles;
  let trackName;
  let artistName;
  let baseURL = `https://ws.audioscrobbler.com/2.0/?api_key=30115c5279f79d6eea66d783895ba6c7&format=json&limit=1&user=${username}&autocorrect=1`;
  
  function getTimeAgo(latest) {
    return formatDistance(new Date(), latest);
  }

  let fetchSong = loadLatestSong();

  async function loadLatestSong() {
    let fullUrl = baseURL + `&method=user.getrecenttracks`;
    const res = await fetch(fullUrl);
    recentTracks = await res.json();
    currentSong = recentTracks.recenttracks.track[0];
    getTrackPlaycount(currentSong);
    getArtistPlaycount(currentSong);
    getLifetimeScrobbles();
    return recentTracks;
  }

  async function getTrackPlaycount(song) {
    const artist = song.artist['#text'];
    const track = trackName = song.name;
    let fullUrl = baseURL + `&method=track.getInfo&artist=${artist}&track=${track}`;
    const res = await fetch(fullUrl);
    const info = await res.json();
    trackPlaycount = info.track.userplaycount;
  }

  async function getArtistPlaycount(song) {
    const artist = artistName = song.artist['#text'];
    let fullUrl = baseURL + `&method=artist.getInfo&artist=${artist}`;
    const res = await fetch(fullUrl);
    const info = await res.json();
    artistPlaycount = info.artist.stats.userplaycount;
  }

  async function getLifetimeScrobbles() {
    let fullUrl = baseURL + '&method=user.getInfo';
    const res = await fetch(fullUrl);
    const info = await res.json();
    userScrobbles = info.user.playcount;
  }

  function getPercentage(trackPlaycount, artistPlaycount) {
    // {({parseInt(trackPlaycount)} / {parseInt(artistPlaycount)}).toFixed(3) * 100}%
    let track = parseFloat(trackPlaycount);
    let artist = parseFloat(artistPlaycount);
    let divided = (track / artist).toFixed(3);
    console.log(track, artist, divided);
    return divided * 100;
  }

  let interval = setInterval(loadLatestSong, 20000);

  loadLatestSong();

</script>
<div class="now-playing-container">
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
  <div class="stat-wrapper">
    <div class="stat-header">
      Stats for {username}
    </div>
    {#if trackPlaycount}
        <div class="user-song-info">
          "{trackName}" {parseInt(trackPlaycount).toLocaleString()} scrobbles
        </div>
    {/if}
    {#if artistPlaycount}
      <div class="user-artist-info">
        <em>{artistName}</em> {parseInt(artistPlaycount).toLocaleString()} scrobbles
      </div>
      <div class="percentage">
        {getPercentage(trackPlaycount, artistPlaycount)}% of {username}'s scrobbles for <em>{artistName}</em> are for '{trackName}'
      </div>
    {/if}
    <hr/>
    <div class="user-playcount">
      Total scrobbles: {parseInt(userScrobbles).toLocaleString()}
    </div>
  </div>
</div>


<style type="text/scss">
.now-playing-container {
  width: 400px;
  max-width: 80%;
  font-feature-settings: 'kern' 1, 'tnum' 1;
}
.stat-wrapper {
  background-color: white;
  border: 1px solid black;
  border-top: 0;
  padding: 10px 20px;
}
.current-song {
  border: 1px solid black;
  padding: 20px;
  background-color: white;  
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
.stat-header {
  font-size: 10px;
  text-align: center;
  margin: 0 0 10px;
}
hr {
  border-style: solid;
  border-width: 1px 0 0 0;
}
.user-song-info, .user-artist-info, .percentage {
  margin: 10px 0;
}
</style>

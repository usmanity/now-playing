const axios = require('axios');

const client_id = "c2e102031b4349268f1b2c650d3ae406";
// const track_name = 'heartbeats the knife';
const playlist = "https://api.spotify.com/v1/playlists/5iF87rwK8Sqe4mbzZRjSog";
const access_token =
  "BQDVT3TSMEkL-jjAM5ZLMUkda_PH43WMiQzV-3Z2HwPWCujUGFWebZ0j5E0tTp-WE0o2ervhMeSRyhIKAicAfPu_9Al78dxMmJezLG4Ux0C73PGoPl_6B_o5O0WZeueW5cslRkeqAw-tdTOzIXohfUH_bVFq5euByp_blGhy26GX_j9OyoT1wG9zf0yWbtbzrQMlsHH9YkNH4dYDsfZb66OjgQ";

const fs  = require('fs');

var file = fs.readFileSync('songs.csv').toString();
var songs = file.split('\n');

songs.forEach((song, i) => {
  var song = song.split(',')
  if (song.length != 3) { return; }
  var track = song[0];
  var artist = song[1];
  track = `${track} ${artist}`;
  // setTimeout(function (song) {
    console.log(track);
    doIt(encodeURI(track));
  // }.bind(this), i * 1000);
});

  function doIt(track_name) {
  axios
    .get(
      `https://api.spotify.com/v1/search?client_id=${client_id}&type=track&q=${track_name}&access_token=${access_token}`
    )
    .then(response => {
      if (!!response.data.tracks.items) {
        return;
      }
      uri = response.data.tracks.items[0].uri;
      console.log(uri);
      postToPlaylist(uri);
    }).catch(err => {
      console.log(err);
    });
  }

function postToPlaylist(uri) {
    var headers = {
      "Content-Type": "application/json",
      'Authorization': access_token
    };
    axios
      .post(
        `https://api.spotify.com/v1/playlists/5iF87rwK8Sqe4mbzZRjSog/tracks?client=${client_id}&access_token=${access_token}`,
        {
          uris: [uri]
        },
        headers
      )
      .then(response => {
        console.log(response);
      })
      .catch(err => {
        console.log(err);
      });
  }

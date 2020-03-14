const axios = require('axios');
const fs = require('fs');
const sleep = require('system-sleep');

const apiBase = 'https://ws.audioscrobbler.com/2.0/'; // ?method=user.getrecenttracks&user=usman6&api_key=0e08aae0a272d5930546b07a17fe329d&format=json&limit=200'
const filename = 'songs.csv';
const user = 'usman6';
var totalPages = 2;
var currentPage = 20;

function getLastfmResults(page) {
  currentPage = page + 1;
  axios.get(
    `${apiBase}?method=user.getrecenttracks&user=${user}&api_key=0e08aae0a272d5930546b07a17fe329d&format=json&limit=200&page=${currentPage}`
  ).then((response) => {
    getPageNumber(response.data);
    processSongs(response.data);
    // setTotalPages(response.data);
  }).catch(error => {
    // console.log(error);
  });
}

function getPageNumber(data) {
  console.log(`page number:`);
  console.log(data.recenttracks['@attr'].page);
}

// function setTotalPages(data) {
//   if (totalPages == 1) {
//     totalPages = parseInt(data.recenttracks["@attr"].totalPages);
//     console.log('setting total pages to')
//     console.log(totalPages)
//     // totalPages = parseInt(data.recenttracks["@attr"].totalPages);
//   }
// }

function processSongs(data) {
  var tracks = data.recenttracks.track;
  tracks.forEach((track) => {
    if (getDate(track)) { // this check helps tell me if it's now playing or not
      console.log(`${getTitle(track)}, ${getArtist(track)}, ${getDate(track)}`);
      appendToFile(
        `${getTitle(track)},${getArtist(track)},${getDate(track)}\n`
      );
    }
  });
}

function getArtist(track) {
  return track.artist['#text'];
}

function getTitle(track) {
  return track.name;
}

function getDate(track) {
  if (track.date) {
    return track.date.uts;
  }
}

function setupFile() {
  const header = 'song,artist,date\n';
  fs.writeFile(filename, header, function (error) {
    if (error) {
      console.log(error);
    }
    console.log('Headers written to CSV');
  });
}

function appendToFile(text) {
  fs.appendFile(filename, text, (err) => { console.log(err) });
}

// getLastfmResults();
setupFile();
do {
  getLastfmResults(currentPage);
  console.log(`total pages: ${totalPages}`);
  console.log(`currentPage: ${currentPage}`);
  sleep(1000);
} while (currentPage < 300)


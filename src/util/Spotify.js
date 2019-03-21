let accessToken = '';
const clientID = 'b12dba214f644858bb68ae6172591c08';
const redirectURI = 'http://localhost:3000/';

const Spotify = {
  getAccessToken() {
    if(accessToken) {
      return accessToken;
    }
    else if(window.location.href.match(/access_token=([^&]*)/) && window.location.href.match(/expires_in=([^&]*)/)) {
      accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
      const expiresIn = window.location.href.match(/expires_in=([^&]*)/)[1];
      window.setTimeout(() => accessToken = '', expiresIn*1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      let url = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
      window.location = url;
    }
  },

  search(term) {
    const token = this.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(response => {
      if(response.ok) {
        return response.json();
      }
      throw new Error('Request failed.');
    }, networkError => console.log(networkError.message)).then(jsonResponse => {
      if(jsonResponse.tracks) {
        const tracks = jsonResponse.tracks.items.map(track => {
          return ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          });
        });
        return tracks;
      } else {
        return [];
      }
    });
  },

  savePlaylist(playlistName, trackURIs) {
    if(playlistName && trackURIs) {
      const token = this.getAccessToken();
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      let userID;
      let playlistID;

      fetch(`https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/me`, {headers: headers}).then(response => {
        if(response.ok) {
          return response.json();
        }
        throw new Error('User not found.');
      }, networkError => console.log(networkError.message)).then(jsonResponse => {
        userID = jsonResponse.id;
        fetch(`https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/users/${userID}/playlists`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({name: playlistName})
        }).then(response => {
          if(response.ok) {
            return response.json();
          }
          throw new Error('Could not create playlist.');
        }, networkError => console.log(networkError.message)).then(jsonResponse => {
          playlistID = jsonResponse.id;
          fetch(`https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({uris: trackURIs})
          }
          ).then(response => {
            if(response.ok){
              console.log('Playlist saved.');
            }
            throw new Error('Could not save playlist.');
          }, networkError => console.log(networkError.message));
        });
      });
    } else {
      return;
    }
  }
};



export default Spotify;

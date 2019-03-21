import React from 'react';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify.js';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: []
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    const isNew = this.state.playlistTracks.every(playlistTrack =>
      playlistTrack.id !== track.id);

    if(isNew) {
      const playlistTracks = this.state.playlistTracks;
      playlistTracks.push(track);
      this.setState({playlistTracks: playlistTracks});
    }
  }

  removeTrack(track) {
    const playlistTracks = this.state.playlistTracks;
    const trackIndex = playlistTracks.findIndex(playlistTrack => playlistTrack.id === track.id);
    playlistTracks.splice(trackIndex, 1);
    this.setState({playlistTracks: playlistTracks});
  }

  updatePlaylistName(newName) {
    this.setState({playlistName: newName});
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(playlistTrack => playlistTrack.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.setState({playlistName: 'New Playlist', playlistTracks: []});
  }

  search(term) {
    Spotify.search(term).then(tracks => {
      this.setState({searchResults: tracks});
    });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          { /* Add a SearchBar component*/}
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            {/*  Add a SearchResults component*/}
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            {/*  Add a Playlist component*/}
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks}
            onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;

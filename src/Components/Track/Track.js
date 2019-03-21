import React from 'react';
import './Track.css';

class Track extends React.Component {
  constructor(props) {
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
  }

  renderAction(isRemoval) {
    return isRemoval ? <a onClick={this.removeTrack}>-</a> : <a onClick={this.addTrack}>+</a>;
  }

  addTrack() {
    this.props.onAdd(this.props.track);
  }

  removeTrack() {
    this.props.onRemove(this.props.track);
  }

  render() {
    return (
      <div className="Track">
        <div className="Track-information">
          {/* track name will go here*/}
          <h3>{this.props.track.name}</h3>
          {/* track artist will go here |  track album will go here */}
          <p>{this.props.track.artist} | {this.props.track.album}</p>
        </div>
        <a className="Track-action">{/* + or - will go here */}{this.renderAction(this.props.isRemoval)}</a>
      </div>
    );
  }
}

export default Track;

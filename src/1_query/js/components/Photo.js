import React from 'react';
import Relay from 'react-relay';

class Photo extends React.Component {
  render() {
    return (
      <div>
        <img height='200' width='200' alt={"Photo of " + this.props.thing.name}  src={this.props.thing.imageUrl}/>
      </div>
    );
  }
}

export default Relay.createContainer(Photo, {
  fragments: {
    thing: () => Relay.QL`
      fragment on Thing {
        name
        imageUrl
      }
    `
  }
});

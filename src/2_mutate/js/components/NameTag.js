import React from 'react';
import Relay from 'react-relay';

class NameTag extends React.Component {
  render() {
    return (
      <div>
        <h3>The Viewer's Full Name is: {this.props.viewer.fullName}</h3>
      </div>
    );
  }
}

export default Relay.createContainer(NameTag, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        fullName
      }
    `
  }
});

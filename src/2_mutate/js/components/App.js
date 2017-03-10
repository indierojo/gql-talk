import React from 'react';
import Relay from 'react-relay';

import NameTag from './NameTag';
import NameChanger from './NameChanger';

class App extends React.Component {
  render() {
    return (
      <div>
        <NameTag viewer={this.props.viewer}/>
        <NameChanger viewer={this.props.viewer}/>
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        ${NameTag.getFragment('viewer')}
        ${NameChanger.getFragment('viewer')}
      }
    `
  }
});

import React from 'react';
import Relay from 'react-relay';

import Greeting from './Greeting';
import Photo from './Photo';

class App extends React.Component {
  _nextThing = () => {
    var count = this.props.relay.variables.thingCount;
    // update params
    this.props.relay.setVariables({
      thingCount: count + 1
    });
  };

  render() {
    return (
      <div>
          {this.props.viewer.things.edges.map(edge =>
            <div key={edge.node.id}>
              <Greeting thing={edge.node}/>
              <Photo thing={edge.node}/>
            </div>
          )}
        <button onClick={this._nextThing}>Next</button>
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  initialVariables: {
    thingCount: 1
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        things(first: $thingCount) {
          edges {
            node {
              id,
              ${Greeting.getFragment('thing')}
              ${Photo.getFragment('thing')}
            }
          }
        }
      }
    `
  }
});

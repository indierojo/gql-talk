import React from 'react';
import Relay from 'react-relay';

class Greeting extends React.Component {
  render() {
    return (
      <div>
        <h3>{this.props.thing.salutation} {this.props.thing.name}</h3>
      </div>
    );
  }
}

export default Relay.createContainer(Greeting, {
  fragments: {
    thing: () => Relay.QL`
      fragment on Thing {
        name
        salutation
      }
    `
  }
});

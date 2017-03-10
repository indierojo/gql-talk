import React from 'react';
import Relay from 'react-relay';

import SetFirstNameMutation from '../mutations/SetFirstNameMutation';
import SetLastNameMutation from '../mutations/SetLastNameMutation';

class NameChanger extends React.Component {
  _onFirstNameChange = (e) => {
    const newFirstName = e.target.value;
    
    Relay.Store.commitUpdate(
      new SetFirstNameMutation({
        newFirstName,
        viewer: this.props.viewer
      }), {
        onSuccess: () => console.log(`FirstName Change Mutation was successful`),
        onFailure: () => console.log(`FirstName Change Mutation Failed`)
      }
    );
  };
  _onLastNameChange = (e) => {
    const newLastName = e.target.value;
    
    Relay.Store.commitUpdate(
      new SetLastNameMutation({
        newLastName,
        viewer: this.props.viewer
      }), {
        onSuccess: () => console.log(`LastName Change Mutation was successful`),
        onFailure: () => console.log(`LastName Change Mutation Failed`)
      }
    );
  };

  render() {
    return (
      <div>
        <div>
          First:
          <input
            defaultValue={this.props.viewer.firstName}
            onChange={this._onFirstNameChange}
          />
        </div>
        <div>
          Last:
          <input
            defaultValue={this.props.viewer.lastName}
            onChange={this._onLastNameChange}
          />
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(NameChanger, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        id
        firstName
        lastName
      }
    `
  }
});

/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only.  Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import Relay from 'react-relay';

export default class SetNameMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation{setFirstName}`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on SetFirstNameMutationPayload {
        viewer {
          firstName
          fullName
        }
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        viewer: this.props.viewer.id
      }
    }];
  }
  getVariables() {
    return {
      newFirstName: this.props.newFirstName
    };
  }
  getOptimisticResponse() {
    
    const viewerPayload = {id: this.props.viewer.id, name: this.props.newFirstName};
    return {
      viewer: viewerPayload
    };
  }
}
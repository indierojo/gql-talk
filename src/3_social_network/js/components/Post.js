import React from 'react';
import Relay from 'react-relay';

import FlatButton from 'material-ui/FlatButton/FlatButton';
import Card from 'material-ui/Card/Card';
import CardText from 'material-ui/Card/CardTitle';
import CardActions from 'material-ui/Card/CardActions';
import CardHeader from 'material-ui/Card/CardHeader';
import ActionThumbsUp from 'material-ui/svg-icons/action/thumb-up';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ActionComment from 'material-ui/svg-icons/communication/comment';

import ToggleUserLikesMutation from '../mutations/ToggleUserLikesMutation';

class Post extends React.Component {
  static propTypes = {
    viewerId: React.PropTypes.string,
    post: React.PropTypes.shape({
      dateAdded: React.PropTypes.string,
      body: React.PropTypes.string,
      likeCount: React.PropTypes.number,
      userHasLiked: React.PropTypes.boolean,
      userCanDelete: React.PropTypes.boolean,
      comments: React.PropTypes.array
    })
  };

  _toggleUserLikes = (userLikes) => {
    Relay.Store.commitUpdate(
      new ToggleUserLikesMutation({
        userLikes: !userLikes,
        postId: this.props.post.id
      }), {
        onSuccess: () => console.log(`Toggle Like Mutation was successful`),
        onFailure: () => console.log(`Toggle Like Mutation Failed`)
      }
    );
  };

  render() {
    return (
      <Card>
        <CardHeader
          title={this.props.post.title}
          subtitle={this.props.post.dateAdded}
          actAsExpander={false}
          showExpandableButton={false}
        />
        <CardText>
          {this.props.post.body}
        </CardText>
        <CardActions>
          <FlatButton
            label={this.props.post.likeCount ? "Like (" + this.props.post.likeCount + ")" : "Like"}
            secondary={this.props.post.userHasLiked}
            icon={<ActionThumbsUp />}
            onClick={this._toggleUserLikes.bind(this, this.props.post.userHasLiked)}
          />
          <FlatButton
            label="Comment"
            secondary={false}
            icon={<ActionComment />}
          />
          { this.props.post.userCanDelete ?
            <FlatButton
              display=""
              label="Delete"
              secondary={false}
              icon={<ActionDelete />}
            /> : null
          }

        </CardActions>
      </Card>
    )
  }
}

export default Relay.createContainer(Post, {
  fragments: {
    post: () => Relay.QL`
      fragment on post {
        id
        body
        comments
        dateAdded
        likeCount
        title
        userHasLiked
        userCanDelete
      }
    `
  }
});
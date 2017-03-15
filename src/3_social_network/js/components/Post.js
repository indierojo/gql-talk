import React from 'react'
import Relay from 'react-relay'

import FlatButton from 'material-ui/FlatButton/FlatButton'
import Card from 'material-ui/Card/Card'
import CardText from 'material-ui/Card/CardTitle'
import CardActions from 'material-ui/Card/CardActions'
import CardHeader from 'material-ui/Card/CardHeader'
import ActionThumbsUp from 'material-ui/svg-icons/action/thumb-up'
import ActionDelete from 'material-ui/svg-icons/action/delete'
import ActionComment from 'material-ui/svg-icons/communication/comment'

import ToggleUserLikesMutation from '../mutations/ToggleUserLikesMutation'

class Post extends React.Component {
  constructor () {
    super()
    this.toggleUserLikes = () => {
      Relay.Store.commitUpdate(
        new ToggleUserLikesMutation({
          userLikes: !this.props.post.userHasLiked,
          postId: this.props.post.id
        }), {
          onSuccess: () => console.log(`Toggle Like Mutation was successful`),
          onFailure: () => console.log(`Toggle Like Mutation Failed`)
        }
      )
    }
  }

  render () {
    const { post } = this.props

    return (
      <Card>
        <CardHeader
          title={post.title}
          subtitle={post.dateAdded}
          actAsExpander={false}
          showExpandableButton={false}
        />
        <CardText>
          {this.props.post.body}
        </CardText>
        <CardActions>
          <FlatButton
            label={post.likeCount ? 'Like (' + post.likeCount + ')' : 'Like'}
            secondary={post.userHasLiked}
            icon={<ActionThumbsUp />}
            onClick={this.toggleUserLikes}
          />
          <FlatButton
            label='Comment'
            secondary={false}
            icon={<ActionComment />}
          />
          { post.userCanDelete
            ? <FlatButton
              display=''
              label='Delete'
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
})

Post.propTypes = {
  post: React.PropTypes.shape({
    id: React.PropTypes.string,
    body: React.PropTypes.string,
    comments: React.PropTypes.array,
    dateAdded: React.PropTypes.string,
    likeCount: React.PropTypes.number,
    title: React.PropTypes.string,
    userHasLiked: React.PropTypes.boolean,
    userCanDelete: React.PropTypes.boolean
  })
}

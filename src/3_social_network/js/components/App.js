import React from 'react'
import Relay from 'react-relay'
import injectTapEventPlugin from 'react-tap-event-plugin'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import RaisedButton from 'material-ui/RaisedButton/RaisedButton'
import TextField from 'material-ui/TextField/TextField'

import Post from './Post'
import AddNewPostMutation from '../mutations/AddNewPostMutation'

injectTapEventPlugin()

class App extends React.Component {
  constructor () {
    super()
    this.addNewPost = () => {
      const title = document.getElementById('newPostTitle').value
      const body = document.getElementById('newPostBody').value
      if (!title || !body) return

      Relay.Store.commitUpdate(
        new AddNewPostMutation({
          postTitle: title,
          postBody: body,
          viewer: this.props.viewer
        }), {
          onSuccess: () => console.log(`Add New Post Mutation was successful`),
          onFailure: () => console.log(`Add New Post Mutation Failed`)
        }
      )
    }
  }

  render () {
    return (
      <MuiThemeProvider>
        <div>
          <h1>{this.props.viewer.name}'s Posts</h1>
          {this.props.viewer.posts.edges.map(p => <Post key={p.node.id} viewerId={this.props.viewer.id} post={p.node} />)}
          <h2>New Post:</h2>
          <TextField defaultValue='Title' id='newPostTitle' />
          <br />
          <TextField defaultValue='Body' multiLine id='newPostBody' />
          <RaisedButton label='Post' primary onClick={this.addNewPost} />
        </div>
      </MuiThemeProvider>
    )
  }
}

export default Relay.createContainer(App, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        id,
        name,
        posts(first:50) {
          edges {
            node {
              id
              ${Post.getFragment('post')}
            }
          }
        }
      }
    `
  }
})

App.propTypes = {
  viewer: React.PropTypes.any
}

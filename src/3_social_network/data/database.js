/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

// Model types
class User {}
class Post {}

// Mock data
var viewer = new User()
viewer.id = '1'
viewer.name = 'Jon B'

const posts = [
  {
    id: 1,
    dateAdded: '2016-01-01T7:00AM',
    title: 'React Talk',
    body: 'Lorem Ipsum',
    comments: [],
    userHasLiked: false,
    userCanDelete: true,
    likeCount: 0
  },
  {
    id: 2,
    dateAdded: '2016-01-02T9:00AM',
    title: 'Some Other React Talk',
    body: 'Lorem Ipsum 2',
    comments: ['I like it!'],
    userHasLiked: true,
    likeCount: 2
  }
]
var nextPostId = posts.length + 1

const getPost = id => posts.find(w => w.id === id)

const userLikesPost = (id, doesUserLike) => {
  const post = getPost(id)
  post.likeCount = post.userHasLiked ? post.likeCount - 1 : post.likeCount + 1
  post.userHasLiked = doesUserLike
  return post.id
}

const addNewPost = (postTitle, postText) => {
  const newId = nextPostId
  nextPostId++
  posts.push({
    id: newId,
    dateAdded: new Date() + '',
    title: postTitle,
    body: postText,
    comments: [],
    userHasLiked: false,
    userCanDelete: true,
    likeCount: 0
  })
  return newId
}

const deletePost = postId => {
  const postIndex = posts.indexOf(getPost(postId))
  posts.splice(postIndex, 1)
  return postId
}

module.exports = {
  // Export methods that your schema can use to interact with your database
  getUser: (id) => id === viewer.id ? viewer : null,
  getViewer: () => viewer,
  getPost,
  getPosts: () => posts,
  userLikesPost,
  addNewPost,
  deletePost,
  User,
  Post
}

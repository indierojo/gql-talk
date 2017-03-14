/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLList,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
  GraphQLID
} from 'graphql'

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  nodeDefinitions,
  mutationWithClientMutationId,
  cursorForObjectInConnection
} from 'graphql-relay'

import {
  // Import methods that your schema can use to interact with your database
  User,
  Post,
  getUser,
  getViewer,
  getPost,
  getPosts,
  userLikesPost,
  addNewPost,
  deletePost
} from './database'

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
let {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    let {type, id} = fromGlobalId(globalId)
    if (type === 'User') {
      return getUser(id)
    } else if (type === 'Post') {
      return getPost(id)
    } else {
      return null
    }
  },
  (obj) => {
    if (obj instanceof User) {
      return userType
    } else if (obj instanceof Post) {
      return postType
    } else {
      return null
    }
  }
)

/**
 * Define your own types here
 */

const userType = new GraphQLObjectType({
  name: 'User',
  description: 'A person who uses our app',
  fields: () => ({
    id: globalIdField('User'),
    name: {
      type: GraphQLString,
      description: 'The username'
    },
    posts: {
      type: postConnection,
      description: 'A user\'s posts',
      args: connectionArgs,
      resolve: (_, args) => connectionFromArray(getPosts(), args)
    }
  }),
  interfaces: [nodeInterface]
})

const postType = new GraphQLObjectType({
  name: 'post',
  description: 'A social media post',
  fields: () => ({
    id: globalIdField('Post'),
    dateAdded: {
      type: GraphQLString,
      description: 'The date the post was posted'
    },
    title: {
      type: GraphQLString,
      description: 'The title of the post'
    },
    body: {
      type: GraphQLString,
      description: 'The body of the post'
    },
    comments: {
      type: new GraphQLList(GraphQLString),
      description: 'All the comments on the post'
    },
    userHasLiked: {
      type: GraphQLBoolean,
      description: 'Has the current user liked the post'
    },
    userCanDelete: {
      type: GraphQLBoolean,
      description: 'The user has permissions to delete the post'
    },
    likeCount: {
      type: GraphQLInt,
      description: 'The number of likes on the post'
    }
  }),
  interfaces: [nodeInterface]
})

/**
 * Define your own connection types here
 */
const {connectionType: postConnection, edgeType: postEdge} =
  connectionDefinitions({name: 'Post', nodeType: postType})

/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    // Add your own root fields here
    viewer: {
      type: userType,
      resolve: () => getViewer()
    }
  })
})

const toggleUserLikes = mutationWithClientMutationId({
  name: 'ToggleUserLikes',
  inputFields: {
    postId: { type: new GraphQLNonNull(GraphQLID) },
    userLikes: { type: new GraphQLNonNull(GraphQLBoolean) }
  },
  mutateAndGetPayload: ({ postId, userLikes }) => {
    const updatedPostId = userLikesPost(fromGlobalId(postId).id, userLikes)
    return {id: updatedPostId}
  },
  outputFields: {
    post: {
      type: postType,
      resolve: ({id}) => getPost(id)
    }
  }
})

const addNewPostMutation = mutationWithClientMutationId({
  name: 'AddNewPost',
  inputFields: {
    postTitle: { type: new GraphQLNonNull(GraphQLString) },
    postBody: { type: new GraphQLNonNull(GraphQLString) }
  },
  mutateAndGetPayload: ({ postTitle, postBody }) => {
    const newPostId = addNewPost(postTitle, postBody)
    return { id: newPostId }
  },
  outputFields: {
    postsEdge: {
      type: postEdge,
      resolve: ({id}) => {
        const post = getPost(id)
        return {
          cursor: cursorForObjectInConnection(getPosts(), post),
          node: post
        }
      }
    },
    viewer: {
      type: userType,
      resolve: () => getViewer()
    }
  }
})

const deletePostMutation = mutationWithClientMutationId({
  name: 'DeletePost',
  inputFields: {
    postId: { type: new GraphQLNonNull(GraphQLID) }
  },
  mutateAndGetPayload: ({ postId }) => {
    const removedPostId = deletePost(fromGlobalId(postId).id)
    return { removedPostId }
  },
  outputFields: {
    removedPostId: {
      type: GraphQLID,
      resolve: ({removedPostId}) => removedPostId
    },
    postsEdge: {
      type: postEdge,
      resolve: ({removedPostId}) => {
        const post = getPost(removedPostId)
        return {
          cursor: cursorForObjectInConnection(getPosts(), post),
          node: post
        }
      }
    },
    viewer: {
      type: userType,
      resolve: () => getViewer()
    }
  }
})

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    toggleUserLikes: toggleUserLikes,
    addNewPost: addNewPostMutation,
    deletePost: deletePostMutation
  })
})

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export const Schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
})

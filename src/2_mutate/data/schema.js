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
  GraphQLNonNull,
  GraphQLString
} from 'graphql';

import {
  fromGlobalId,
  globalIdField,
  nodeDefinitions,
  mutationWithClientMutationId
} from 'graphql-relay';

import {
  // Import methods that your schema can use to interact with your database
  User,
  getUser,
  getViewer,
  setViewerFirstName,
  setViewerLastName
} from './database';

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    if (type === 'User') {
      return getUser(id);
    } else {
      return null;
    }
  },
  (obj) => {
    if (obj instanceof User) {
      return userType;
    } else {
      return null;
    }
  }
);

/**
 * Define your own types here
 */

var userType = new GraphQLObjectType({
  name: 'User',
  description: 'A person who uses our app',
  fields: () => ({
    id: globalIdField('User'),
    firstName: {
      type: GraphQLString,
      description: 'The User\'s first name'
    },
    lastName: {
      type: GraphQLString,
      description: 'The User\'s last name'
    },
    fullName: {
      type: GraphQLString,
      description: 'The User\'s full name'
    }
  }),
  interfaces: [nodeInterface]
});

/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    // Add your own root fields here
    viewer: {
      type: userType,
      resolve: () => getViewer()
    }
  })
});

const setFirstNameMutation = mutationWithClientMutationId({
  name: 'SetFirstNameMutation',
  inputFields: {
    newFirstName: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  mutateAndGetPayload: ({ newFirstName }) => {
    return setViewerFirstName(newFirstName);
  },
  outputFields: {
    viewer: {
      type: userType,
      resolve: ({id}) => getUser(id)
    }
  }
});

const setLastNameMutation = mutationWithClientMutationId({
  name: 'SetLastNameMutation',
  inputFields: {
    newLastName: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  mutateAndGetPayload: ({ newLastName }) => {
    return setViewerLastName(newLastName);
  },
  outputFields: {
    viewer: {
      type: userType,
      resolve: ({id}) => getUser(id)
    }
  }
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    setFirstName: setFirstNameMutation,
    setLastName: setLastNameMutation
  })
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export var Schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});

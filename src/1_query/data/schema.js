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
  GraphQLString
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  nodeDefinitions
} from 'graphql-relay';

import {
  // Import methods that your schema can use to interact with your database
  User,
  Thing,
  getUser,
  getViewer,
  getThing,
  getThings
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
    } else if (type === 'Thing') {
      return getThing(id);
    } else {
      return null;
    }
  },
  (obj) => {
    if (obj instanceof User) {
      return userType;
    } else if (obj instanceof Thing)  {
      return thingType;
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
    things: {
      type: thingConnection,
      description: 'A person\'s collection of things',
      args: connectionArgs,
      resolve: (_, args) => connectionFromArray(getThings(), args),
    }
  }),
  interfaces: [nodeInterface],
});

var thingType = new GraphQLObjectType({
  name: 'Thing',
  description: 'A thing to greet',
  fields: () => ({
    id: globalIdField('Thing'),
    name: {
      type: GraphQLString,
      description: 'The name of the thing'
    },
    salutation: {
      type: GraphQLString,
      description: 'The preferred salutation of the thing'
    },
    imageUrl: {
      type: GraphQLString,
      description: 'The user\'s profile photo'
    }
  }),
  interfaces: [nodeInterface]
});

/**
 * Define your own connection types here
 */
var {connectionType: thingConnection} =
  connectionDefinitions({name: 'Thing', nodeType: thingType});

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

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    // Add your own mutations here
  })
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export var Schema = new GraphQLSchema({
  query: queryType
  // Uncomment the following after adding some mutation fields:
  // mutation: mutationType
});

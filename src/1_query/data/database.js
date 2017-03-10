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
class Thing {}

// Mock data
var viewer = new User();
viewer.id = '1';
viewer.name = 'Anonymous';
var things = [
  {id: 0, name: 'World', salutation: 'Hello', imageUrl: '/img/world.jpg'},
  {id: 1, name: 'Pardner', salutation: 'Howdy', imageUrl: '/img/howdy.jpg'},
  {id: 2, name: 'Dude', salutation: 'Sup', imageUrl: '/img/no_photo.jpg'},
  {id: 3, name: 'Matey', salutation: 'Ahoy There', imageUrl: '/img/no_photo.jpg'},
  {id: 4, name: 'Gubna', salutation: 'Allo', imageUrl: '/img/no_photo.jpg'},
  {id: 5, name: 'Dude', salutation: 'Hey', imageUrl: '/img/no_photo.jpg'}
];

module.exports = {
  // Export methods that your schema can use to interact with your database
  getUser: (id) => id === viewer.id ? viewer : null,
  getViewer: () => viewer,
  getThing: (id) => things.find(w => w.id === id),
  getThings: () => things,
  User,
  Thing
};

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

// Mock data
var viewer = new User();
viewer.id = '1';
viewer.firstName = 'Joe';
viewer.lastName = 'Schmoe';
viewer.fullName = viewer.firstName + ' ' + viewer.lastName;

const setViewerFirstName = (newFirstName) => {
  viewer.firstName = newFirstName;
  viewer.fullName = newFirstName + ' ' + viewer.lastName;
  return viewer;
};
const setViewerLastName = (newLastName) => {
  viewer.lastName = newLastName;
  viewer.fullName = viewer.firstName + ' ' + newLastName;
  return viewer;
};

module.exports = {
  // Export methods that your schema can use to interact with your database
  getUser: (id) => id === viewer.id ? viewer : null,
  getViewer: () => viewer,
  setViewerFirstName,
  setViewerLastName,
  User
};

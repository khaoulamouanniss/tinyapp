const { assert } = require('chai');
const {addUser, isEmailExist, userByEmail, urlsForUser} = require('../helpers.js');

//the database test
const testURLs = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userID: "userRandomID"},
  "9sm5xK": {longURL: "http://www.google.com", userID: "user2RandomID"}
};

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

//test for the function addUser
describe('addUser', function() {
  it('should add a user to the database', function() {
    addUser(testUsers, "23iu56", "lolla@example.com", "1234");
    const expectedOutput = {
      "userRandomID": {
        id: "userRandomID",
        email: "user@example.com",
        password: "purple-monkey-dinosaur"
      },
      "user2RandomID": {
        id: "user2RandomID",
        email: "user2@example.com",
        password: "dishwasher-funk"
      },
      "23iu56": {
        id: "23iu56",
        email: "lolla@example.com",
        password: "1234"
      }
    };
    assert.deepEqual(testUsers, expectedOutput);
  });
});

//test for the function isEmailExist
describe('isEmailExist', function() {
  it('should return true with valid email', function() {
    const user = isEmailExist(testUsers, "user@example.com");
    const expectedOutput = true;
    assert.equal(user, expectedOutput);
  });
  it('should return false with non valid email', function() {
    const user = isEmailExist(testUsers, "un@example.com");
    const expectedOutput = false;
    assert.equal(user, expectedOutput);
  });
});

//test of the function userByEmail
describe('userByEmail', function() {
  it('should return a user with valid email', function() {
    const user = userByEmail(testUsers, "user@example.com");
    const expectedOutput = {id: "userRandomID", email: "user@example.com", password: "purple-monkey-dinosaur"};
    assert.deepEqual(user, expectedOutput);
  });
  it('should return undefined with non valid email', function() {
    const user = userByEmail(testUsers, "un@example.com");
    const expectedOutput = undefined;
    assert.equal(user, expectedOutput);
  });
});

//test of the function urlsForUser
describe('urlsForUser', function() {
  it('should return a list of URLs of a user', function() {
    const urls = urlsForUser(testURLs, "userRandomID");
    const expectedOutput = ["b2xVn2"];
    assert.deepEqual(urls, expectedOutput);
  });
  it('should return []  of  a non valid user', function() {
    const urls = urlsForUser(testURLs, "userunknownID");
    const expectedOutput = [];
    assert.deepEqual(urls, expectedOutput);
  });
});


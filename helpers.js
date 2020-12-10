//function that generate a random alphanumeric key of 6 char
const generateRandomString = function() {
  return Math.random().toString(36).substr(2, 6);
};

//function to add a new user
const addUser = function(obj, id, email, password) {
  obj[id] = {"id": id, 'email': email, 'password': password};
};

//function to check if an email already exists in users
const isEmailExist = function(obj, email) {
  const keys = Object.keys(obj);
  for (let k of keys) {
    if (obj[k]['email'] === email) {
      return true;
    }
  }
  return false;
};

//function that returns the object user his email
const userByEmail = function(obj, email) {
  const keys = Object.keys(obj);
  for (let k of keys) {
    if (obj[k]['email'] === email) {
      return obj[k];
    }
  }
};

//function that returns the URLs of a user by his id
const urlsForUser = function(urlObj, id) {
  const res = [];
  for (let url in urlObj) {
    if (urlObj[url]['userID'] === id) {
      res.push(url);
    }
  }
  return res;
};

module.exports = {generateRandomString, addUser, isEmailExist, userByEmail, urlsForUser};

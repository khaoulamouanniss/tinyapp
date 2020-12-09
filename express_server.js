const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
var cookies = require('cookie-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookies());
app.set("view engine", "ejs");
const generateRandomString = function() {
  return Math.random().toString(36).substr(2, 6);
};
const urlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userID: "398re4"},
  "9sm5xK": {longURL: "http://www.google.com", userID: "4ur456"}
};
const users = {
  "398re4": {
    id: "398re4",
    email: "user@example.com",
    password: "123"
  },
 "4ur456": {
    id: "4ur456",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

//function to add a new user
const addUser = function (obj, id, email, password){
  obj[id] = {"id": id, 'email': email, 'password': password};
};

//function to check if an email already exists in users
const isEmailExist = function(obj, email){
  const keys = Object.keys(obj);
  for (let k of keys){
    if (obj[k]['email'] === email){
      return true;
    }
  }
  return false;
};

//function that returns the id of user knowing his email
const idByEmail = function(obj, email){
  const keys = Object.keys(obj);
  for (let k of keys){
    if (obj[k]['email'] === email){
      return k;
    }
  }
  return null;
};
app.get("/", (req, res) => {
  res.send("Hello!");
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
//showing all the urls
app.get("/urls", (req, res) => {
 const templateVars = {user: users[req.cookies['userID']], urls: urlDatabase };
 res.render("urls_index", templateVars);
});
//show the page for creating new url
app.get("/urls/new", (req, res) => {
  if(!req.cookies['userID']) {
    res.redirect("/login")
  } else {
  const templateVars = { user: users[req.cookies['userID']]};
  res.render("urls_new",templateVars);
  }
});
//show a specific url
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { user: users[req.cookies['userID']], shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]['longURL'] };
  res.render("urls_show", templateVars);
});
//show the registration form
app.get("/register", (req, res) => {
  const templateVars = { user: users[req.cookies['userID']]};
  res.render("urls_register", templateVars);
});
//show the login page
app.get("/login", (req, res) => {
  const templateVars = { user: users[req.cookies['userID']]};
  res.render("urls_login", templateVars);
});
//create new url
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect('/urls');
});
//access to a url from its key
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  if (!Object.prototype.hasOwnProperty.call(urlDatabase,shortURL)) {
    res.status(404);
    res.send("404 NOT FOUND");
  } else {
    const longURL = urlDatabase[shortURL]['longURL'];
    res.redirect(longURL);
  }
});
//delete a url
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect('/urls/');
});
//update a url
app.post("/urls/:shortURL/Update", (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect('/urls/');
});
//login by an email
app.post("/login", (req, res) => {
  let user = null;
  let id = idByEmail(users, req.body.email);
  if(!isEmailExist(users,req.body.email) || users[id].password !== req.body.password) {
    res.status(403);
    res.send("<h2> Email Doesn't exist or wrong password</h2>");
  } else if (users[id].email === req.body.email && users[id].password === req.body.password) {
          user = users[id];
          res.cookie('userID', user.id);
          res.redirect('/urls');
  }
});
//logout by clearing the cookies
app.post("/logout", (req, res) => {
  res.clearCookie('userID');
  res.redirect('/urls');
});
app.post("/register", (req, res) => {
  const id = "user" + generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  if(email === "" || password === "" || isEmailExist(users, email)){
    res.status(404);
    res.send("404 NOT FOUND");
  } else {
  addUser(users, id, email, password);
  res.cookie('userID', id);
  res.redirect('/urls');
  }
  console.log(users);
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

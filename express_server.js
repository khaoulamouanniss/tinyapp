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
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
const users = {
  "user398re4": {
    id: "user398re4",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user4ur456": {
    id: "user4ur456",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

//function to add a new user
const addUser = function (obj, id, email, password){
  obj[id] = {"id": id, 'email': email, 'password': password};
}

//function to check if an email already exists in users
const isEmailExist = function(obj, email){
  const keys = Object.keys(obj);
  for (let k of keys){
    if (obj[k]['email'] === email){
      return true;
    }
  }
  return false;
}
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
  const templateVars = { user: users[req.cookies['userID']]};
  res.render("urls_new",templateVars);
});
//show a specific url
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { user: users[req.cookies['userID']], shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});
//show the registration form
app.get("/register", (req, res) => {
  const templateVars = { user: users[req.cookies['userID']]};
  res.render("urls_register", templateVars);
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
    const longURL = urlDatabase[shortURL];
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
//login bu a username
app.post("/login", (req, res) => {
  let user = null;
  for (let id in users) {
      if (users[id].email === req.body.email && users[id].password === req.body.password) {
          user = users[id];
      }
  }
  /*if (user) {
    res.cookie('userID', user.id);
    //req.session.user_id = user.id;
    res.redirect('/urls');
}*/if (!user) {
    res.send(' <h2>LOGIN FAIL :( </h2>');
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

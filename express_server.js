const {generateRandomString, addUser, isEmailExist, userByEmail, urlsForUser} = require("./helpers.js");
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1']
}));
app.set("view engine", "ejs");

// Our URLs database
const urlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userID: "398re4"},
  "9sm5xK": {longURL: "http://www.google.com", userID: "4ur456"}
};

// Our users database
const users = {
  "398re4": {
    id: "398re4",
    email: "user@example.com",
    password: bcrypt.hashSync("123", 10)
  },
  "4ur456": {
    id: "4ur456",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10)
  }
};



app.get("/", (req, res) => {
  const templateVars = {user: users[req.session.userID]};
  res.render("index", templateVars);
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//showing all the urls
app.get("/urls", (req, res) => {
  const templateVars = {user: users[req.session.userID], urls: urlDatabase };
  res.render("urls_index", templateVars);
});

//show the page for creating new url
app.get("/urls/new", (req, res) => {
  if (!req.session.userID) {
    res.redirect("/login");
  } else {
    const templateVars = { user: users[req.session.userID]};
    res.render("urls_new",templateVars);
  }
});

//show a specific url
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { user: users[req.session.userID], shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]['longURL'], userID:  urlDatabase[req.params.shortURL]['userID']  };
  res.render("urls_show", templateVars);
});

//show the registration form
app.get("/register", (req, res) => {
  const templateVars = { user: users[req.session.userID]};
  res.render("urls_register", templateVars);
});

//show the login page
app.get("/login", (req, res) => {
  const templateVars = { user: users[req.session.userID]};
  res.render("urls_login", templateVars);
});

//create new url
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  let longURL = req.body.longURL;
  urlDatabase[shortURL] = {'longURL': longURL, 'userID': req.session.userID};
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
  const id = req.session.userID;
  const shortURL = req.params.shortURL;
  const URLs = urlsForUser(urlDatabase, id);
  if (URLs.includes(shortURL)) {
    delete urlDatabase[shortURL];
    res.redirect('/urls/');
  } else {
    res.status(403);
    res.send('<h2>You don\'t have the right to delete this URL<h2>');
  }
});

//update a url
app.post("/urls/:shortURL/Update", (req, res) => {
  const id = req.session.userID;
  const shortURL = req.params.shortURL;
  const URLs = urlsForUser(urlDatabase, id);
  if (URLs.includes(shortURL)) {
    urlDatabase[shortURL] = {longURL: req.body.longURL, userID: id};
    res.redirect('/urls/');
  } else {
    res.status(403);
    res.send('<h2>You don\'t have the right to update this URL<h2>');
  }
});

//login by an email
app.post("/login", (req, res) => {
  const password = req.body.password;

  let user = userByEmail(users, req.body.email);
  if (!isEmailExist(users,req.body.email) || !bcrypt.compare(user.password, password)) {
    res.status(403);
    res.send("<h2> Email Doesn't exist or wrong password</h2>");
  } else if (user.email === req.body.email && bcrypt.compare(user.password, password)) {
    req.session.userID = user.id;
    res.redirect('/urls');
  }
});

//logout by clearing the cookies
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

//register a new user
app.post("/register", (req, res) => {
  const id = generateRandomString();
  const email = req.body.email;
  const password = bcrypt.hashSync(req.body.password, 10);

  if (email === "" || password === "" || isEmailExist(users, email)) {
    res.status(404);
    res.send("404 NOT FOUND");
  } else {
    addUser(users, id, email, password);
    req.session.userID = id;
    res.redirect('/urls');
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

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
 const templateVars = { username: req.cookies["name"], urls: urlDatabase };
 res.render("urls_index", templateVars);
});
//show the page for creating new url
app.get("/urls/new", (req, res) => {
  const templateVars = { username: req.cookies["name"]};
  res.render("urls_new",templateVars);
});
//show a specific url
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { username: req.cookies["name"], shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});
//create new url
app.post("/urls/", (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect('/url');
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
  const username = req.body.username;
  res.cookie('name', username);
  res.redirect('/urls');
});
//logout by clearing the cookies
app.post("/logout", (req, res) => {
  res.clearCookie('name');
  res.redirect('/urls');
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


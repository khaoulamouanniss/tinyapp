const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
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
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});
app.post("/urls/", (req, res) => {
  let shortURL = generateRandomString();
  console.log(req.body);  // Log the POST request body to the console
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(urlDatabase[shortURL]);
  //res.send("Ok");         // Respond with 'Ok' (we will replace this)

});
app.get("/u/:shortURL", (req, res) => {
  console.log(req.params);
  console.log(req.body);
  const shortURL = req.params.shortURL;
  if (!Object.prototype.hasOwnProperty.call(urlDatabase,shortURL)) {
    res.status(404);
    res.send("404 NOT FOUND");
  } else {
    const longURL = urlDatabase[shortURL];
    res.redirect(longURL);
  }
});
app.post("/urls/:shortURL/delete", (req, res) => {
  //console.log(req.body);  // Log the POST request body to the console
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect('/urls/');

});
app.post("/urls/:shortURL/Update", (req, res) => {
  console.log(req.params);
  console.log(req.body);
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect('/urls/');
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


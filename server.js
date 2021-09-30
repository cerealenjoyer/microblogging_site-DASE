const express = require('express');

const posts = require('./posts');

const server = express();

const functions = require('./routes/functions');

// let html = '';
let idArr = [];
let id = 0;

server.get('/', (request, response) => {
  let items = '';
  // eslint-disable-next-line no-restricted-syntax
  for (const post of Object.values(posts)) {
    items += `<li>
              <div class="center box">
                <span>${post.name} : ${post.post}</span>
                <form action="/delete-post" method="POST" style="display: inline;">
                  <button name="name" class="delete" value="${post.name}" aria-label="Delete ${post.name}">
                    &times;
                  </button>
                </form>
                </div>
              </li>`;
    console.log(post);
  }
  const html = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Shortlr</title>
      </head>
      <body>
        <h1>Posts!</h1>
        <ul>${items}</ul>
        <a href="/add-post">Add your post +</a>
        </form>
      </body>
    </html>
    `;
  response.send(html);
});

server.get('/add-post', (request, response) => {
  const html = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Shortlr</title>
        </head>
        <body>
          <h1>Add your post</h1>
          <form method="POST">
            <label for="name">Your name</label>
            <input id="name" name="name">
            <label for="post">Your post</label>
            <input id="post" name="post">
            <button>Add</button>
          </form>
        </body>
      </html>
      `;
  response.send(html);
});

server.get('/add-post/error', functions.error);

const bodyParser = express.urlencoded({ extended: false });

server.post('/add-post', bodyParser, (request, response) => {
  const newPost = request.body;
  if (newPost.post.length > 50) {
    response.redirect('/add-post/error');
  } else {
    idArr = Object.keys(posts);
    console.log(posts);
    console.log(idArr);
    // eslint-disable-next-line radix
    const idArrInt = idArr.map((el) => parseInt(el));
    let bigId = idArrInt.reduce((acc, cur) => (acc > cur ? acc : cur), 0);

    id = bigId + 1;
    posts[id] = newPost;
    response.redirect('/');
  }
});

server.post('/delete-post', bodyParser, (request, response) => {
  const postToDelete = request.body.post;
  console.log(postToDelete);
  delete posts[postToDelete];
  response.redirect('/');
});

const staticHandler = express.static('public');
server.use(staticHandler);

const PORT = 3000;
// eslint-disable-next-line no-console
server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));

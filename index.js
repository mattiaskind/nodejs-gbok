const fs = require('fs').promises;
const express = require('express');
const util = require('util');

const app = express();
const port = 3000;

// const readFilePromise = (file) => {
//   return new Promise((resolve, reject) => {
//     fs.readFile(file, 'utf-8', (err, data) => {
//       if (err) reject('Filen kunde inte hittas');
//       resolve(data);
//     });
//   });
// };

const getPostsData = async (path) => {
  try {
    return await fs.readFile(path, 'utf-8');
  } catch (error) {
    throw 'Filen kunde inte hittas!';
  }
};

// const writePost = () => {
//   try {
//     return fs.writeFile('data/example-data.json');
//   } catch (error) {}
// };

app.get('/posts', (req, res) => {
  console.log('Inkommande begäran');
  (async () => {
    try {
      const posts = await getPostsData('data/example-data.json');
      res.json(JSON.parse(posts));
    } catch (error) {
      res.send(error);
    }
  })();
});

app.get('/posts/:id', (req, res) => {
  const { id } = req.params;
  (async () => {
    let posts = await getPostsData();
    posts = JSON.parse(posts);
    const post = posts.find((post) => post.id === Number(id));
    res.json(post);
  })();
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

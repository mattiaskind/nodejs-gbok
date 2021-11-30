const fs = require('fs').promises;
const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Ställ in varifrån statiska filer hämtas
app.use(express.static(path.join(__dirname, 'public')));
// Ställ in att ejs ska användas
app.set('view engine', 'ejs');
// Ställ in sökvägen till mappen för där templates finns
app.set('views', path.join(__dirname, 'views'));

// För formulärdatan
app.use(express.urlencoded({ extended: true }));

const getPostsData = async (path) => {
  if (path === '' || path === undefined) throw 'Du måste ange en sökväg!';
  try {
    return await fs.readFile(path, 'utf-8');
  } catch (error) {
    throw new Error('Filen kunde inte hittas!');
  }
};

app.get('/', (req, res) => {
  res.render('home.ejs');
});

app.get('/posts', async (req, res) => {
  console.log('Inkommande begäran');
  try {
    let posts = await getPostsData('data/example-data.json');
    posts = JSON.parse(posts);
    res.render('posts.ejs', { posts });
  } catch (error) {
    res.send(error.message);
  }
});

app.get('/posts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    let posts = await getPostsData('data/example-data.json');
    posts = JSON.parse(posts);
    const post = posts.find((post) => post.id === Number(id));
    res.json(post);
  } catch (error) {
    res.send(error.message);
  }
});

app.post('/posts', async (req, res) => {
  console.log('Ikommande begäran');
  const { name, email, comment } = req.body;
  console.log(name, email, comment);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

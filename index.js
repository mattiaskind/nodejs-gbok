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

// Funktion som läser läser in fil
const getPostsData = async () => {
  try {
    data = await fs.readFile('data/example-data.json', 'utf-8');
    return data;
  } catch (error) {
    throw new Error('Filen kunde inte hittas!');
  }
};

// Funktion som skriver till filen
const writePostData = async (data) => {
  try {
    console.log(typeof data);
    await fs.writeFile('data/example-data.json', JSON.stringify(data, null, 2));
  } catch (error) {
    throw new Error('Något gick fel när data skulle skrivas till filen.');
  }
};

app.get('/', (req, res) => {
  res.render('home.ejs');
});

app.get('/posts', async (req, res) => {
  try {
    // Hämta datan
    let posts = await getPostsData();
    posts = JSON.parse(posts);
    // Sortera, flest gilla-markeringar överst
    const sortedPosts = posts.sort((a, b) => b.likes - a.likes);

    res.render('posts.ejs', { posts: sortedPosts });
  } catch (error) {
    res.send(error.message);
  }
});

app.post('/posts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    let posts = await getPostsData();
    posts = JSON.parse(posts);
    for (let i = 0; i < posts.length; i++) {
      if (posts[i].id === Number(id)) posts[i].likes += 1;
    }
    await writePostData(posts);
    res.redirect('/posts');
  } catch (error) {
    res.send(error.message);
  }
});

app.get('/posts/new', (req, res) => {
  res.render('posts_new.ejs');
});

app.get('/posts/:postId', async (req, res) => {
  const { postId } = req.params;
  try {
    let posts = await getPostsData();
    posts = JSON.parse(posts);
    res.send(posts[0].replies);
  } catch (error) {
    res.send(error);
  }
});

// app.get('/posts/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//     let posts = await getPostsData('data/example-data.json');
//     posts = JSON.parse(posts);
//     const post = posts.find((post) => post.id === Number(id));
//     res.json(post);
//   } catch (error) {
//     res.send(error.message);
//   }
// });

// app.post('/posts', async (req, res) => {
//   const { name, email, comment } = req.body;
//   console.log(name, email, comment);
// });

app.post('/posts/', (req, res) => {
  const { author, email, comment } = req.body;
  console.log(author);
  console.log(email);
  console.log(comment);
  res.redirect('/posts');
});

app.use((req, res) => {
  res.status(404).send('Sidan kunde inte hittas');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

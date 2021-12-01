const fs = require('fs').promises;
const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

const filePath = 'data/example-data.json';
// Ställ in varifrån statiska filer hämtas
app.use(express.static(path.join(__dirname, 'public')));
// Ställ in att ejs ska användas
app.set('view engine', 'ejs');
// Ställ in sökvägen till mappen för där templates finns
app.set('views', path.join(__dirname, 'views'));
// För formulärdatan
app.use(express.urlencoded({ extended: true }));

// Visa alla inkommande förfrågningar
app.use((req, res, next) => {
  console.log('Inkommande ' + req.method + '-förfrågan');
  next();
});

// Funktion som läser läser in fil
const getPostsData = async () => {
  try {
    data = await fs.readFile(filePath, 'utf-8');
    return data;
  } catch (error) {
    throw new Error('Filen kunde inte hittas!');
  }
};

// Funktion som skriver till filen
const writePostData = async (data) => {
  try {
    console.log(typeof data);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    throw new Error('Något gick fel när data skulle skrivas till filen.');
  }
};

// Funktion som lägger till ett nytt inlägg
// const appendPostData = async (data) => {
//   try {
//     await fs.appendFile(filePath, JSON.stringify(data, null, 2));
//   } catch (error) {
//     throw new Error('Det gick inte skriva till filen');
//   }
// };

app.get('/', (req, res) => {
  res.render('home.ejs');
});

///////// Hämta inlägg - Gästbokens startsida /////////

app.get('/posts', async (req, res) => {
  try {
    // Hämta datan
    let posts = await getPostsData();
    posts = JSON.parse(posts);
    // Sortera, flest gilla-markeringar överst
    const sortedPosts = posts.sort((a, b) => b.likes - a.likes);
    // Skriv ut alla inlägg
    res.render('posts.ejs', { posts: sortedPosts });
  } catch (error) {
    res.send(error.message);
  }
});

///////// Nytt inlägg /////////
app.post('/posts/', async (req, res) => {
  const { author, email, comment } = req.body;
  const data = { author, email, comment, likes: 0 };
  //Generera ett id utifrån tid samt ett slumpmässigt tal
  let id = new Date().getTime();
  id += Math.floor(Math.random() * 10 + 1);
  data.id = id;

  try {
    await appendPostData(data);
    res.redirect('/posts');
  } catch (error) {
    res.send(error.message);
  }
});

///////// Gillat inlägg - Gäsboktens startsida /////////
app.post('/posts/:id', async (req, res) => {
  // ID:t på det inlägg som gillats
  const { id } = req.params;
  try {
    // Läser in alla inlägg
    let posts = await getPostsData();
    posts = JSON.parse(posts);

    // Öka egenskapen för gillamarkeringar med 1 på aktuellt inlägg
    for (let i = 0; i < posts.length; i++) {
      if (posts[i].id === Number(id)) posts[i].likes += 1;
    }
    // Skriv hela filen igen
    await writePostData(posts);
    // Skicka användaren till gästbokens startsida
    res.redirect('/posts');
  } catch (error) {
    res.send(error.message);
  }
});

///////// Nytt inlägg /////////

app.get('/posts/new', (req, res) => {
  res.render('new_post.ejs');
});

///////// Om sidan inte hittas /////////
app.use((req, res) => {
  res.status(404).render('error.ejs');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

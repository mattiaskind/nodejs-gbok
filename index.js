const fs = require('fs').promises;
const express = require('express');
const path = require('path');
const { body, validationResult } = require('express-validator');

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

// Visa inkommande förfrågningar i konsolen
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

///////// Index /////////
app.get('/', (req, res) => {
  res.render('home.ejs');
});

///////// Hämta inlägg - Gästbokens startsida /////////
app.get('/posts', async (req, res) => {
  try {
    // Hämta datan
    const posts = JSON.parse(await getPostsData());
    // Sortera, flest gilla-markeringar överst
    const sortedPosts = posts.sort((a, b) => b.likes - a.likes);
    // Skriv ut alla inlägg
    res.render('posts.ejs', { posts: sortedPosts });
  } catch (error) {
    res.send(error.message);
  }
});

///////// Nytt inlägg /////////
app.post('/posts/', body('email').isEmail().withMessage('Ogiltig e-post'), async (req, res) => {
  // Hämta eventuella fel
  const errors = validationResult(req);
  // Om det finns fel avbryt och rendera dessa
  if (!errors.isEmpty()) {
    const errorsArr = Object.values(errors.mapped()).map((error) => error.msg);
    return res.render('error', { errors: errorsArr });
  }

  const { author, email, comment } = req.body;
  const newPost = { author, email, comment, likes: 0 };
  //Generera någon slags unikt nummer utifrån tid samt ett slumpmässigt tal
  let id = new Date().getTime();
  id += Math.floor(Math.random() * 10 + 1);
  // Spara delar av talet
  newPost.id = Number(id.toString().slice(-5));
  try {
    const posts = JSON.parse(await getPostsData());
    posts.push(newPost);
    await writePostData(posts);
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

///////// Om sidan inte hittas /////////
app.use((req, res) => {
  res.status(404).render('not_found.ejs');
});

app.listen(port, () => {
  console.log(`Servern körs på http://localhost:${port}`);
});

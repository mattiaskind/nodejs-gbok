const fs = require('fs');
const express = require('express');
const app = express();

const port = 3000;

const readFilePromise = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf-8', (err, data) => {
      if (err) reject('Kan inte hitta filen');
      resolve(data);
    });
  });
};

// (async () => {
//   const data = await readFilePromise('data/example-data.json');
//   console.log(data);
// })();

readFilePromise('data/example-data.json').then((data) => {
  console.log(data);
});

// app.get('/', (req, res) => {
//   console.log('incoming request');
// });

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });

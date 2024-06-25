const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

app.post('/save-json', (req, res) => {
  const data = req.body;
  fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Ошибка при записи файла');
    }
    res.send('Данные успешно записаны');
  });
});

app.get('/get-json', (req, res) => {
  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Ошибка при чтении файла');
    }
    res.send(data);
  });
});

app.listen(3000, () => {
  console.log('Сервер запущен на порту 3000');
});


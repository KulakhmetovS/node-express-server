const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

app.post('/save-json', (req, res) => {
  const newData = req.body; // Изменили имя переменной на newData
  
  fs.readFile('data.json', 'utf8', (err, fileData) => { // Изменили имя переменной на fileData
    
    fs.stat('data.json', (err, stats) => {
        if(stats.size === 0) {
            let arr = [newData];
            fs.writeFile('data.json', JSON.stringify(arr, null, 2), (writeErr) => {
                if (writeErr) {
                    console.error(writeErr);
                    return res.status(500).send('Ошибка при записи файла');
                }
                res.send('Данные успешно записаны');
            });
        } else {
            let dataArray = [];
    
            dataArray = JSON.parse(fileData); // Используем fileData здесь
            
            //const hasElement = dataArray.includes(newData);
            
            let hasElement0 = dataArray.some(element => element.bookmarkName === newData.bookmarkName);
            let hasElement1 = dataArray.some(element => element.bookmarkDescription === newData.bookmarkDescription);
            
            if(!(hasElement0 && hasElement1)) {
                dataArray.push(newData); // Используем newData здесь
    
                fs.writeFile('data.json', JSON.stringify(dataArray, null, 2), (writeErr) => {
                if (writeErr) {
                console.error(writeErr);
                    return res.status(500).send('Ошибка при записи файла');
                }
                res.send('Данные успешно записаны');
                });
            }
        }
    });
  });
});


app.get('/get-json', (req, res) => {
  fs.readFile('data.json', 'utf8', (err, data) => {
  
    fs.stat('data.json', (err, stats) => {
        if(stats.size === 0) {
            let sendData = new Array(1);
            res.send([]);
        } else {
            if (err) {
            console.error(err);
            return res.status(500).send('Ошибка при чтении файла');
            }
            res.send(data);
        }
    });
  });
});


app.delete('/items', (req, res) => {
  const queryParams = req.query;
  
  fs.readFile('data.json', 'utf8', (err, fileData) => {
        let dataArray = [];
    
        dataArray = JSON.parse(fileData);
        
        const index0 = dataArray.findIndex(element => element.bookmarkName === queryParams.param1);
        const index1 = dataArray.findIndex(element => element.bookmarkDescription === queryParams.param2);
        
        if(index0 === index1) {
            dataArray.splice(index0, 1);
        }
        
        fs.writeFile('data.json', JSON.stringify(dataArray, null, 2), (writeErr) => {
                if (writeErr) {
                    console.error(writeErr);
                    return res.status(500).send('Ошибка при записи файла');
                }
                res.send('Данные успешно удалены');
            });
  });
});


app.listen(3000, () => {
  console.log('Сервер запущен на порту 3000');
});


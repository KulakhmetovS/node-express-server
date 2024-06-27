const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

//Обработка post запроса
app.post('/save-json', (req, res) => {
  const newData = req.body; //Запись полученных данных в переменную newData
  
  fs.readFile('data.json', 'utf8', (err, fileData) => { //Чтение файла и запись данных в fileData
    fs.stat('data.json', (err, stats) => {
        if(stats.size === 0) {  //Проверка дата-файла на пустоту
            let arr = [newData];    //Запись полученных данных в качестве элемента массива с длинной 1
            fs.writeFile('data.json', JSON.stringify(arr, null, 2), (writeErr) => { //Запись массива с данными в дата-файл
                if (writeErr) {
                    console.error(writeErr);
                    return res.status(500).send('Ошибка при записи файла');
                }
                res.send('Данные успешно записаны');
            });
        } else {    //Если в файле уже есть данные
            let dataArray = []; //Объявление массива данных
    
            dataArray = JSON.parse(fileData);   //Запись в массив полученных из файла данных
            
            //Проверка на наличие данных из запроса в массиве
            let hasElement0 = dataArray.some(element => element.bookmarkName === newData.bookmarkName);
            let hasElement1 = dataArray.some(element => element.bookmarkDescription === newData.bookmarkDescription);
            
            if(!(hasElement0 && hasElement1)) { //Если данных из запроса в массиве нет
                dataArray.push(newData);    //Добавляем полученные данные в массив
                
                //Записываем массив в дата-файл
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

//Обработка get запроса
app.get('/get-json', (req, res) => {
  fs.readFile('data.json', 'utf8', (err, data) => { //Открытие дата-файла для чтения данных
  
    fs.stat('data.json', (err, stats) => {  //Проверка дата-файла на пустоту
        if(stats.size === 0) {  //Если файл пуст
            res.send([]);   //Отправка пустого массива
        } else {    //Если в фале есть данные
            if (err) {
            console.error(err);
            return res.status(500).send('Ошибка при чтении файла');
            }
            res.send(data); //Отправка данных, считанных из дата-файла
        }
    });
  });
});

//Обработка delete зпроса
app.delete('/items', (req, res) => {
  const queryParams = req.query;    //Запись удаляемых данных
  
  fs.readFile('data.json', 'utf8', (err, fileData) => { //Чтение дата-файла
        let dataArray = []; //Создание массива для данных из файла
    
        dataArray = JSON.parse(fileData);   //Запись данных из файла в массив
        
        //Поиск индекса удаляемого элемента
        const index0 = dataArray.findIndex(element => element.bookmarkName === queryParams.param1);
        const index1 = dataArray.findIndex(element => element.bookmarkDescription === queryParams.param2);
        
        //Если индексы совпали, то удаляем элемент по указанному индексу
        if(index0 === index1) {
            dataArray.splice(index0, 1);
        }
        //Запись в дата-файл изменённого массива
        fs.writeFile('data.json', JSON.stringify(dataArray, null, 2), (writeErr) => {
                if (writeErr) {
                    console.error(writeErr);
                    return res.status(500).send('Ошибка при записи файла');
                }
                res.send('Данные успешно удалены');
            });
  });
});

//Слушаем порт, на который приходят запросы
app.listen(3000, () => {
  console.log('Сервер запущен на порту 3000');
});


const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();  // dotenv 패키지를 사용하여 .env 파일 불러오기

app.use(bodyParser.json());

const mongoUri = process.env.MONGODB_URI;  // .env 파일에 저장된 MONGODB_URI 사용


MongoClient.connect(mongoUri, function (err, client) {
    if (err) throw err;
    const db = client.db('eventDB');
    const collection = db.collection('participants');

    app.post('/checkParticipation', function (req, res) {
        const memberId = req.body.memberId;

        collection.findOne({ memberId: memberId }, function (err, result) {
            if (err) throw err;

            if (result) {
                // 중복 참여
                res.json({ isDuplicate: true });
            } else {
                // 신규 참여자, 데이터 저장
                collection.insertOne({ memberId: memberId }, function (err, result) {
                    if (err) throw err;
                    res.json({ isDuplicate: false });
                });
            }
        });
    });

    app.listen(4000, function () {
        console.log('Server is running on port 4000');
    });
});

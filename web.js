const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();  // .env 파일 불러오기

app.use(bodyParser.json());
const PORT = 4000;
const mongoUri = process.env.MONGODB_URI;  // .env 파일의 MONGODB_URI 사용
MongoClient.connect(mongoUri, function (err, client) {
    if (err) {
        console.error('Failed to connect to MongoDB:', err);
        app.use((req, res) => {
            res.status(500).json({ error: 'Failed to connect to the database' });
        });
        return;
    }

    const db = client.db('eventDB');
    const collection = db.collection('participants');

    console.log('Connected to MongoDB');

    // API: 회원 참여 여부 확인
    app.post('/checkParticipation', function (req, res) {
        const memberId = req.body.memberId;

        if (!memberId) {
            res.status(400).json({ error: 'memberId is required' });
            return;
        }

        // MongoDB에서 회원 ID 검색
        collection.findOne({ memberId: memberId }, function (err, result) {
            if (err) {
                res.status(500).json({ error: 'Database error' });
                return;
            }

            if (result) {
                // 중복 참여
                res.json({ isDuplicate: true, message: '이미 참여하셨습니다.' });
            } else {
                // 신규 참여자, 데이터 저장
                collection.insertOne({ memberId: memberId }, function (err, result) {
                    if (err) {
                        res.status(500).json({ error: 'Failed to save data' });
                        return;
                    }
                    res.json({ isDuplicate: false, message: '참여가 완료되었습니다.' });
                });
            }
        });
    });
});



// MongoDB 연결 성공 시 서버 실행
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

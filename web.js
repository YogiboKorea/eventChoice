const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// 환경 변수 설정
dotenv.config();

// Express 앱 초기화
const app = express();

// 미들웨어 설정 (app 초기화 이후)
app.use(cors());
app.use(bodyParser.json());

// MongoDB 연결
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB에 성공적으로 연결되었습니다.');
}).catch(err => {
    console.error('MongoDB 연결 오류:', err);
});

// API 라우트 설정
app.post('/api/sendMemberData', async (req, res) => {
    const { member_id } = req.body;
    try {
        // 회원 중복 확인
        const existingMember = await Member.findOne({ member_id });

        if (existingMember) {
            return res.status(400).json({ message: '이미 참여한 회원입니다.' });
        }

        // 새 회원 정보 저장
        const newMember = new Member({ member_id });
        await newMember.save();

        res.status(200).json({ message: '회원 정보가 성공적으로 저장되었습니다.' });
    } catch (error) {
        console.error('저장 중 오류 발생:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// 서버 시작
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});

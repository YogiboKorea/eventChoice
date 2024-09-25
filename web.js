const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(cors());
const dotenv = require('dotenv');

// 환경 변수 설정
dotenv.config();

const app = express();
const port = process.env.PORT || 4000; // .env 파일에서 포트 가져오기

// MongoDB 연결
mongoose.connect(process.env.MONGO_URI, { // .env 파일에서 MongoDB URI 가져오기
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB에 성공적으로 연결되었습니다.');
}).catch(err => {
    console.error('MongoDB 연결 오류:', err);
});

// MongoDB 스키마 및 모델 정의
const memberSchema = new mongoose.Schema({
    member_id: { type: String, required: true }
});

const Member = mongoose.model('Member', memberSchema);

// Body-parser 미들웨어 설정
app.use(bodyParser.json());

// 회원 정보를 MongoDB에 저장하는 API
app.post('/api/sendMemberData', async (req, res) => {
    const { member_id } = req.body;
    try {
        // 회원 정보 저장 로직
        const existingMember = await Member.findOne({ member_id });
        if (existingMember) {
            return res.status(400).json({ message: '이미 참여한 회원입니다.' });
        }

        const newMember = new Member({ member_id });
        await newMember.save();

        res.status(200).json({ message: '회원 정보가 성공적으로 저장되었습니다.' });
    } catch (error) {
        console.error('저장 중 오류 발생:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// 서버 실행
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});

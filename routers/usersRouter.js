const express = require('express');
const { User } = require('../models');
const router = express.Router();

// 사용자 회원가입 및 로그인 로직
router.post('/', async (req, res) => {
    const { userIdentifier, email, name } = req.body;

    const user_id = userIdentifier
    const nick = name
    try {
        // 사용자 정보를 조회하여 존재 여부 확인
        let user = await User.findOne({ where: { user_id } });

        if (!user) {
            // 사용자가 존재하지 않으면 새 사용자 생성
            user = await User.create({
                user_id,
                email,
                nick
            });
            return res.status(201).json({
                status: true,
                data: {
                    userId: user.user_id,
                    email: user.email,
                    nick: user.nick
                },                
                message: '회원가입이 완료되었습니다.',
            });
        } else {
            // 사용자가 이미 존재하면 로그인 처리
            return res.status(200).json({
                status: true,
                data: {
                    userId: user.user_id,
                    email: user.email,
                    nick: user.nick
                },
                message: '로그인 성공'

            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: '서버 오류'
        });
    }
});

module.exports = router;

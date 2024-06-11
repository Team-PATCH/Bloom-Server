const express = require('express');
const { Market, Product, InterestMarket, OperatingTime, MarketImage, Sequelize, ProductImag, User } = require('../models');
const router = express.Router();
const Op = Sequelize.Op;
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const secret = process.env.JWT_SECRET;

// const upload = require('./uploadImage');
// router.post('/', upload.single('photo'));

// router.post('/', async (req, res) => {
//   const newPost = req.body;
//   newPost.userID = req.userID;
//   newPost.photo = req.filename;
//   console.log(newPost);
//   try {
//     const result = await Sale.create(newPost);
//     console.log(result);
//     result.price = parseInt(result.price);
//     res.json({ success: true, documents: [result], message: 'post 등록 성공' });
//   } catch (error) {
//     res.json({
//       success: false,
//       documents: [],
//       message: `post 등록 실패 ${error}`,
//     });
//   }
// });

router.get('/', async (req, res) => {
    try {
        const { latitude, longitude, location } = req.query;
        const where = {};

        if (latitude && longitude) {
            where.coordinate_latitude = latitude;
            where.coordinate_longitude = longitude;
        }

        if (location) {
            where.location = location;
        }

        const markets = await Market.findAll({
            where,
            include: [
                {
                    model: Product,
                    limit: 6,
                    attributes: ['product_id', 'price', 'name']
                },
                {
                    model: InterestMarket,
                    attributes: []
                },
                {
                    model: OperatingTime,
                    attributes: ['day', 'operating_time']
                },
                {
                    model: MarketImage,
                    attributes: ['market_image_id', 'name']
                }
            ]
        });

        const result = markets.map(market => {
            const operatingTime = market.OperatingTimes.reduce((acc, cur) => {
                acc[cur.day] = cur.operating_time;
                return acc;
            }, {});

            return {
                marketId: market.market_id,
                name: market.name,
                summary: market.summary,
                addressDetail: market.address_detail,
                location: market.location,
                phoneNumber: market.phone_number,
                sns: market.sns,
                simpleProducts: market.Products.map(product => ({
                    image: product.image,
                    imageId: product.id,
                    price: product.price,
                    name: product.name
                })),
                interestCount: market.interest_count,
                operatingTime,
                latitude: market.coordinate_latitude,
                longitude: market.coordinate_longitude
            };
        });

        res.json({
            status: true,
            data: result,
            message: 'market 조회성공'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            data: [],
            message: '서버 오류'
        });
    }
});

//관심 마켓 추가 라우터
router.post('/interest/:market_id', async (req, res) => {
    try {
        const { user_id } = req.body;
        const { market_id } = req.params;

        // 유저와 마켓이 존재하는지 확인
        const user = await User.findByPk(user_id);
        const market = await Market.findByPk(market_id);

        if (!user || !market) {
            return res.status(404).json({
                status: false,
                message: '유저 또는 마켓을 찾을 수 없습니다.'
            });
        }

        // 관심 마켓 추가
        const interestMarket = await InterestMarket.create({ user_id, market_id });

        res.json({
            status: true,
            data: interestMarket,
            message: '관심 마켓이 성공적으로 추가되었습니다.'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: '서버 오류'
        });
    }
});

// 관심 마켓 삭제 라우터
router.delete('/interest/:market_id', async (req, res) => {
    try {
        const { user_id } = req.body;
        const { market_id } = req.params;

        // 유저와 마켓이 존재하는지 확인
        const user = await User.findByPk(user_id);
        const market = await Market.findByPk(market_id);

        if (!user || !market) {
            return res.status(404).json({
                status: false,
                message: '유저 또는 마켓을 찾을 수 없습니다.'
            });
        }

        // 관심 마켓 삭제
        const result = await InterestMarket.destroy({
            where: {
                user_id,
                market_id
            }
        });

        if (result === 0) {
            return res.status(404).json({
                status: false,
                message: '관심 마켓이 존재하지 않습니다.'
            });
        }

        res.json({
            status: true,
            message: '관심 마켓이 성공적으로 삭제되었습니다.'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: '서버 오류'
        });
    }
});


router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const options = {
        where: {
            id: id,
        },
    };
    const result = await Sale.findAll(options);
    res.json({ success: true, data: result, message: 'market 조회성공' });
});

module.exports = router;

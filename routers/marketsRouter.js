const express = require('express');
const { Market, Product, InterestMarket, OperatingTime, MarketImage, Sequelize, ProductImage } = require('../models');
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

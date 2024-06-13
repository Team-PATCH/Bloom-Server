const express = require('express');
const { User, InterestMarket, InterestProduct, Market, Product, ProductImage } = require('../models');
const { getBlobUrl } = require('../azureBlobClient.js');
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


// 사용자의 관심 마켓을 조회하는 라우터
router.get('/:user_id/interest-markets', async (req, res) => {
    try {
        const { user_id } = req.params;

        // 특정 유저의 관심 마켓 목록 조회
        const user = await User.findOne({
            where: { user_id },
            include: [
                {
                    model: InterestMarket,
                    include: [
                        {
                            model: Market,
                            include: [
                                {
                                    model: Product,
                                    attributes: ['product_id', 'name', 'category', 'color', 'price', 'description_image', 'share', 'interest_count', 'caution'],
                                    include: [
                                        {
                                            model: ProductImage,
                                            attributes: ['name'],
                                        },
                                    ],
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
                        }
                    ]
                }
            ]
        });

        if (!user) {
            return res.status(404).json({
                status: false,
                message: '유저를 찾을 수 없습니다.'
            });
        }

        const interestMarkets = await Promise.all(user.InterestMarkets.map(async (interestMarket) => {
            const market = interestMarket.Market;

            const operatingTime = market.OperatingTimes.reduce((acc, cur) => {
                acc[cur.day] = cur.operating_time;
                return acc;
            }, {});

            const products = await Promise.all(market.Products.map(async (product) => {
                const images = product.ProductImages.length > 0 
                    ? await Promise.all(product.ProductImages.map(async (img) => await getBlobUrl(img.name)))
                    : [];

                return {
                    productId: product.product_id,
                    name: product.name,
                    category: product.category,
                    color: product.color,
                    price: product.price,
                    descriptionImage: product.description_image,
                    share: product.share,
                    interestCount: product.interest_count,
                    caution: product.caution,
                    images,
                };
            }));

            return {
                marketId: market.market_id,
                name: market.name,
                summary: market.summary,
                addressDetail: market.address_detail,
                location: market.location,
                phoneNumber: market.phone_number,
                sns: market.sns,
                simpleProducts: products,
                interestCount: market.interest_count,
                operatingTime,
                latitude: market.coordinate_latitude,
                longitude: market.coordinate_longitude,
            };
        }));

        res.json({
            status: true,
            data: interestMarkets,
            message: '관심 마켓 조회 성공'
        });
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({
            status: false,
            data: [],
            message: '서버 오류'
        });
    }
});


module.exports = router;

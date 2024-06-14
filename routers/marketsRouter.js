const express = require('express');
const { Market, Product, InterestMarket, OperatingTime, MarketImage, Sequelize, ProductImage, User } = require('../models');
const Op = Sequelize.Op;
const router = express.Router();
const { getBlobUrl } = require('../azureBlobClient.js');

router.get('/', async (req, res) => {
    try {
        const { min_latitude, max_latitude, min_longitude, max_longitude, location } = req.query;
        const where = {};

        if (min_latitude && max_latitude && min_longitude && max_longitude) {
            where.coordinate_latitude = {
                [Op.between]: [parseFloat(min_latitude), parseFloat(max_latitude)]
            };
            where.coordinate_longitude = {
                [Op.between]: [parseFloat(min_longitude), parseFloat(max_longitude)]
            };
        }

        if (location) {
            where.location = location;
        }

        // 디버깅용 where 조건 로그 출력
        console.log('Where condition:', where);

        // 전체 마켓 데이터 조회
        const markets = await Market.findAll({
            where,
            include: [
                {
                    model: Product,
                    attributes: ['market_id','product_id', 'name', 'category', 'color', 'price', 'description_image', 'share', 'interest_count', 'caution'],
                    include: [
                        {
                            model: ProductImage,
                            attributes: ['name'],
                        },
                    ],
                },
                {
                    model: OperatingTime,
                    attributes: ['day', 'operating_time']
                }
            ]
        });

        // 조회된 마켓 데이터 처리
        const result = await Promise.all(markets.map(async (market) => {
            const operatingTime = market.OperatingTimes.reduce((acc, cur) => {
                acc[cur.day] = cur.operating_time;
                return acc;
            }, {});

            const products = await Promise.all(market.Products.map(async (product) => {
                const images = product.ProductImages.length > 0 
                    ? await Promise.all(product.ProductImages.map(async (img) => await getBlobUrl(img.name)))
                    : [];

            const descriptionImage = await getBlobUrl(product.description_image);


                return {
                    simpleMarket: {
                        marketId: market.market_id,
                        name: market.name,
                        isOperation: market.isOperation,
                        location: market.location,
                        phoneNumber: market.phone_number
                    },
                    productId: product.product_id,
                    name: product.name,
                    category: product.category,
                    color: product.color,
                    price: product.price,
                    descriptionImage,
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
                simpleProducts: products, // 모든 필드를 포함한 상품 정보
                interestCount: market.interest_count,
                operatingTime,
                isOperation: market.isOperation,
                coordinate: {
                    latitude: market.coordinate_latitude,
                    longitude: market.coordinate_longitude,
                }
            };
        }));

        res.json({
            status: true,
            data: result,
            message: 'market 조회성공'
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

router.get('/:market_id/products', async (req, res) => {
    try {
        const { market_id } = req.params;

        // 단일 마켓의 상품 목록 조회
        const market = await Market.findOne({
            where: { market_id },
            include: [
                {
                    model: Product,
                    attributes: ['product_id', 'price', 'name', 'category', 'description_image', 'share', 'interest_count', 'caution'],
                    include: [
                        {
                            model: ProductImage,
                            attributes: ['name'],
                        },
                    ],
                }
            ]
        });

        if (!market) {
            return res.status(404).json({
                status: false,
                message: '마켓을 찾을 수 없습니다.'
            });
        }

        const products = await Promise.all(market.Products.map(async (product) => {
            const images = product.ProductImages.length > 0 
                ? await Promise.all(product.ProductImages.map(async (img) => await getBlobUrl(img.name)))
                : [];

            return {
                marketId: market.market_id,
                productId: product.product_id,
                name: product.name,
                category: product.category,
                price: product.price,
                image: images,
                descriptionImage: product.description_image,
                share: product.share,
                interestCount: product.interest_count,
                caution: product.caution,
            };
        }));

        res.json({
            status: true,
            data: products,
            message: '상품 목록 조회 성공'
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

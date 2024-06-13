const express = require('express');
const { Market, Product, InterestMarket, OperatingTime, MarketImage, Sequelize, ProductImage, User, InterestProduct } = require('../models');
const router = express.Router();
const Op = Sequelize.Op;
const { getBlobUrl } = require('../azureBlobClient.js');


// 검색어와 필터로 프로덕트 리스트 반환
router.get('/', async (req, res) => {
    try {
        const { query, category, minPrice, maxPrice, color } = req.query;
        const where = {};

        if (query) {
            where.name = { [Op.like]: `%${query}%` };
        }

        if (category) {
            where.category = category;
        }

        if (minPrice) {
            where.price = { [Op.gte]: minPrice };
        }

        if (maxPrice) {
            if (!where.price) {
                where.price = {};
            }
            where.price[Op.lte] = maxPrice;
        }

        if (color) {
            where.color = color;
        }

        const products = await Product.findAll({
            where,
            include: [
                {
                    model: ProductImage,
                    attributes: ['name'],
                },
                {
                    model: Market,
                    attributes: ['market_id', 'name', 'isOperation', 'location', 'phone_number']
                }
            ],
        });

        const result = products.map(product => ({
            simpleMarket: {
                marketId: product.Market.market_id,
                name: product.Market.name,
                isOperation: product.Market.isOperation,
                location: product.Market.location,
                phoneNumber: product.Market.phone_number
            },            
            productId: product.product_id,
            name: product.name,
            color: product.color,
            category: product.category,
            price: product.price,
            images: product.ProductImages.map(img => img.name),
            descriptionImage: product.description_image,
            share: product.share,
            interestCount: product.interest_count,
            caution: product.caution,
        }));

        res.json({
            status: true,
            data: result,
            message: '제품 리스트 조회 성공'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: '서버 오류'
        });
    }
});

// 단일 상품의 상세 정보를 조회하는 라우터
router.get('/:product_id', async (req, res) => {
    try {
        const { product_id } = req.params;

        // 단일 상품 상세 정보 조회
        const product = await Product.findOne({
            where: { product_id },
            include: [
                {
                    model: ProductImage,
                    attributes: ['name']
                },
                {
                    model: Market,
                    attributes: ['market_id', 'name', 'isOperation', 'location', 'phone_number']
                }
            ]
        });

        if (!product) {
            return res.status(404).json({
                status: false,
                message: '상품을 찾을 수 없습니다.'
            });
        }

        const images = product.ProductImages.length > 0 
            ? await Promise.all(product.ProductImages.map(async (img) => await getBlobUrl(img.name)))
            : [];

        const result = {
            simpleMarket: {
                marketId: product.Market.market_id,
                name: product.Market.name,
                isOperation: product.Market.isOperation,
                location: product.Market.location,
                phoneNumber: product.Market.phone_number
            },
            productId: product.product_id,
            name: product.name,
            category: product.category,
            price: product.price,
            images,
            descriptionImage: product.description_image,
            share: product.share,
            interestCount: product.interest_count,
            caution: product.caution
        };

        res.json({
            status: true,
            data: result,
            message: '상품 상세 정보 조회 성공'
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


//관심 상품 추가 라우터
router.post('/interest/:product_id', async (req, res) => {
    try {
        const { user_id } = req.body;
        const { product_id } = req.params;

        // 유저와 상품이 존재하는지 확인
        const user = await User.findByPk(user_id);
        const product = await Market.findByPk(product_id);

        if (!user || !product) {
            return res.status(404).json({
                status: false,
                message: '유저 또는 상품을 찾을 수 없습니다.'
            });
        }

        // 관심 상품 추가
        const interestProduct = await InterestProduct.create({ user_id, product_id });

        res.json({
            status: true,
            data: interestProduct,
            message: '관심 상품이 성공적으로 추가되었습니다.'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: '서버 오류'
        });
    }
});

// 관심 상품 삭제 라우터
router.delete('/interest/:product_id', async (req, res) => {
    try {
        const { user_id } = req.body;
        const { product_id } = req.params;

        // 유저와 상품이 존재하는지 확인
        const user = await User.findByPk(user_id);
        const product = await Product.findByPk(product_id);

        if (!user || !product) {
            return res.status(404).json({
                status: false,
                message: '유저 또는 상품을 찾을 수 없습니다.'
            });
        }

        // 관심 상품 삭제
        const result = await InterestProduct.destroy({
            where: {
                user_id,
                product_id
            }
        });

        if (result === 0) {
            return res.status(404).json({
                status: false,
                message: '관심 상품이 존재하지 않습니다.'
            });
        }

        res.json({
            status: true,
            message: '관심 상품이 성공적으로 삭제되었습니다.'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: '서버 오류'
        });
    }
});

module.exports = router;

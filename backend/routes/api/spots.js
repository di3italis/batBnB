const express = require("express");
const { check } = require("express-validator");
const bcrypt = require("bcryptjs");

const { Op } = require("sequelize");

const {
    handleValidationErrors,
    validateSpot,
    validateId,
    validateSpotOwner,
    validateReview,
    validateBookingInput,
    validateBooking,
    checkAvailability,
    queryParams,
} = require("../../utils/validation");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const {
    Image,
    Review,
    Spot,
    User,
    Booking,
    Sequelize,
} = require("../../db/models");

const router = express.Router();

//$ GET ALL SPOTS - GET /api/spots
router.get("/", queryParams, handleValidationErrors, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 20;
    const { minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

    //? construct a whereObj
    const whereObj = {};
    if (minLat) whereObj.lat = { [Op.gte]: parseFloat(minLat) };
    if (maxLat)
        whereObj.lat = { ...whereObj.lat, [Op.lte]: parseFloat(maxLat) };
    if (minLng) whereObj.lng = { [Op.gte]: parseFloat(minLng) };
    if (maxLng)
        whereObj.lng = { ...whereObj.lng, [Op.lte]: parseFloat(maxLng) };
    if (minPrice) whereObj.price = { [Op.gte]: parseFloat(minPrice) };
    if (maxPrice)
        whereObj.price = { ...whereObj.price, [Op.lte]: parseFloat(maxPrice) };

    const queryOptions = {
        where: whereObj,
        limit: size,
        offset: (page - 1) * size,
    };

    //? lazy load all spots
    try {
        let getSpots = {};
        //? if queryParams, use those
        if (Object.keys(req.query).length > 0) {
            // console.log("\n<----  QUERY PARAMS  ---->", req.query, "\n");
            getSpots = await Spot.findAll(queryOptions);
        }
        //? else, regular get all spots
        else {
            getSpots = await Spot.findAll();
        }

        //? iterate thru to get associated tables' data
        for (let spot of getSpots) {
            //? find reviews for each spot
            const reviews = await Review.findAll({
                where: {
                    spotId: spot.id,
                },
                attributes: ["stars"],
            });
            //? aggregate stars
            let totalStars = 0;
            reviews.forEach((review) => {
                totalStars += review.stars;
            });
            const avgRating =
                reviews.length > 0 ? totalStars / reviews.length : null;
            //? insert agg -> each spot
            spot.dataValues.avgRating = avgRating;

            //? fetch one associated previewImage
            const previewImage = await Image.findOne({
                where: {
                    imageableId: spot.id,
                    imageableType: "Spot",
                    preview: true,
                },
                attributes: ["url"],
            });
            if (previewImage) {
                spot.dataValues.previewImage = previewImage.url;
            } else {
                spot.dataValues.previewImage = null;

            }
            // console.log(spot.dataValues.previewImage = previewImage);

            // console.log("-->spot<---", spot);
        }

        let responseObj = {};
        if (Object.keys(req.query).length > 0) {
            responseObj = { Spots: getSpots, page: page, size: size };
        } else {
            responseObj = { Spots: getSpots };
        }

        res.json(responseObj);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

//$ CURRENT USER'S SPOTS - GET /api/spots/current
router.get("/current", requireAuth, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const spots = await Spot.findAll({
            where: {
                ownerId: userId,
            },
            attributes: [
                "id",
                "ownerId",
                "address",
                "city",
                "state",
                "country",
                "lat",
                "lng",
                "name",
                "description",
                "price",
                "createdAt",
                "updatedAt",
                [
                    Sequelize.fn("AVG", Sequelize.col("Reviews.stars")),
                    "avgRating",
                ],
                [
                    Sequelize.fn(
                        "COALESCE",
                        Sequelize.fn("MAX", Sequelize.col("SpotImages.url")),
                        null
                    ),
                    "previewImage",
                ],
                // [
                //     Sequelize.literal(`(
                //         SELECT url FROM "Images"
                //         WHERE "Images"."imageableType" = 'Spot'
                //         AND "Images"."imageableId" = Spot.id
                //         AND "Images"."preview" = true
                //         LIMIT 1
                //     )`),
                //     `previewImage`,
                // ],
            ],
            include: [
                {
                    model: Review,
                    attributes: [],
                },
                {
                    model: Image,
                    as: "SpotImages",
                    attributes: [],
                    where: {
                        imageableType: "Spot",
                        preview: true,
                    },
                    required: false, // This allows spots without images to still be included
                },
                // {
                //     model: Image,
                //     as: "SpotImages",
                //     attributes: ["url"],
                //     // where: { //! res.json(getSpots) === [] if(!image)
                //     //     preview: true,
                //     // }
                // },
            ],
            group: ["Spot.id"],
        });
        res.json({ Spots: spots });
    } catch (err) {
        next(err);
    }
});

//$ GET DETAILS FOR A SPOT - GET /api/spots/:spotId
router.get(
    "/:spotId",
    validateId(Spot, "spotId", "open"),

    handleValidationErrors,
    async (req, res, next) => {
        // console.log(spotId);
        try {
            const { spotId } = req.params;
            // console.log("--------> testing get spot by id:", spotId);
            const spotsByID = await Spot.findByPk(spotId, {
                attributes: [
                    "id",
                    "ownerId",
                    "address",
                    "city",
                    "state",
                    "country",
                    "lat",
                    "lng",
                    "name",
                    "description",
                    "price",
                    "createdAt",
                    "updatedAt",
                    [
                        Sequelize.fn("COUNT", Sequelize.col("Reviews.stars")),
                        "numReviews",
                    ],
                    [
                        Sequelize.fn("AVG", Sequelize.col("Reviews.stars")),
                        "avgRating",
                    ],
                ],
                include: [
                    {
                        model: Review,
                        attributes: [],
                    },
                    {
                        model: Image,
                        as: "SpotImages",
                        attributes: ["id", "url", "preview"],
                        where: { imageableType: "Spot" },
                        required: false,
                    },
                    {
                        model: User,
                        as: "Owner",
                        attributes: ["id", "firstName", "lastName"],
                    },
                ],
                group: ["Spot.id", "SpotImages.id", "Owner.id"], // can't decide if I like single oor double quotes better... but i digress
            });
            res.json(spotsByID);
        } catch (err) {
            next(err);
        }
    }
);

//$ NEW SPOT - POST /api/spots
router.post(
    "/",
    requireAuth,
    validateSpot,
    handleValidationErrors,
    async (req, res, next) => {
        const {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price,
        } = req.body;

        const ownerId = req.user.id;

        try {
            const newSpot = await Spot.create({
                ownerId,
                address,
                city,
                state,
                country,
                lat,
                lng,
                name,
                description,
                price,
            });

            return res.status(201).json(newSpot);
        } catch (err) {
            return res.status(400).json({
                message: "Validation Error",
                errors: err.errors.map((e) => e.message),
            });
        }
    }
);

//$ NEW SPOT IMAGE - POST /api/spots/:spotId/images
router.post(
    "/:spotId/images",
    requireAuth,
    validateId(Spot, "spotId", "owner"),
    handleValidationErrors,
    async (req, res, next) => {
        const { spotId } = req.params;
        const { url, preview } = req.body;

        try {
            const newImage = await Image.create({
                url,
                preview,
                imageableId: spotId,
                imageableType: "Spot",
            });
            // res.json({newImage});
            res.json({
                id: newImage.id,
                url: newImage.url,
                preview: newImage.preview,
            });
        } catch (err) {
            next(err);
        }
    }
);

//$ EDIT SPOT - PUT /api/spots/:spotId
router.put(
    "/:spotId",
    requireAuth,
    validateSpot,
    validateId(Spot, "spotId", "owner"),
    handleValidationErrors,
    async (req, res, next) => {
        const { spotId } = req.params;
        const {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price,
        } = req.body;

        try {
            const editSpot = await Spot.update(
                {
                    address,
                    city,
                    state,
                    country,
                    lat,
                    lng,
                    name,
                    description,
                    price,
                },
                {
                    where: {
                        id: spotId,
                    },
                }
            );

            const updatedSpot = await Spot.findByPk(spotId);
            res.status(200).json(updatedSpot);
        } catch (err) {
            // console.log(err);
            next(err);
        }
    }
);

//$ DELETE SPOT - DELETE /api/spots/:spotId
router.delete(
    "/:spotId",
    requireAuth,
    validateId(Spot, "spotId", "owner"),
    async (req, res, next) => {
        const { spotId } = req.params;
        try {
            const spot = await Spot.findByPk(spotId);
            await spot.destroy();

            res.status(200).json({ message: "Successfully deleted" });
        } catch (err) {
            next(err);
        }
    }
);

//# REVIEWS--------------------------------------------------------------
//$ Create a review - POST /api/spots/:spotId/reviews
router.post(
    "/:spotId/reviews",
    requireAuth,
    validateId(Spot, "spotId", "open"),
    validateReview,
    handleValidationErrors,
    async (req, res, next) => {
        const userReview = await Review.findOne({
            where: {
                userId: req.user.id,
                spotId: req.params.spotId,
            },
        });

        if (userReview) {
            return res.status(403).json({
                message: "User already has a review for this spot",
            });
        }
        try {
            const { spotId } = req.params;
            const { review, stars } = req.body;

            const newReview = await Review.create({
                userId: req.user.id,
                spotId: Number(spotId),
                review,
                stars,
            });

            res.status(201).json(newReview);
        } catch (err) {
            return res.status(400).json({
                message: "Validation Error",
                errors: err.errors.map((e) => e.message),
            });
        }
    }
);

//$ Get Reviews of Spot ID - GET /api/reviews/spot/:spotId
router.get(
    "/:spotId/reviews",
    validateId(Spot, "spotId", "open"),
    async (req, res, next) => {
        try {
            const spotId = req.params.spotId;
            const spotReviews = await Review.findAll({
                where: {
                    spotId: spotId,
                },
                attributes: [
                    "id",
                    "userId",
                    "spotId",
                    "review",
                    "stars",
                    "createdAt",
                    "updatedAt",
                ],
                include: [
                    {
                        model: User,
                        as: User,
                        attributes: ["id", "firstName", "lastName"],
                    },
                    {
                        model: Image,
                        as: "ReviewImages",
                        attributes: ["id", "url"],
                    },
                ],
                // nested: true,
            });
            res.status(200).json({ Reviews: spotReviews });
        } catch (error) {
            next(error);
        }
    }
);

//# BOOKINGS--------------------------------------------------------------
//$ Get Spot Bookings - GET /api/spots/:spotId/bookings
router.get(
    "/:spotId/bookings",
    requireAuth,
    validateId(Spot, "spotId", "open"),
    async (req, res, next) => {
        try {
            const { spotId } = req.params;
            const spot = await Spot.findByPk(spotId);
            const spotOwnerId = spot.ownerId;

            if (spotOwnerId === req.user.id) {
                const getBookings = await Booking.findAll({
                    where: {
                        spotId: spotId,
                    },
                    include: [
                        {
                            model: User,
                            attributes: ["id", "firstName", "lastName"],
                        },
                    ],
                });
                const bookings = getBookings.map((booking) => {
                    return {
                        User: booking.User,
                        id: booking.id,
                        spotId: booking.spotId,
                        userId: booking.userId,
                        startDate: booking.startDate,
                        endDate: booking.endDate,
                        createdAt: booking.createdAt,
                        updatedAt: booking.updatedAt,
                    };
                });
                res.status(200).json({
                    message: "You are the owner of this spot",
                    Bookings: bookings,
                });
            } else {
                const getBookings = await Booking.findAll({
                    where: {
                        spotId: spotId,
                        userId: req.user.id,
                    },
                    attributes: ["spotId", "startDate", "endDate"],
                });
                res.status(200).json({ Bookings: getBookings });
            }
        } catch (error) {
            next(error);
        }
    }
);

//$ Create a Booking - POST /api/spots/:spotId/bookings
router.post(
    "/:spotId/bookings",
    requireAuth,
    validateBookingInput,
    validateId(Spot, "spotId", "guestBook"),
    checkAvailability,
    handleValidationErrors,
    async (req, res, next) => {
        try {
            const spotId = +req.params.spotId; // parse param to int
            // Assuming user is authenticated and req.user is available
            const newBooking = await Booking.create({
                spotId: spotId,
                userId: req.user.id,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
            });
            return res.status(200).json(newBooking);
        } catch (error) {
            // Handle Sequelize validation error or other errors
            return res
                .status(400)
                .json({ message: "Validation error", errors: error.errors });
        }
    }
);

module.exports = router;

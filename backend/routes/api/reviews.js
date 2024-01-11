const express = require("express");
const { check } = require("express-validator");
const bcrypt = require("bcryptjs");

const {
    validateId,
    validateSpotOwner,
    handleValidationErrors,
    validateReview,
} = require("../../utils/validation");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Image, Review, Spot, User, Sequelize } = require("../../db/models");

const router = express.Router();

//$ Get Reviews of Current User - GET /api/reviews/current
// Get Reviews of Current User - GET /api/reviews/current
router.get("/current", requireAuth, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const reviews = await Review.findAll({
            where: { userId: userId },
            attributes: [
                "id",
                "userId",
                "spotId",
                "review",
                "stars",
                "createdAt",
                "updatedAt",
                // [ // Include the COALESCE SQL for previewImage here to attach it to the main record
                //     Sequelize.fn(
                //         "COALESCE",
                //         Sequelize.fn(
                //             "MAX",
                //             Sequelize.col("Spot->SpotImages.url")
                //         ),
                //         null
                //     ),
                //     "previewImage",
                // ],
            ],
            include: [
                {
                    model: User,
                    as: "User",
                    attributes: ["id", "firstName", "lastName"],
                },
                {
                    model: Spot,
                    as: "Spot",
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
                        "price",
                        [
                            // Include the COALESCE SQL for previewImage here to attach it to the main record
                            Sequelize.fn(
                                "COALESCE",
                                Sequelize.fn(
                                    "MAX",
                                    Sequelize.col("Spot->SpotImages.url")
                                ),
                                null
                            ),
                            "previewImage",
                        ],
                    ],
                    include: [
                        {
                            model: Image,
                            as: "SpotImages",
                            attributes: [],
                            where: {
                                imageableType: "Spot",
                                preview: true,
                            },
                            required: false,
                        },
                    ],
                },
                {
                    model: Image,
                    as: "ReviewImages",
                    attributes: ["id", "url"],
                    where: {
                        imageableType: "Review",
                    },
                    required: false,
                },
            ],
            group: [
                "Review.id",
                "User.id",
                "Spot.id",
                "Spot->SpotImages.id",
                "ReviewImages.id",
            ],
        });

        res.json({ Reviews: reviews });
    } catch (error) {
        next(error);
    }
});


//$ Add Image to a Review AUTH UserId - POST /api/reviews/:reviewId/images
router.post(
    "/:reviewId/images",
    requireAuth,
    validateId(Review, "reviewId", "guest"),
    async (req, res, next) => {
        try {
            const { reviewId } = req.params;
            const { url } = req.body;

            if (!url) {
                return res.status(400).json({ message: "Url is required" });
            }

            const review = await Review.findByPk(reviewId);

            // if (review.userId !== req.user.id) {
            //     return res.status(403).json({ message: "Forbidden" });
            // }

            //! getReviewImages() returns an array of image objects, because Images table has polymorphic association with Reviews table (and Spots and Users tables) with imageableType: "Review" ...automagically generates getReviewImages by sequelize 🤯
            const imageCount = await review.getReviewImages();
            if (imageCount.length >= 10) {
                return res.status(400).json({
                    message:
                        "Maximum number of images for this resource was reached",
                });
            }

            // √ check qty < 11 images: imageableId = reviewId and imageableType = Review
            // √ throw err if qty >= 11
            // √ create new image in Images table. url required. preview = false

            const newImage = await Image.create({
                imageableType: "Review",
                imageableId: reviewId,
                url: url,
                preview: false,
            });
            res.status(200).json({ id: newImage.id, url: url });
        } catch (error) {
            next(error);
        }
    }
);

//$ Edit Review AUTH UserId - PUT /api/reviews/:reviewId
router.put(
    "/:reviewId",
    requireAuth,
    validateReview,
    validateId(Review, "reviewId", "guest"),
    handleValidationErrors,
    async (req, res, next) => {
        try {
            // await validateReview(req, res, next);
            const { reviewId } = req.params;
            const { review, stars } = req.body;

            const findReview = await Review.update(
                {
                    review,
                    stars,
                },
                {
                    where: {
                        id: reviewId,
                    },
                }
            );
            const updatedReview = await Review.findByPk(reviewId);
            const orderedReview = {
                id: updatedReview.id,
                userId: updatedReview.userId,
                spotId: updatedReview.spotId,
                review: updatedReview.review,
                stars: updatedReview.stars,
                createdAt: updatedReview.createdAt,
                updatedAt: updatedReview.updatedAt,
            };

            res.status(200).json(orderedReview);
        } catch (error) {
            next(error);
        }
    }
);

//$ Delete Review AUTH ReviewId - DELETE /api/reviews/:reviewId
router.delete(
    "/:reviewId",
    requireAuth,
    validateId(Review, "reviewId", "guest"),
    handleValidationErrors,
    async (req, res, next) => {
        try {
            const { reviewId } = req.params;
            const deleteReview = await Review.destroy({
                where: {
                    id: reviewId,
                },
            });
            res.status(200).json({ message: "Successfully deleted" });
        } catch (error) {
            next(error);
        }
    }
);

//$ Delete Image from a Review AUTH UserId - DELETE /api/reviews/:reviewId/images/:imageId
module.exports = router;

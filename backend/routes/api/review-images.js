const express = require("express");

const { requireAuth } = require("../../utils/auth");
const {
    Image,
    Review,
    Spot,
    User,
    Booking,
    Sequelize,
} = require("../../db/models");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

//$ Delete Review Image - DELETE /api/review-images/:imageId
//todo verify review image exists, verify owner of review, delete image, send response
router.delete(
    "/:imageId",
    requireAuth,
    handleValidationErrors,
    async (req, res, next) => {
        try {
            const imageId = parseInt(req.params.imageId);
            const imageableType = "Review";

            const imageToDelete = await Image.findOne({
                where: {
                    id: imageId,
                    imageableType: imageableType,
                },
                include: {
                    model: Review,
                    as: 'Review',
                    include: {
                        model: User,
                        attributes: ["id"],
                    },
                },
            });

            // res.json({"reviewer-id": imageToDelete.Review.userId, imageToDelete: imageToDelete, imageableId: imageableId, imageableType: imageableType});

            if (!imageToDelete) {
                res.status(404).json({
                    message: "Review Image couldn't be found",
                });
            }

            if (req.user.id !== imageToDelete.Review.userId) {
                return res.status(401).json({ message: "Forbidden" });
            }

            await Image.destroy({
                where: {
                    id: imageId,
                    imageableType: imageableType,
                },
            });

            res.status(200).json({ message: "Successfully deleted" });
        } catch (err) {
            next(err);
        }
    }
);

module.exports = router;

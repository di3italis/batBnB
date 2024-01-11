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
const {
    handleValidationErrors,
    validateId,
} = require("../../utils/validation");

const router = express.Router();

//$ Delete Spot Image - DELETE /api/spot-images/:images
//! spot-images EP is looking for imageableId instead of image id
router.delete(
    "/:images",
    requireAuth,
    handleValidationErrors,
    async (req, res, next) => {
        try {
            const imageId = parseInt(req.params.images);
            const imageableType = "Spot";

            const findImage = await Image.findOne({
                where: {
                    id: imageId,
                    imageableType: imageableType,
                },
                include: {
                    model: Spot,
                    as: "Spot",
                    attributes: ["ownerId"],
                    // include: {
                    //     model: User,
                    //     as: 'Owner',
                    //     attributes: ["ownerId"],
                    // },
                },
            });

            // console.log(JSON.stringify(findImage, null, 2));

            if (!findImage) {
                res.status(404).json({
                    message: "Spot Image couldn't be found",
                });
            }

            if (req.user.id !== findImage.Spot.ownerId) {
                return res.status(401).json({ message: "Forbidden" });
            }

            await Image.destroy({
                where: {
                    id: imageId,
                    imageableType: imageableType,
                },
            });
            // deleteImage(imageableId, imageableType);

            res.status(200).json({ message: "Successfully deleted" });
        } catch (err) {
            next(err);
        }
    }
);
// router.delete(
//     "/:images",
//     requireAuth,
//     handleValidationErrors,
//     async (req, res, next) => {
//         try {
//             const imageableId = parseInt(req.params.images);
//             const imageableType = "Spot";

//             const findImage = await Image.findOne({
//                 where: {
//                     imageableId: imageableId,
//                     imageableType: imageableType,
//                 },
//             });

//             if (!findImage) {
//                 res.status(404).json({
//                     message: "Spot Image couldn't be found",
//                 });
//             }

//             await Image.destroy({
//                 where: {
//                     imageableId: imageableId,
//                     imageableType: imageableType,
//                 },
//             });
//             // deleteImage(imageableId, imageableType);

//             res.status(200).json({ message: "Successfully deleted" });
//         } catch (err) {
//             next(err);
//         }
//     }
// );

module.exports = router;

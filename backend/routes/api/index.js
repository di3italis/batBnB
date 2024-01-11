const router = require("express").Router();
const bookingsRouter = require("./bookings.js");
const reviewsRouter = require("./reviews.js");
const sessionRouter = require("./session.js");
const spotsRouter = require("./spots.js");
const usersRouter = require("./users.js");
const spotImagesRouter = require("./spot-images.js");
const reviewImagesRouter = require("./review-images.js");
const { restoreUser } = require("../../utils/auth.js");

// GET /api/restore-user
// router.get('/restore-user', (req, res) => {
//     return res.json(req.user);
// });

// // GET /api/set-token-cookie
// const { setTokenCookie } = require('../../utils/auth.js');
// const { User, sequelize } = require('../../db/models');
// router.get('/set-token-cookie', async (_req, res) => {
//     sequelize
//     .query("SELECT name FROM sqlite_master WHERE type='table'")
//     .then((tables) => {
//         // console.log(tables[0], '************************');
//     });
//     const user = await User.findOne({
//         where: {
//             username: "Demo-lition",
//         },
//     });
//     setTokenCookie(res, user);
//     return res.json({ user });
// });

// // GET /api/require-auth
// const { requireAuth } = require('../../utils/auth.js');
// router.get(
//   '/require-auth',
//   requireAuth,
//   (req, res) => {
//     return res.json(req.user);
//   }
// );

// Connect restoreUser middleware to the API router
// If current user session is valid, set req.user to the user in the database
// If current user session is not valid, set req.user to null
router.use(restoreUser);

router.use("/bookings", bookingsRouter);
router.use("/reviews", reviewsRouter);
router.use("/session", sessionRouter);
router.use("/spots", spotsRouter);
router.use("/users", usersRouter);
router.use("/spot-images", spotImagesRouter);
router.use("/review-images", reviewImagesRouter);

router.post("/test", (req, res) => {
    res.json({ requestBody: req.body });
});

module.exports = router;

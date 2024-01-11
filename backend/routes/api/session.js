const express = require("express");
const { check } = require("express-validator");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

const { handleValidationErrors } = require("../../utils/validation");
const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { User } = require("../../db/models");

const router = express.Router();

const validateLogin = [
    check("credential")
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Email or username is required"),
    check("password")
        .exists({ checkFalsy: true })
        .withMessage("Password is required"),
    handleValidationErrors,
];

//$ LOGIN
// It's also good practice to validate and sanitize input data, handle errors gracefully, and log errors for debugging while avoiding exposing sensitive information. Make sure that is happening
router.post("/", validateLogin, async (req, res, next) => {
    const { credential, password } = req.body;

    const user = await User.unscoped().findOne({
        where: {
            [Op.or]: {
                username: credential,
                email: credential,
            },
        },
    });

    // console.log(`pw: ${password}, user pw: ${user.hashedPassword}`);

    if (
        !user ||
        !bcrypt.compareSync(password, user.hashedPassword.toString())
    ) {
        const err = new Error("Invalid credentials");
        err.status = 401;
        // err.title = "Login failed";
        // err.errors = { credential: "The provided credentials were invalid." };
        return next(err);
    }

    const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName, //! added for test
        lastName: user.lastName, //! added for test
    };
    await setTokenCookie(res, safeUser);

    return res.json({ user: safeUser });
});

//$ LOGOUT
router.delete("/", (_req, res) => {
    res.clearCookie("token");
    return res.json({ message: "success" });
});

//$ GET CURRENT USER / RESTORE SESSION USER
router.get("/", (req, res) => {
    const { user } = req;
    if (user) {
        const safeUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
        };
        return res.json({
            user: safeUser,
        });
    } else return res.json({ user: null });
});

module.exports = router;

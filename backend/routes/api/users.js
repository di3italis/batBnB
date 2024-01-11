const express = require("express");
const { check } = require("express-validator");
const bcrypt = require("bcryptjs");

const {
    validateUser, handleValidationErrors,
} = require("../../utils/validation");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");

const router = express.Router();


// Sign up new user
router.post("/", validateUser, handleValidationErrors, async (req, res, next) => {
    try {
        const { email, password, username, firstName, lastName } = req.body;
        const hashedPassword = bcrypt.hashSync(password);
        const user = await User.create({
            email,
            username,
            hashedPassword,
            firstName,
            lastName,
        });

        const safeUser = {
            id: user.id,
            email: user.email,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
        };

        await setTokenCookie(res, safeUser);

        return res.status(200).json({
            user: safeUser,
        });
    } catch (error) {
        // console.log("error--->>>>", error.errors);
           if (error.name === "SequelizeUniqueConstraintError") {
               const errors = {};
               error.errors.forEach((e) => {
                   errors[e.path] = `User with that ${e.path} already exists`;
               });

               return res.status(500).json({
                   message: "User already exists",
                   errors: errors,
               });
           } else {
               // Log the error for server-side debugging
               console.error("Unexpected error occurred:", error);
               return res.status(500).json({
                   message: "An unexpected error occurred.",
               });
           }
    }
});

module.exports = router;

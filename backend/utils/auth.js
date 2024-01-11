const jwt = require("jsonwebtoken");
const { jwtConfig } = require("../config");
const { User } = require("../db/models");

const { secret, expiresIn } = jwtConfig;

// sends a JWT cookie
const setTokenCookie = (res, user) => {
    // create the token
    const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
    };
    const token = jwt.sign({ data: safeUser }, secret, {
        expiresIn: parseInt(expiresIn),
    });

    const isProduction = process.env.NODE_ENV === "production";

    // set the token cookie
    res.cookie("token", token, {
        maxAge: expiresIn * 1000, // in ms
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction && "Lax",
    });
    return token;
};

const restoreUser = (req, res, next) => {
    // token parsed from cookies
    const { token } = req.cookies;
    req.user = null;

    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
        if (err) {
            return next();
        }

        try {
            const { id } = jwtPayload.data;
            req.user = await User.findByPk(id, {
                attributes: {
                    include: ["email", "createdAt", "updatedAt"],
                },
            });
        } catch (e) {
            res.clearCookie("token");
            return next();
        }

        if (!req.user) res.clearCookie("token");

        return next();
    });
};

//? if there is no current user, return an error
const requireAuth = function (req, _res, next) {
    if (req.user) return next();

    const err = new Error('Authentication required');
    // err.title = "Authentication required";
    // err.errors = { message: "Authentication required" };
    err.status = 401;
    return next(err);
};

module.exports = { setTokenCookie, restoreUser, requireAuth };

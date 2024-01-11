const express = require("express");
// require('express-async-errors');
const morgan = require("morgan");
const cors = require("cors");
const csurf = require("csurf");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const { ValidationError } = require("sequelize");

const routes = require("./routes");
const { environment } = require("./config");
const isProduction = environment === "production";
// console.log(`\n>>>   >>>   >>> \nENVIRONMENT: ${environment}\n<<<   <<<   <<<\n`);

const app = express();

app.use(morgan("dev"));

app.use(cookieParser());
app.use(express.json());

// security midware
if (!isProduction) {
    // cors only in dev
    app.use(cors());
}

// helmet helps set headers for security
app.use(
    helmet.crossOriginResourcePolicy({
        policy: "cross-origin",
    })
);

// set csrf token and create req.csrfToken method
app.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && "Lax",
            httpOnly: true,
        },
    })
);

app.use(routes);

//# ERROR HANDLING--------------------------------------------------------------
//? catch unhandled requests and pass them to error handler
app.use((req, _res, next) => {
    const err = new Error("The requested resource couldn't be found.");
    err.title = "Resource Not Found";
    err.errors = { message: "The requested resource could not be found." };
    err.status = 404;

    // console.log(`Error triggered for request: ${req.method} ${req.url}`);
    // console.log("Headers:", req.headers);
    // console.log("Body:", req.body);
    // console.log("Query:", req.query);
    // console.log("IP:", req.ip);
    // console.log("User Agent:", req.get("User-Agent"));

    next(err);
});

//? process sequelize errors
app.use((err, _req, _res, next) => {
    // console.log('HEEEEEYAAAHHH, HEEEEEYAAAHHH!');
    // check if error is a sequelize error:
    if (err instanceof ValidationError) {
        let errors = {};
        for (let error of err.errors) {
            errors[error.path] = error.message;
        }
        err.title = "Validation error";
        err.errors = errors;
    }
    next(err);
});

//? error formatter
app.use((err, _req, res, _next) => {
    res.status(err.status || 500);
    console.error(err);
    // Check if it's a booking availability error and format the response
    if (err.status === 403 && err.errors) {
        // Respond with a structured error for booking conflicts
        res.json({
            message: err.message, // Custom message for booking conflicts
            errors: err.errors, // Detailed errors
        });
    } else {
        // Respond with a general error format for all other types of errors
        res.json({
            // title: err.title || "Server Error",
            message: err.message,
            errors: err.errors, // Validation or other errors
            // stack: isProduction ? null : err.stack, // Include stack trace if not in production
        });
    }
    // res.json({
    //     title: err.title || "Server Error",
    //     message: err.message,
    //     errors: err.errors,
    //     stack: isProduction ? null : err.stack,
    // });
});

module.exports = app;

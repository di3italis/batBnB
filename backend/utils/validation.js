/*
 1. "express - validator" checks incoming req and adds errors to the stack.
 2. "validationResult" collects errors in Result object, with a formatter
           method
 3. "handleValidationErrors" is called as the last middleware for a route,
           processing the stack of errors. handy and beautiful piece of code.
*/

const { check, body, validationResult } = require("express-validator");
const {
    Image,
    Review,
    Spot,
    User,
    Booking,
    Sequelize,
} = require("../db/models");
const { Op, NOW } = require("sequelize");

const handleValidationErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);

    //# What does validationResult look like? -------------------
    // console.log(validationErrors);
    /* EDIT REVIEW VALIDATION ERROR
   Result {
  formatter: [Function: formatter],
  errors: [
    {
      value: '',
      msg: 'Review text is required',
      param: 'review',
      location: 'body'
    },
    {
      value: -3,
      msg: 'Stars must be an integer from 1 to 5',
      param: 'stars',
      location: 'body'
    }
  ]
}*/
    //# --------------------------------------------------------------
    //! attempting to salvage this codeblock -validationErrors- by altering it into a pojo, not an object of array values
    if (!validationErrors.isEmpty()) {
        // if error stack, create empty accumulator object, turn Result into array, reduce array into the current field of accumulator object -> keys(params aka field) and values(value of current error being accumulated)
        // console.log("_______validationErrors object:", validationErrors);
        const errors = validationErrors.array().reduce((accumulator, error) => {
            console.log("current accumulator:", accumulator);
            if (!accumulator.param) {
                // if accumulator doesn't have a key of error.param, create one and set it to an empty object
                accumulator[error.param] = {};
            }
            accumulator[error.param] = error.msg; // set current key/value to accumulator field/param
            // console.log(
            //     "___>just added an accumulator param!",
            //     accumulator[error.param]
            // );
            return accumulator;
        }, {}); // Start with an empty accumulator object

        // console.log("______________errors:", errors);

        const err = Error("Bad request.");
        err.errors = errors;
        err.status = 400;
        err.title = "Bad request.";
        next(err);
    } else {
        next();
    }
    // if (!validationErrors.isEmpty()) {
    //     // if error stack, create empty accumulator object, turn Result into array, reduce array into the current field of acculumlator object -> keys(params aka field) and values(array of errors)
    //     console.log('_______validationErrors object:', validationErrors);
    //     const errors = validationErrors.array().reduce((accumulator, error) => {
    //         if (!accumulator.param) {
    //             // if accumulator doesn't have a key of error.param, create one and set it to an empty array
    //             accumulator[error.param] = [];
    //         }
    //         accumulator[error.param].push(error.msg); // Push the new error message to the field's array
    //         console.log("___>just added an accumulator param!");
    //         return accumulator;
    //     }, {}); // Start with an empty accumulator object

    //     console.log('______________errors:', errors);

    //     const err = Error("Bad request.");
    //     err.errors = errors;
    //     err.status = 400;
    //     err.title = "Bad request.";
    //     next(err);
    // } else {
    //     next();
    // }
};

const validateUser = [
    body("firstName", "First Name is required").not().isEmpty(),
    body("lastName", "Last Name is required").not().isEmpty(),
    body("email", "Invalid email").isEmail(),
    //   body('email').custom(async (email) => {
    //     const existingUser = await User.findOne({ where: { email } });
    //     if (existingUser) {
    //       return Promise.reject('User with that email already exists');
    //     }
    //   }),
    body("username", "Username is required").not().isEmpty(),
    //   body('username').custom(async (username) => {
    //     const existingUser = await User.findOne({ where: { username } });
    //     if (existingUser) {
    //       return Promise.reject('User with that username already exists');
    //     }
    //   }),
    body("password", "Password must be 6 or more characters long").isLength({
        min: 6,
    }),
];

//? checks all req.body values against constraints
const validateSpot = [
    check("address")
        .exists({ checkFalsy: true })
        .withMessage("Street address is required"),
    check("city").exists({ checkFalsy: true }).withMessage("City is required"),
    check("state")
        .exists({ checkFalsy: true })
        .withMessage("State is required"),
    check("country")
        .exists({ checkFalsy: true })
        .withMessage("Country is required"),
    check("lat")
        .toFloat() // convert to float
        .isFloat({ min: -90, max: 90 }) // validate within range
        .withMessage("Latitude is not valid"),
    check("lng")
        .toFloat()
        .isFloat({ min: -180, max: 180 })
        .withMessage("Longitude is not valid"),
    check("name")
        .isLength({ max: 50 })
        .withMessage("Name must be less than 50 characters"),
    check("description")
        .exists({ checkFalsy: true })
        .withMessage("Description is required"),
    check("price")
        .exists({ checkFalsy: true })
        .withMessage("Price per day is required")
        .bail()
        .toFloat()
        .isFloat({ min: 0 })
        .withMessage("Price per day is required")
        // .withMessage("Price per day is not valid"),
];

//? old validate spotId, now made polymorphic below...🤯
// const validateSpotId = async (req, res, next) => {
//     const { spotId } = req.params;
//     const spot = await Spot.findByPk(spotId);

//     if (!spot) {
//         return res.status(404).json({ message: "Spot couldn't be found" });
//     }
//   next();
// };

//? validateId checks for existing record, and for authorized user role. "auth" arg is a boolean: user role authorization?
const validateId = (model, param, role) => {
    // auth determines who needs to be filtered
    return async (req, res, next) => {
        const id = req.params[param];
        let clientId = null;
        const record = await model.findByPk(id);

        if (!record) {
            return res.status(404).json({
                message: `${model.name} couldn't be found`,
            });
        }

        if (role === "open") {
            return next();
        }

        if (role === "owner" && req.user.id !== record.ownerId) {
            return res.status(403).json({ message: "Forbidden" });
        }
        if (role === "guestBook") {
            if (req.user.id === record.ownerId) {
                return res.status(403).json({ message: "Forbidden" });
            }
            // const checkGuestBook = await Booking.
        }
        if (role === "guest" && req.user.id !== record.userId) {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    };
};

//? old validate spotOwner, now made polymorphic above...🤯
// const validateSpotOwner = async (req, res, next) => {
//     const { spotId } = req.params;
//     const spot = await Spot.findByPk(spotId);

//     if (spot.ownerId !== req.user.id) {
//         return res.status(403).json({ message: "Forbidden" });
//     }

//     next();
// };

//? req.body constraints
const validateReview = [
    check("review")
        .exists({ checkFalsy: true })
        .withMessage("Review text is required"),
    check("stars")
        .exists({ checkFalsy: true })
        .isInt({ min: 1, max: 5 })
        .withMessage("Stars must be an integer from 1 to 5"),
];

//? create booking - check body constraints
const validateBookingInput = [
    check("startDate")
        .isISO8601()
        //     // .isDate()
        .withMessage("Start date must be a valid date")
        .bail()
        .custom((input) => {
            const now = new Date();
            const newStart = new Date(input);

            if (newStart < now) {
                throw new Error("startDate cannot be in the past");
            }
            return true;
        }),

    check("endDate")
        .isISO8601()
        // .isDate()
        .withMessage("End date must be a valid date")
        .bail()
        .custom((input, { req }) => {
            if (input <= req.body.startDate) {
                throw new Error("endDate cannot be on or before startDate");
            }
            return true;
        })
        .custom((input) => {
            const now = new Date();
            const newStart = new Date(input);

            if (newStart < now) {
                throw new Error("endDate cannot be in the past");
            }
            return true;
        }),
];

const checkAvailability = async (req, res, next) => {
    const { startDate, endDate } = req.body;
    // const idToFind = req.params.spotId || req.params.bookingId;
    let { spotId } = req.params;
    // const idParam = req.params.spotId ? "spotId" : "id";
    const { bookingId } = req.params;

    // input start and end dates to check:
    const newStart = new Date(startDate);
    const newEnd = new Date(endDate);

    if (bookingId) {
        const booking = await Booking.findByPk(bookingId);
        spotId = booking.spotId;
    }

    // Find any booking(s) that conflict with newStart or newEnd
    const whereClause = {
        spotId: spotId,
        [Op.or]: [
            {
                startDate: {
                    [Op.lte]: newEnd,
                },
                endDate: {
                    [Op.gte]: newStart,
                },
            },
            {
                startDate: {
                    [Op.between]: [newStart, newEnd],
                },
            },
            {
                endDate: {
                    [Op.between]: [newStart, newEnd],
                },
            },
            {
                startDate: newStart,
            },
            {
                endDate: newEnd,
            },
            {
                [Op.and]: [
                    {
                        startDate: {
                            [Op.lte]: newEnd,
                        },
                    },
                    {
                        endDate: {
                            [Op.gte]: newStart,
                        },
                    },
                ],
            },
        ],
    };

    if (bookingId) {
        whereClause.id = { [Op.ne]: bookingId };
    }

    const conflictingBookings = await Booking.findAll({ where: whereClause });

    // If there are conflicting bookings, return an error
    if (conflictingBookings.length > 0) {
        const errors = {};
        conflictingBookings.forEach((booking) => {
            if (newStart < booking.startDate && newEnd > booking.endDate) {
                // errors.surroundingBooking =
                //     "Requested dates surround an existing booking.";
                errors.startDate =
                    "Start date conflicts with an existing booking";
                errors.endDate = "End date conflicts with an existing booking";
            }
            if (newStart <= booking.endDate && newStart >= booking.startDate) {
                errors.startDate =
                    "Start date conflicts with an existing booking";
            }
            if (newEnd >= booking.startDate && newEnd <= booking.endDate) {
                errors.endDate = "End date conflicts with an existing booking";
            }
        });

        // If the errors object has errors, pass them to handleValidation
        if (Object.keys(errors).length > 0) {
            const err = new Error(
                "Sorry, this spot is already booked for the specified dates"
            );
            err.status = 403;
            err.errors = errors;
            next(err); // Pass the error to the next error-handling middleware
            return; // Prevent further execution
        }
    }

    // If there are no conflicts, proceed to the next middleware
    next();
};

const queryParams = [
    check("page")
        .optional()
        .isInt({ min: 1, max: 10 })
        .withMessage("Page must be greater than or equal to 1"),
    check("size")
        .optional()
        .isInt({ min: 1, max: 20 })
        .withMessage("Size must be greater than or equal to 1"),
    check("minLat")
        .optional()
        .isInt({ min: -90, max: 90 })
        .withMessage("Minimum latitude is invalid"),
    check("maxLat")
        .optional()
        .isInt({ min: -90, max: 90 })
        .withMessage("Maximum latitude is invalid"),
    check("minLng")
        .optional()
        .isInt({ min: -180, max: 180 })
        .withMessage("Minimum longitude is invalid"),
    check("maxLng")
        .optional()
        .isInt({ min: -180, max: 180 })
        .withMessage("Maximum longitude is invalid"),
    check("minPrice")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Minimum price must be greater than or equal to 0"),
    check("maxPrice")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Maximum price must be greater than or equal to 0"),
];

module.exports = {
    handleValidationErrors,
    validateUser,
    validateSpot,
    validateId,
    validateReview,
    validateBookingInput,
    checkAvailability,
    queryParams,
};

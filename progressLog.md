# 231028

- generated models and migrations
- set associations in image.js
- modified image migration file
- set assoc in spot.js
- default values in spot migration

### next: continue model and migration updates

# 231101

got through spots, started reviews, running into error that i think has to do with onDelete: Cascade not being fully implemented. its in the models, but not migrations...

` at async /Users/vegaprime/takashiShumamira/4-Module/API-Project/backend/routes/api/spots.js:284:13 {
  name: 'SequelizeForeignKeyConstraintError',
  parent: [Error: SQLITE_CONSTRAINT: FOREIGN KEY constraint failed] {
    errno: 19,
    code: 'SQLITE_CONSTRAINT',
    sql: 'DELETE FROM`Spots`WHERE`id`= 1'
  },
  original: [Error: SQLITE_CONSTRAINT: FOREIGN KEY constraint failed] {
    errno: 19,
    code: 'SQLITE_CONSTRAINT',
    sql: 'DELETE FROM`Spots`WHERE`id`= 1'
  },
  sql: 'DELETE FROM`Spots`WHERE`id`= 1',
  parameters: {},
  table: undefined,
  fields: undefined,
  value: undefined,
  index: undefined,
  reltype: undefined
}
DELETE /api/spots/1 500 26.370 ms - 1096`

# 231103

[√] spot model is missing ownerId

# 231104

how do i modify this code? I want each error to be added to the stack, so when query gets to handlValidation errors, it prints or sends all errors at once, instead of exiting the query to print the first errors it sees:

// validate review
const validateReview = [
check("review")
.exists({ checkFalsy: true })
.withMessage("Review text is required"),
check("stars")
.exists({ checkFalsy: true })
.isInt({ min: 1, max: 5 })
.withMessage("Stars must be an integer from 1 to 5"),
];

//$ Edit Review AUTH UserId - PUT /api/reviews/:reviewId
router.put(
"/:reviewId",
requireAuth,
validateReview,
validateId(Review, "reviewId", 1),
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

# 231106:1259

trying to solve images table pgres mystery

- already changes "Images" to 'images' to just images in get all spots route. noluck
  -now using render sequelize truobleshoot pdf, added to image model:

````
id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
````
altering build command on render:
NEW:
npm install && npm run build && npm run sequelize --prefix backend db:seed:undo:all && npm run sequelize --prefix backend db:migrate:undo:all && npm run sequelize --prefix backend db:migrate && npm run sequelize --prefix backend db:seed:all

OLD:
npm install && npm run build && npm run sequelize --prefix backend db:migrate && npm run sequelize --prefix backend db:seed:all

# 231107:2127
began replacing -> `"` <- with -> `'` <- in some files, in anticipation of converting all my model names and associations to lowercase to play nice with psql. not sure if this is the right course of action, but i had a lot of grief porting to pswl and render because of model names, i think...also my options objects were all wrong, need to fix that... `/Users/vegaprime/takashiShumamira/classNotes/databases/setup.md`

### Step 3: Update Migration Files
1. Adjust create table migrations:
   ```javascript
   let options = {};
   if (process.env.NODE_ENV === 'production') {
     options.schema = process.env.SCHEMA;
   }

   // Use options in queryInterface functions
   ```
2. Alter table migrations by defining the schema within options and using it in `addColumn` or `removeColumn` methods:
   ```javascript
   let options = {
     tableName: 'YourTableName'
   };

   if (process.env.NODE_ENV === 'production') {
     options.schema = process.env.SCHEMA;
   }
   // Use options in alter table functions
   ```

### Step 4: Adjust Seeder Files
1. Update seeder files with schema information similar to migration files:
   ```javascript
   let options = {};
   if (process.env.NODE_ENV === 'production') {
     options.schema = process.env.SCHEMA;
   }

   // Use options in queryInterface functions for seeders
   ```

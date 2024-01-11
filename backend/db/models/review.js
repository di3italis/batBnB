"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Review extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Review.belongsTo(models.Spot, {
                foreignKey: "spotId",
                onDelete: "CASCADE",
            });
            Review.belongsTo(models.User, {
                foreignKey: "userId",
                onDelete: "CASCADE",
            });
            Review.hasMany(models.Image, {
                as: "ReviewImages",
                foreignKey: "imageableId",
                onDelete: "cascade",
                constraints: false,
                scope: {
                    imageableType: "Review",
                },
            });
        }
    }
    Review.init(
        {
            spotId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Spots",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Users",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            review: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            stars: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1,
                    max: 5,
                },
            },
        },
        {
            sequelize,
            modelName: "Review",
        }
    );
    return Review;
};

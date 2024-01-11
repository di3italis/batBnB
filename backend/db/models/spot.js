"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Spot extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Spot.belongsTo(models.User, {
                as: "Owner",
                foreignKey: "ownerId",
                onDelete: "CASCADE",
            });

            Spot.hasMany(models.Booking, {
                foreignKey: "spotId",
                onDelete: "cascade",
            });

            Spot.hasMany(models.Review, {
                foreignKey: "spotId",
                onDelete: "cascade",
            });

            Spot.hasMany(models.Image, {
                as: "SpotImages",
                foreignKey: "imageableId",
                onDelete: "cascade",
                constraints: false,
                scope: {
                    imageableType: "Spot",
                },
            });
        }
    }
    Spot.init(
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            ownerId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Users",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            address: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            city: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            state: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            country: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            lat: {
                type: DataTypes.FLOAT,
                allowNull: false,
                validate: {
                    isFloat: true,
                    min: -90,
                    max: 90,
                },
            },
            lng: {
                type: DataTypes.FLOAT,
                allowNull: false,
                validate: {
                    isFloat: true,
                    min: -180,
                    max: 180,
                },
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [0, 50],
                },
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            price: {
                type: DataTypes.FLOAT,
                allowNull: false,
                validate: {
                    isFloat: true,
                    min: 0,
                },
            },
        },
        {
            sequelize,
            modelName: "Spot",
        }
    );
    return Spot;
};

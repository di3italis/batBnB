"use strict";
const { Model, Validator } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            // define association here
            User.hasMany(models.Spot, {
                foreignKey: "ownerId",
                // onDelete: 'cascade',
            });
            User.hasMany(models.Booking, {
                foreignKey: "userId",
                // onDelete: 'cascade',
            });
            User.hasMany(models.Review, {
                foreignKey: "userId",
                // onDelete: 'cascade',
            });
            User.hasMany(models.Image, {
                as: "Images",
                foreignKey: "imageableId",
                // onDelete: 'cascade',
                constraints: false,
                scope: {
                    imageableType: "User",
                },
            });
        }
    }

    User.init(
        {
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    len: [4, 30],
                    isNotEmail(value) {
                        if (Validator.isEmail(value)) {
                            throw new Error("Cannot be an email.");
                        }
                    },
                },
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    len: [3, 256],
                    isEmail: true,
                },
            },
            hashedPassword: {
                type: DataTypes.STRING.BINARY,
                allowNull: false,
                validate: {
                    len: [60, 60],
                },
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "User",
            // tableName: "users",
            defaultScope: {
                // see notes on scope https://www.notion.so/cactus-pants/express-sequelize-psql-530ae53d363e417896e5fd1f2a2a80fb?pvs=4#21661a26ede4483d9ea247e493206e23
                attributes: {
                    exclude: [
                        "hashedPassword",
                        "email",
                        "createdAt",
                        "updatedAt",
                    ],
                },
            },
        }
    );
    return User;
};

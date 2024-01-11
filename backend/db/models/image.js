"use strict";
/** @type {import('sequelize-cli').Migration} */
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Image extends Model {
        getImageable(options) {
            if (!this.imageableType) return Promise.resolve(null);
            const mixinMethodName = `get${this.imageableType}`; // getUser or getSpot or getReview
            return this[mixinMethodName](options);
        }

        static associate(models) {
            Image.belongsTo(models.User, {
                as: 'User',
                foreignKey: "imageableId",
                constraints: false,
                onDelete: "CASCADE",
            });
            Image.belongsTo(models.Spot, {
                as: 'Spot',
                foreignKey: "imageableId",
                constraints: false,
                onDelete: "CASCADE",
            });
            Image.belongsTo(models.Review, {
                as: 'Review',
                foreignKey: "imageableId",
                constraints: false,
                onDelete: "CASCADE",
            });
        }
    }
    Image.init(
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            imageableType: {
                type: DataTypes.ENUM("User", "Spot", "Review"),
                allowNull: false,
            },
            imageableId: {
                type: DataTypes.INTEGER,
                allowNull: false, //? need this?
            },
            url: {
                type: DataTypes.STRING,
                allowNull: false, //? need this?
            },
            preview: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Image",
            tableName: "Images",
        }
    );
    return Image;
};

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Booking extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Booking.belongsTo(models.Spot, {
                foreignKey: "spotId",
                onDelete: "CASCADE",
            });
            Booking.belongsTo(models.User, {
                foreignKey: "userId",
                onDelete: "CASCADE",
            });
        }
    }
    Booking.init(
        {
            spotId: {
                allowNul: false,
                type: DataTypes.INTEGER,
                references: { model: "Spots", key: "id" }, // maybe use aliases?
            },
            userId: {
                allowNul: false,
                type: DataTypes.INTEGER,
                references: { model: "Users", key: "id" },
            },
            startDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            endDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Booking",
        }
    );
    return Booking;
};

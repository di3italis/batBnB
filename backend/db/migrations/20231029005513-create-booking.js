"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(
            "Bookings",
            {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },
                spotId: {
                    allowNull: false,
                    type: Sequelize.INTEGER,
                    references: { model: "Spots", key: "id" },
                    onDelete: "CASCADE",
                },
                userId: {
                    allowNull: false,
                    type: Sequelize.INTEGER,
                    references: { model: "Users", key: "id" },
                    onDelete: "CASCADE",
                },
                startDate: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
                endDate: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
                createdAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.NOW,
                },
                updatedAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.NOW,
                },
            },
            options
        );
    },
    async down(queryInterface, Sequelize) {
        options.tableName = "Bookings";
        return queryInterface.dropTable(options);
    },
};

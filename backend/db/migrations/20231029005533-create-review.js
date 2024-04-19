"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(
            "Reviews",
            {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },
                userId: {
                    allowNull: false,
                    type: Sequelize.INTEGER,
                    references: { model: "Users", key: "id" },
                    onDelete: "CASCADE",
                },
                spotId: {
                    allowNull: false,
                    type: Sequelize.INTEGER,
                    references: { model: "Spots", key: "id" },
                    onDelete: "CASCADE",
                },
                review: {
                    type: Sequelize.TEXT,
                    allowNull: false,
                },
                stars: {
                    type: Sequelize.INTEGER,
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
        options.tableName = "Reviews";
        return queryInterface.dropTable(options);
    },
};

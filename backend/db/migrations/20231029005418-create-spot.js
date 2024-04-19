"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(
            "Spots",
            {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },
                ownerId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                        model: "Users",
                        key: "id",
                    },
                    onDelete: "CASCADE",
                },
                address: {
                    type: Sequelize.STRING,
                },
                city: {
                    type: Sequelize.STRING,
                },
                state: {
                    type: Sequelize.STRING,
                },
                country: {
                    type: Sequelize.STRING,
                },
                lat: {
                    type: Sequelize.FLOAT,
                },
                lng: {
                    type: Sequelize.FLOAT,
                },
                name: {
                    type: Sequelize.STRING,
                },
                description: {
                    type: Sequelize.TEXT,
                },
                price: {
                    type: Sequelize.FLOAT,
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
        options.tableName = "Spots";
        return queryInterface.dropTable(options);
    },
};

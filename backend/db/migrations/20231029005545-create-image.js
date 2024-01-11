"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(
            "Images",
            {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },
                imageableType: {
                    type: Sequelize.STRING,
                },
                imageableId: {
                    type: Sequelize.INTEGER,
                },
                url: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                preview: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
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
        options.tableName = "Images";
        return queryInterface.dropTable(options);
    },
};

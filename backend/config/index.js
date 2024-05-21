// console.log('************', process.env.DB_FILE);
module.exports = {
    environment: process.env.NODE_ENV || "development",
    port: process.env.PORT || 8000,
    dbFile: process.env.DB_FILE || "db/dev.db",
    jwtConfig: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
    },
};

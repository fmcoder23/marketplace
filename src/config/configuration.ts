export const Configuration = () => ({
    app: {
        port: parseInt(process.env.PORT, 10),
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expiration: process.env.JWT_EXPIRATION,
    },
    database: {
        url: process.env.DATABASE_URL,
    },
    swagger: {
        username: process.env.SWAGGER_USERNAME,
        password: process.env.SWAGGER_PASSWORD,
    },
});

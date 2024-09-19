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
    r2: {
        bucket: process.env.R2_BUCKET,
        endpoint: process.env.R2_ENDPOINT,
        accessKey: process.env.R2_ACCESS_KEY,
        secretKey: process.env.R2_SECRET_KEY,
        publicUrl: process.env.R2_PUBLIC_URL,
    }
});

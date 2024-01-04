import * as  dotenv from 'dotenv'
dotenv.config();

const envconfig = {
    PASS_CODE :process.env.appPassword,
    SECRET_KEY : process.env.secretKey,
    DB_URL: process.env.dbUrl,
    EMAIL_HOST: process.env.emailHost,
    EMAIL_PORT: process.env.emailPort,
    EMAIL_USER: process.env.emailUser,
    EMAIL_PASS: process.env.appPassword,
    API_KEY:process.env.apiKey,
    API_SECRET:process.env.apiSecret,
    CLOUD_NAME:process.env.cloudName,
}

export default envconfig;
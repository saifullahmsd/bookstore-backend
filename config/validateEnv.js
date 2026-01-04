const { cleanEnv, str, port } = require("envalid");

const env = cleanEnv(process.env, {
    MONGO_URI: str(),
    JWT_SECRET: str(),
    PORT: port({ default: 5000 }),
    NODE_ENV: str({ choices: ['development', 'production', 'test'], default: 'development' })
});

module.exports = env;
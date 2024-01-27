const redis = require("redis");

let client;

(async () => {
    client = redis.createClient({
        host: process.env.REDIS_URI,
        port: process.env.REDIS_PORT
    });

    client.on("error", (error) => console.error(`Error : ${error}`));

    await client.connect();
})();

const setValue = async (key, value, expiryInSeconds = 30 * 60) => {
    await client.set(key, value, expiryInSeconds);
};

const getValue = async (key) => {
    const value = await client.get(key);
    return value;
};

const deleteKey = async (key) => {
    await client.del(key);
};

module.exports = {
    setValue,
    getValue,
    deleteKey,
};
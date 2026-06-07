const redis = require("redis");

// const client = redis.createClient();

const client = redis.createClient({
    socket: {
        host: "127.0.0.1",
        port: 6379,
    },
    RESP: 2,
});

client.on("connect", () => console.log("Redis connected ⚡"));
client.on("error", (err) => console.log("Redis error:", err));

client.connect(); // no await needed here in most cases

module.exports = client;
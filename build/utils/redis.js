import { Redis } from "ioredis";
class CacheRedis extends Redis {
    static _instance;
    constructor() {
        super();
    }
    static getInstance(connectionConfig) {
        if (this._instance) {
            return this._instance;
        }
        this._instance = new Redis(connectionConfig);
        console.log("connected to Redis");
        return this._instance;
    }
}
const redis = CacheRedis.getInstance({
    host: process.env.REDIS_URL,
    port: +process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
});
export { redis };

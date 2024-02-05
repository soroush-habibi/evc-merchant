import { Redis } from "ioredis";

interface ICache {
    host: string;
    port: number;
    password: string;
}

class CacheRedis extends Redis {
    private static _instance: Redis;

    private constructor() {
        super();
    }

    static getInstance<T extends Partial<ICache>>(connectionConfig: T) {
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
    port: +process.env.REDIS_PORT!,
    password: process.env.REDIS_PASSWORD
});

export { redis };
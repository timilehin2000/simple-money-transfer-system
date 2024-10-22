import { createClient } from 'redis';

const redisClient = createClient();

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

redisClient.connect();

export default redisClient;

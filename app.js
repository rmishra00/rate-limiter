const express = require('express');
const {connectRedis}= require('./redisClient');

const app = express();
const RedisTokenBucketRateLimiter = require('./redislimiters/RedisTokenBucketRateLimiter');
const createRateLimiterMiddleware = require('./middleware/rateLimiterMiddleware');
const limiter = new RedisTokenBucketRateLimiter(10,2,8400);

app.use(createRateLimiterMiddleware(limiter));

app.get('/hello', (req, res) => {
  res.send("Welcome");
})
async function startServer(){
  await connectRedis();
  app.listen(3000, () => {
  console.log("Server is running at 3000");
})
}
startServer();

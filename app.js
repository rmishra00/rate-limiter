const express = require('express');
const {connectRedis}= require('./redisClient');

// const rateLimiterMiddleware = require('./middleware/rateLimiterMiddleware');
const app = express();

// const redisRateLimiterMiddleware = require('./middleware/redisFixedWindowRateLimiterMiddleware');
// const redisRateLimiterMiddleware = require('./middleware/redisTokenBucketRateLimiterMiddleware')

const redisRateLimiterMiddleware = require('./middleware/redisSlidingWindowRateLimiter');
// app.use(rateLimiterMiddleware);
app.use(redisRateLimiterMiddleware);

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

const express = require('express');
const {connectRedis}= require('./redisClient');

const rateLimiterMiddleware = require('./rateLimiterMiddleware');
const app = express();

app.use(rateLimiterMiddleware);
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

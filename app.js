const express = require('express');
const app = express();

const requestTracker = new Map();
function rateLimiter(req, res, next) {

  const ip = req.ip;
  if (!requestTracker.has(ip)) {
    requestTracker.set(ip, {
      count: 1,
      startTime: Date.now()
    }
    )
    return next();
  }
  const user = requestTracker.get(ip);
  const now = Date.now();
  const LIMIT = 5;
  const WINDOW = 60 * 1000;
  if (now - user.startTime > WINDOW) {
    count = 1,
      startTime = now;
    return next();
  }
  if (user.count > LIMIT) {
    return res.status(429).json({
      message: "Too many requests"
    })
  } else {
    console.log({
      ip,
      count: user?.count,
      mapSize: requestTracker.size
    });
    user.count++;
    next();
  }
      
}
app.use(rateLimiter);
app.get('/hello', (req, res) => {
  res.send("Welcome");

})
app.listen(3000, () => {
  console.log("Server is running at 3000");
})
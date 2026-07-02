class SlidingWindowRateLimiter{
  constructor(limit,windowMs){
    this.limit = limit;
    this.windowMs = windowMs;
    this.requestTracker = new Map();
  }
  allowRequest(ip){
    const now = Date.now();
    if(!this.requestTracker.has(ip)){
      const user = {
        timestamps:[now]
    }
    this.requestTracker.set(ip, user);
    return {
      allowed:true,
      remaining:this.limit-user.timestamps.length
    }
  }
  const user = this.requestTracker.get(ip);
  const validTime = now - this.windowMs;
  user.timestamps = user.timestamps.filter(timestamp => timestamp>validTime);
  if(user.timestamps.length >= this.limit){
    return{
      allowed:false,
      remaining:0
    }
  }
  user.timestamps.push(now);
  return{
    allowed:true,
    remaining:this.limit-user.timestamps.length
  }
}
}
module.exports = SlidingWindowRateLimiter;
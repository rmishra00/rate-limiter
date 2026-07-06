 local limit = tonumber(ARGV[1]);
 local currentTime = tonumber(ARGV[2]);
 local windowSize = tonumber(ARGV[3]);
 local ttl = tonumber(ARGV[4]);
 local member = ARGV[5];

 local windowStartTime = currentTime - windowSize;
 redis.call( "ZREMRANGEBYSCORE", KEYS[1], "-inf", "("..windowStartTime);
 local count = redis.call("ZCARD", KEYS[1]);
 if(count>=limit) then
  return -1;

redis.call("ZADD", KEYS[1],currentTime, member);

redis.call("EXPIRE", KEYS[1], ttl);

return limit - count -1;
 

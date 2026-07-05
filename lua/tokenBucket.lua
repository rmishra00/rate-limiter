local bucket = redis.call(
  "HMGET",
  KEYS[1],
  "tokens",
  "lastRefillTime"
)
local tokens = bucket[1]
local capacity = tonumber(ARGV[1])
local refillRate = tonumber(ARGV[2])
local currentTime = tonumber(ARGV[3])
local lastRefillTime = tonumber(bucket[2])
local ttl = tonumber(ARGV[4])

if not tokens then
  redis.call(
    "HSET",
    KEYS[1],
    "tokens",
    capacity-1,
    "lastRefillTime",
    currentTime
  )
      redis.call("EXPIRE", KEYS[1], ttl)
  return capacity-1
end
 
  tokens = tonumber(tokens) 
  local timePassed = currentTime - lastRefillTime
  redis.call(
    "HSET",
    KEYS[1],
    "debugTimePassed",
    timePassed
)
  local tokensToAdd = timePassed * refillRate
  tokens = math.min(capacity, tokens+tokensToAdd)
  redis.call(
    "HSET",
    KEYS[1],
    "debugTokens",
    tokens
)
if tokens >= 1 then
  tokens = tokens-1
  redis.call(
    "HSET",
    KEYS[1],
    "tokens",
    tokens, 
    "lastRefillTime", 
    currentTime)
    redis.call("EXPIRE", KEYS[1], ttl)
  return tokens
end
redis.call(
  "HSET", 
  KEYS[1], 
  "tokens", 
  tokens, 
  "lastRefillTime", 
  currentTime)
      redis.call("EXPIRE", KEYS[1], ttl)
return -1

  
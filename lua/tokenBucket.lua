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

if not tokens then
  redis.call(
    "HSET",
    KEYS[1],
    "tokens",
    capacity-1,
    "lastRefillTime",
    currentTime
  )
  return capacity-1
end
 
  tokens = tonumber(tokens) 
  local timePassed = currentTime - lastRefillTime
  local tokensToAdd = timePassed * refillRate
  tokens = math.min(capacity, tokens+tokensToAdd)
if tokens >= 1 then
  tokens = tokens-1
  redis.call(
    "HSET",
    KEYS[1],
    "tokens",
    tokens, 
    "lastRefillTime", 
    currentTime)
  return tokens
end
redis.call(
  "HSET", 
  KEYS[1], 
  "tokens", 
  tokens, 
  "lastRefillTime", 
  currentTime)
return -1

  
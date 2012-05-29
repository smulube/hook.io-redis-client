# hook.io-redis

Hook.io Redis is a client-wrapper around [node_redis](https://github.com/mranney/node_redis) 
for interacting with a Redis instance.

## Installation

    git clone git@github.com:smulube/hook.io-redis-client.git
    cd hook.io-redis-client
    npm install
    node bin/redis-client

### Using NPM

    npm install hook.io-redis-client
    hook.io-redis-client --debug

Note, using the default options hookio-redis-client will attempt to connect to
Redis running on localhost on port 6379.

## Hook Event Names

### Event listeners

**redis::exec** *{command, params}* - exec a single Redis command and pass result to callback

**redis::multi** *array* - array of command tuples to execute as single transaction

### Event emitters

**redis::connect** - event emitted when the hook is connected to Redis

**redis::ready** - event emitted when the Redis is ready to start receiving commands

**redis::error** - event emitted on an error when interacting with Redis.

**redis::end** - event emitted if Redis shuts down

# hook.io-redis

Hook.io Redis is a client-wrapper around
[node_redis](https://github.com/mranney/node_redis) for interacting with a
Redis server. Any command passed into the hook will be sent on to Redis, but
this probably makes most sense in the context of persisting data into Redis,
rather than reading it out.

For a hook for using Redis pubsub messages to emit events, please see
[hook.io-redis](https://github.com/stephanepericat/hookio-redis).

## Disclaimer

This is a very early release, and is currently lacking several important
features (not least tests), so will probably break unpleasantly if you try and
use it.

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

**redis::client::exec** *command* - exec a single Redis command and pass result to callback.

**redis::client::multi** *array* - array of command objects to execute within a single multi transaction

### Event emitters

**redis::client::connect** - event emitted when the hook is connected to Redis

**redis::client::ready** - event emitted when the Redis is ready to start receiving commands

**redis::client::error** - event emitted on an error when interacting with Redis.

**redis::client::end** - event emitted if Redis shuts down

## Command object

Currently commands are sent to Redis as objects like this:

    {
      command: "lpush",
      params: [ "key", "value" ]
    }

or

    {
      command: "ltrim",
      params: [ "key", 0, 20 ]
    }

That is: the Redis command we are trying to execute, followed by an array of
parameters. Parameters should match what the server is expecting or bad things
will happen.

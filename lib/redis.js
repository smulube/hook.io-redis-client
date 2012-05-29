
var Hook = require('hook.io').Hook,
    util = require('util'),
    redis = require('redis');

var RedisHook = exports.RedisHook = function(options){
  var self = this;

  Hook.call(this, options);

  self.options = options;

  self.on('hook::ready', function(){
    self._start();
  });
};

util.inherits(RedisHook, Hook);

RedisHook.prototype._start = function() {
  var self = this;

  var client = redis.createClient(self.options.redis.port,
                                  self.options.redis.host,
                                  self.options.redis.options);

  client.on("connect", function() {
    self.emit('redis::connect');
  });

  client.on("error", function() {
    self.emit('redis::error');
  });

  client.on("end", function() {
    self.emit('redis::end');
  });

  client.on("ready", function() {
    self.emit('redis::ready');

    // Start listening for incoming events
    self.on('*::redis::exec', function(command, callback) {
      self._exec(command, callback);
    });

    self.on('*::redis::multi', function(commands, callback) {
      self._multi(commands, callback);
    });
  });
};

RedisHook.prototype._exec = function(command, callback) {
  var self = this;
  console.log("redis::exec");
};

RedisHook.prototype._multi = function(commands, callback) {
  var self = this;
  console.log("redis::multi");
};

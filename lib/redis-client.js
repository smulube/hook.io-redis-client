
var Hook = require('hook.io').Hook,
    util = require('util'),
    redis = require('redis');

var RedisClientHook = exports.RedisClientHook = function(options){
  var self = this;

  Hook.call(this, options);

  self.options = options;

  if (typeof(self.options.redis_client) === "string") {
    self.options.redis_client = JSON.parse(self.options.redis_client);
  }

  self.on('hook::ready', function(){
    self._start();
  });
};

util.inherits(RedisClientHook, Hook);

RedisClientHook.prototype._start = function() {
  var self = this;

  var client = redis.createClient(self.options.redis_client.port,
                                  self.options.redis_client.host,
                                  self.options.redis_client.options);

  client.on("connect", function() {
    self.emit('redis::client::connect');
  });

  client.on("error", function() {
    self.emit('redis::client::error');
  });

  client.on("end", function() {
    self.emit('redis::client::end');
  });

  client.on("ready", function() {
    self.emit('redis::client::ready');
  });

  // Start listening for incoming events
  self.on('*::redis::client::exec', function(data, callback) {
    self._exec(client, data, callback);
  });

  self.on('*::redis::client::multi', function(data, callback) {
    self._multi(client, data, callback);
  });
};

RedisClientHook.prototype._exec = function(client, data, callback) {
  var self = this,
      command = data.command,
      params = data.params;

  try {
    client[command](params, function(error, result) {

      if (error) {
        self._error(error);
        callback(error, null);
        return;
      }

      callback(null, result);
    });
  } catch(exception) {
    self._error(exception);
  }
};

RedisClientHook.prototype._multi = function(client, data, callback) {
  var self = this,
      commands = data.commands;

  try {
    var multi = client.multi();

    for(var i = 0; i < commands.length; i++) {
      multi[commands[i].command](commands[i].params);
    }

    multi.exec(function(error, results) {
      if (error) {
        self._error(error);
        callback(error, null);
        return;
      }

      callback(null, results);
    });
  } catch(exception) {
    self._error(exception);
  }
};

RedisClientHook.prototype._error = function(err) {
  var self = this;
  self.emit('redis::client::error', err);
};

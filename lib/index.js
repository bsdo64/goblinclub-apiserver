var fs = require('fs');
var path = require('path');

function Goblin() {
  var args = Array.prototype.slice.call(arguments);
  var callback = args.pop();
  var modules = (args[0] && typeof args[0] === 'string') ? args : args[0];
  var i;

  if (!(this instanceof Goblin)) {
    return new Goblin(modules, callback);
  }

  this.a = 1;
  this.b = 2;

  if (!modules || modules === '*' || modules[0] === '*') {
    modules = [];
    for (i in Goblin.modules) {
      if (Goblin.modules.hasOwnProperty(i)) {
        modules.push(i);
      }
    }
  }

  for (i = 0; i < modules.length; i = i + 1) {
    Goblin.modules[modules[i]](this);
  }

  callback(this);
}

Goblin.modules = {};

fs
  .readdirSync(path.join(__dirname, './module'))
  .filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js');
  })
  .forEach(function (file) {
    var module, moduleName;

    function imports(fullPath) {
      var defineCall = require(fullPath);
      return defineCall();
    }
    module = imports(path.join(__dirname, './module', file));
    moduleName = path.basename(file, '.js');
    Goblin.modules[moduleName] = module;
  });

Goblin.prototype = {
  name: 'GoblinClub',
  version: '1.0'
};

module.exports = Goblin;

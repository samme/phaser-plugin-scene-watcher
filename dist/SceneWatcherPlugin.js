(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'phaser'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('phaser'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.Phaser);
    global.main = mod.exports;
  }
})(this, function (exports, _phaser) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _phaser2 = _interopRequireDefault(_phaser);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var Pad = _phaser2.default.Utils.String.Pad;
  var ICON_DEFAULT = ' ';
  var ICON_PAUSED = '.';
  var ICON_RUNNING = '*';
  var ICON_SLEEPING = '-';
  var NEWLINE = '\n';
  var PAD_LEFT = 1;
  var PAD_RIGHT = 2;
  var EVENTS = ['boot', 'pause', 'resume', 'sleep', 'wake', 'start', 'ready', 'shutdown', 'destroy'];
  var SPACE = ' ';
  var STATES = ['pending', 'init', 'start', 'loading', 'creating', 'running', 'paused', 'sleeping', 'shutdown', 'destroyed'];
  var VIEW_STYLE = {
    position: 'absolute',
    left: '0',
    top: '0',
    margin: '0',
    padding: '0',
    width: '20em',
    fontSize: '16px',
    lineHeight: '20px',
    backgroundColor: 'rgba(0,0,0,0.875)',
    color: 'white',
    pointerEvents: 'none'
  };

  var getIcon = function getIcon(scene) {
    switch (scene.sys.settings.status) {
      case _phaser2.default.Scenes.RUNNING:
        return ICON_RUNNING;
      case _phaser2.default.Scenes.SLEEPING:
        return ICON_SLEEPING;
      case _phaser2.default.Scenes.PAUSED:
        return ICON_PAUSED;
      default:
        return ICON_DEFAULT;
    }
  };

  var getStatus = function getStatus(scene) {
    return STATES[scene.sys.settings.status];
  };

  var getDisplayListLength = function getDisplayListLength(scene) {
    return scene.sys.updateList._list.length;
  };

  var getUpdateListLength = function getUpdateListLength(scene) {
    return scene.sys.displayList.length;
  };

  var SceneWatcherPlugin = function (_Phaser$Plugins$BaseP) {
    _inherits(SceneWatcherPlugin, _Phaser$Plugins$BaseP);

    function SceneWatcherPlugin(pluginManager) {
      _classCallCheck(this, SceneWatcherPlugin);

      var _this = _possibleConstructorReturn(this, (SceneWatcherPlugin.__proto__ || Object.getPrototypeOf(SceneWatcherPlugin)).call(this, pluginManager));

      _this.eventHandlers = {};
      return _this;
    }

    _createClass(SceneWatcherPlugin, [{
      key: 'init',
      value: function init() {
        this.view = document.createElement('pre');
        Object.assign(this.view.style, VIEW_STYLE);
        this.game.canvas.parentNode.append(this.view);

        EVENTS.forEach(function (eventName) {
          this.eventHandlers[eventName] = function (sys) {
            console.log(eventName, sys.settings.key);
          };
        }, this);
      }
    }, {
      key: 'start',
      value: function start() {
        this.game.events.on('poststep', this.postStep, this);
      }
    }, {
      key: 'stop',
      value: function stop() {
        this.game.events.off('poststep', this.postStep, this);
      }
    }, {
      key: 'destroy',
      value: function destroy() {
        this.view.parentNode.remove(this.view);
        delete this.view;
        _phaser2.default.Plugins.BasePlugin.call(this);
      }
    }, {
      key: 'postStep',
      value: function postStep() {
        this.view.textContent = this.getOutput();
      }
    }, {
      key: 'getOutput',
      value: function getOutput() {
        return this.game.scene.scenes.map(this.getSceneOutput, this).join(NEWLINE);
      }
    }, {
      key: 'getSceneOutput',
      value: function getSceneOutput(scene) {
        var settings = scene.sys.settings;

        return Pad(settings.key.substr(0, 12), 12, SPACE, PAD_LEFT) + SPACE + getIcon(scene) + SPACE + Pad(getStatus(scene) || '?', 8, SPACE, PAD_RIGHT) + Pad(getDisplayListLength(scene), 4, SPACE, PAD_LEFT) + Pad(getUpdateListLength(scene), 4, SPACE, PAD_LEFT);
      }
    }, {
      key: 'watchAll',
      value: function watchAll() {
        this.game.scene.scenes.forEach(this.watch, this);
      }
    }, {
      key: 'watch',
      value: function watch(scene) {
        for (var eventName in this.eventHandlers) {
          scene.events.on(eventName, this.eventHandlers[eventName], this);
        }
      }
    }]);

    return SceneWatcherPlugin;
  }(_phaser2.default.Plugins.BasePlugin);

  exports.default = SceneWatcherPlugin;


  _phaser2.default.Plugins.SceneWatcherPlugin = SceneWatcherPlugin;
});

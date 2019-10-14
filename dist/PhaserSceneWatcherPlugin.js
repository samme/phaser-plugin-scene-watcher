(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('phaser-plugin-scene-watcher', ['exports', 'phaser'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('phaser'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.Phaser);
    global.phaserPluginSceneWatcher = mod.exports;
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

  var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;
    var desc = Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        return get(parent, property, receiver);
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;

      if (getter === undefined) {
        return undefined;
      }

      return getter.call(receiver);
    }
  };

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

  var _ICONS;

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var Pad = _phaser2.default.Utils.String.Pad;
  var ICON_DEFAULT = ' ';
  var ICON_PAUSED = '.';
  var ICON_RUNNING = '*';
  var ICON_SLEEPING = '-';
  var NEWLINE = '\n';
  var PAD_LEFT = 1;
  var PAD_RIGHT = 2;
  var SCENE_EVENTS = [_phaser2.default.Scenes.Events.BOOT, _phaser2.default.Scenes.Events.CREATE, _phaser2.default.Scenes.Events.DESTROY, _phaser2.default.Scenes.Events.PAUSE, _phaser2.default.Scenes.Events.READY, _phaser2.default.Scenes.Events.RESUME, _phaser2.default.Scenes.Events.SHUTDOWN, _phaser2.default.Scenes.Events.SLEEP, _phaser2.default.Scenes.Events.START, _phaser2.default.Scenes.Events.WAKE].filter(Boolean);
  var SCENE_TRANSITION_EVENTS = [_phaser2.default.Scenes.Events.TRANSITION_COMPLETE, _phaser2.default.Scenes.Events.TRANSITION_INIT, _phaser2.default.Scenes.Events.TRANSITION_OUT, _phaser2.default.Scenes.Events.TRANSITION_START, _phaser2.default.Scenes.Events.TRANSITION_WAKE].filter(Boolean);
  var SCENE_STATES = ['pending', 'init', 'start', 'loading', 'creating', 'running', 'paused', 'sleeping', 'shutdown', 'destroyed'];
  var SPACE = ' ';
  var VIEW_STYLE = {
    position: 'absolute',
    left: '0',
    top: '0',
    margin: '0',
    padding: '0',
    width: '20em',
    fontSize: '16px',
    lineHeight: '20px',
    backgroundColor: 'rgba(0,0,0,0.8)',
    color: 'white',
    pointerEvents: 'none'
  };
  var VIEW_TITLE = 'Scene key; status, display list length; update list length';
  var ICONS = (_ICONS = {}, _defineProperty(_ICONS, _phaser2.default.Scenes.RUNNING, ICON_RUNNING), _defineProperty(_ICONS, _phaser2.default.Scenes.SLEEPING, ICON_SLEEPING), _defineProperty(_ICONS, _phaser2.default.Scenes.PAUSED, ICON_PAUSED), _ICONS);

  var getIcon = function getIcon(scene) {
    return ICONS[scene.sys.settings.status] || ICON_DEFAULT;
  };

  var getStatus = function getStatus(scene) {
    return SCENE_STATES[scene.sys.settings.status];
  };

  var getDisplayListLength = function getDisplayListLength(scene) {
    return scene.sys.updateList.length;
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
      _this.transitionEventHandlers = {};
      _this.output = '';
      return _this;
    }

    _createClass(SceneWatcherPlugin, [{
      key: 'init',
      value: function init() {
        this.view = document.createElement('pre');
        // Doesn't show tooltip w/ { pointer-events: none }
        this.view.title = VIEW_TITLE;
        Object.assign(this.view.style, VIEW_STYLE);
        this.game.canvas.parentNode.append(this.view);

        SCENE_EVENTS.forEach(this.createEventHandler, this);

        SCENE_TRANSITION_EVENTS.forEach(this.createTransitionEventHandler, this);
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
        this.unwatchAll();
        this.view.remove();
        this.view = null;
        _get(SceneWatcherPlugin.prototype.__proto__ || Object.getPrototypeOf(SceneWatcherPlugin.prototype), 'destroy', this).call(this);
      }
    }, {
      key: 'postStep',
      value: function postStep() {
        var output = this.getOutput();

        if (output !== this.output) {
          this.view.textContent = output;
          this.output = output;
        }
      }
    }, {
      key: 'createEventHandler',
      value: function createEventHandler(name) {
        this.eventHandlers[name] = function (arg) {
          var sys = arg.sys || arg;

          console.log(sys.settings.key, name);
        };
      }
    }, {
      key: 'createTransitionEventHandler',
      value: function createTransitionEventHandler(name) {
        this.transitionEventHandlers[name] = function (scene) {
          console.log(scene.sys.settings.key, name);
        };
      }
    }, {
      key: 'getOutput',
      value: function getOutput() {
        return this.game.scene.scenes.map(this.getSceneOutput, this).join(NEWLINE);
      }
    }, {
      key: 'getSceneOutput',
      value: function getSceneOutput(scene) {
        return SPACE + getIcon(scene) + SPACE + Pad(scene.sys.settings.key.substr(0, 12), 12, SPACE, PAD_RIGHT) + Pad(getStatus(scene), 8, SPACE, PAD_RIGHT) + Pad(getDisplayListLength(scene), 4, SPACE, PAD_LEFT) + Pad(getUpdateListLength(scene), 4, SPACE, PAD_LEFT);
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

        for (var _eventName in this.transitionEventHandlers) {
          scene.events.on(_eventName, this.transitionEventHandlers[_eventName], this);
        }
      }
    }, {
      key: 'unwatchAll',
      value: function unwatchAll() {
        this.game.scene.scenes.forEach(this.unwatch, this);
      }
    }, {
      key: 'unwatch',
      value: function unwatch(scene) {
        for (var eventName in this.eventHandlers) {
          scene.events.off(eventName, this.eventHandlers[eventName], this);
        }
      }
    }]);

    return SceneWatcherPlugin;
  }(_phaser2.default.Plugins.BasePlugin);

  exports.default = SceneWatcherPlugin;


  if (typeof window !== 'undefined') {
    window.PhaserSceneWatcherPlugin = SceneWatcherPlugin;
  }
});

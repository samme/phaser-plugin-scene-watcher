import Phaser from 'phaser';

var Pad = Phaser.Utils.String.Pad;
var ICON_OTHER = ' ';
var ICON_PAUSED = '.';
var ICON_RUNNING = '*';
var ICON_SLEEPING = '-';
var ICON_ACTIVE = 'a';
var ICON_VISIBLE = 'v';
var ICON_TRANSITIONING = 't';
var ICON_INPUT = 'i';
var ICON_KEYBOARD = 'k';
var NEWLINE = '\n';
var EMPTY = '';
var PAD_LEFT = 1;
var PAD_RIGHT = 2;
var ALIGN_LEFT = PAD_RIGHT;
var ALIGN_RIGHT = PAD_LEFT;
var SCENE_EVENTS = [
  Phaser.Scenes.Events.BOOT,
  Phaser.Scenes.Events.CREATE,
  Phaser.Scenes.Events.DESTROY,
  Phaser.Scenes.Events.PAUSE,
  Phaser.Scenes.Events.READY,
  Phaser.Scenes.Events.RESUME,
  Phaser.Scenes.Events.SHUTDOWN,
  Phaser.Scenes.Events.SLEEP,
  Phaser.Scenes.Events.START,
  Phaser.Scenes.Events.WAKE
].filter(Boolean);
var SCENE_TRANSITION_EVENTS = [
  Phaser.Scenes.Events.TRANSITION_COMPLETE,
  Phaser.Scenes.Events.TRANSITION_INIT,
  Phaser.Scenes.Events.TRANSITION_OUT,
  Phaser.Scenes.Events.TRANSITION_START,
  Phaser.Scenes.Events.TRANSITION_WAKE
].filter(Boolean);
var SCENE_STATES = {
  0: 'pending',
  1: 'init',
  2: 'start',
  3: 'loading',
  4: 'creating',
  5: 'running',
  6: 'paused',
  7: 'sleeping',
  8: 'shutdown',
  9: 'destroyed'
};
var SPACE = ' ';
var VIEW_STYLE = {
  position: 'absolute',
  left: '0',
  top: '0',
  margin: '0',
  padding: '0',
  width: '30em',
  fontSize: '16px',
  lineHeight: '20px',
  backgroundColor: 'rgba(0,0,0,0.8)',
  color: 'white',
  pointerEvents: 'none'
};
var ICONS = {};
ICONS[Phaser.Scenes.RUNNING] = ICON_RUNNING;
ICONS[Phaser.Scenes.SLEEPING] = ICON_SLEEPING;
ICONS[Phaser.Scenes.PAUSED] = ICON_PAUSED;

var Fit = function (val, width, dir) {
  return Pad(String(val).substr(0, width), width, SPACE, dir);
};

var getIcon = function (scene) {
  return ICONS[scene.sys.settings.status] || ICON_OTHER;
};

var getKey = function (scene) {
  return scene.sys.settings.key;
};

var getStatus = function (scene) {
  return SCENE_STATES[scene.sys.settings.status];
};

var getDisplayListLength = function (scene) {
  return scene.sys.displayList.length;
};

var getUpdateListLength = function (scene) {
  return scene.sys.updateList.length;
};

var getActiveIcon = function (scene) {
  return scene.sys.settings.active ? ICON_ACTIVE : ICON_OTHER;
};

var getVisibleIcon = function (scene) {
  return scene.sys.settings.visible ? ICON_VISIBLE : ICON_OTHER;
};

var getTransitioningIcon = function (scene) {
  return scene.sys.settings.isTransition ? ICON_TRANSITIONING : ICON_OTHER;
};

var getInputIcon = function (scene) {
  return isSceneInputActive(scene) ? ICON_INPUT : ICON_OTHER;
};

var getKeyboardIcon = function (scene) {
  return isSceneKeyboardActive(scene) ? ICON_KEYBOARD : ICON_OTHER;
};

var isSceneInputActive = function (scene) {
  var ref = scene.sys;
  var input = ref.input;

  return Boolean(input && input.isActive());
};

var isSceneKeyboardActive = function (scene) {
  var ref = scene.sys;
  var input = ref.input;

  return Boolean(input && input.keyboard && input.keyboard.isActive());
};

var COLS = [
  { name: 'icon', width: 2, pad: ALIGN_LEFT, output: getIcon },
  { name: 'key', width: 18, pad: ALIGN_LEFT, output: getKey },
  { name: 'status', width: 10, pad: ALIGN_LEFT, output: getStatus },
  { name: 'display', width: 4, pad: ALIGN_RIGHT, output: getDisplayListLength },
  { name: 'update', width: 4, pad: ALIGN_RIGHT, output: getUpdateListLength },
  { name: 'active', width: 2, pad: ALIGN_RIGHT, output: getActiveIcon },
  { name: 'visible', width: 2, pad: ALIGN_RIGHT, output: getVisibleIcon },
  { name: 'transitioning', width: 2, pad: ALIGN_RIGHT, output: getTransitioningIcon },
  { name: 'input', width: 2, pad: ALIGN_RIGHT, output: getInputIcon },
  { name: 'keyboard', width: 2, pad: ALIGN_RIGHT, output: getKeyboardIcon }
];

// console.table(COLS);

var SceneWatcherPlugin = /*@__PURE__*/(function (superclass) {
  function SceneWatcherPlugin (pluginManager) {
    superclass.call(this, pluginManager);
    this.eventHandlers = {};
    this.transitionEventHandlers = {};
    this.output = '';
  }

  if ( superclass ) SceneWatcherPlugin.__proto__ = superclass;
  SceneWatcherPlugin.prototype = Object.create( superclass && superclass.prototype );
  SceneWatcherPlugin.prototype.constructor = SceneWatcherPlugin;

  SceneWatcherPlugin.prototype.init = function init () {
    this.view = document.createElement('pre');
    Object.assign(this.view.style, VIEW_STYLE);
    this.game.canvas.parentNode.append(this.view);

    SCENE_EVENTS.forEach(this.createEventHandler, this);

    SCENE_TRANSITION_EVENTS.forEach(this.createTransitionEventHandler, this);
  };

  SceneWatcherPlugin.prototype.start = function start () {
    this.game.events.on('poststep', this.postStep, this);
  };

  SceneWatcherPlugin.prototype.stop = function stop () {
    this.game.events.off('poststep', this.postStep, this);
  };

  SceneWatcherPlugin.prototype.destroy = function destroy () {
    this.unwatchAll();
    this.view.remove();
    this.view = null;
    superclass.prototype.destroy.call(this);
  };

  SceneWatcherPlugin.prototype.postStep = function postStep () {
    var output = this.getOutput();

    if (output !== this.output) {
      this.view.textContent = output;
      this.output = output;
    }
  };

  SceneWatcherPlugin.prototype.createEventHandler = function createEventHandler (name) {
    this.eventHandlers[name] = function (arg) {
      console.info(name, (arg.sys || arg).settings.key);
    };
  };

  SceneWatcherPlugin.prototype.createTransitionEventHandler = function createTransitionEventHandler (name) {
    this.transitionEventHandlers[name] = function (scene) {
      console.info(name, scene.sys.settings.key);
    };
  };

  SceneWatcherPlugin.prototype.getOutput = function getOutput () {
    return this.game.scene.scenes.map(this.getSceneOutput, this).join(NEWLINE);
  };

  SceneWatcherPlugin.prototype.getSceneOutput = function getSceneOutput (scene) {
    return COLS.map(function (col) { return this.getColOutput(col, scene); }, this).join(EMPTY);
  };

  SceneWatcherPlugin.prototype.getColOutput = function getColOutput (col, scene) {
    return Fit(col.output(scene), col.width, col.pad);
  };

  SceneWatcherPlugin.prototype.watchAll = function watchAll () {
    this.game.scene.scenes.forEach(this.watch, this);
  };

  SceneWatcherPlugin.prototype.watch = function watch (scene) {
    for (var eventName in this.eventHandlers) {
      scene.sys.events.on(eventName, this.eventHandlers[eventName], this);
    }

    for (var eventName$1 in this.transitionEventHandlers) {
      scene.sys.events.on(eventName$1, this.transitionEventHandlers[eventName$1], this);
    }
  };

  SceneWatcherPlugin.prototype.unwatchAll = function unwatchAll () {
    this.game.scene.scenes.forEach(this.unwatch, this);
  };

  SceneWatcherPlugin.prototype.unwatch = function unwatch (scene) {
    for (var eventName in this.eventHandlers) {
      scene.sys.events.off(eventName, this.eventHandlers[eventName], this);
    }
  };

  SceneWatcherPlugin.prototype.print = function print () {
    console.info('%c' + this.getOutput(), 'font-family: monospace; white-space: pre');
  };

  return SceneWatcherPlugin;
}(Phaser.Plugins.BasePlugin));

export default SceneWatcherPlugin;

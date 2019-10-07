(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('phaser')) :
  typeof define === 'function' && define.amd ? define(['phaser'], factory) :
  (global = global || self, global.PhaserSceneWatcherPlugin = factory(global.Phaser));
}(this, function (Phaser) { 'use strict';

  Phaser = Phaser && Phaser.hasOwnProperty('default') ? Phaser['default'] : Phaser;

  var Pad = Phaser.Utils.String.Pad;
  var ICON_OTHER = ' ';
  var ICON_PAUSED = '.';
  var ICON_RUNNING = '*';
  var ICON_SLEEPING = '-';
  var NEWLINE = '\n';
  var PAD_LEFT = 1;
  var PAD_RIGHT = 2;
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
  var SCENE_STATES = [
    'pending',
    'init',
    'start',
    'loading',
    'creating',
    'running',
    'paused',
    'sleeping',
    'shutdown',
    'destroyed'
  ];
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
  var VIEW_TITLE = 'Scenes: key; status; display list length; update list length';
  var ICONS = {};
  ICONS[Phaser.Scenes.RUNNING] = ICON_RUNNING;
  ICONS[Phaser.Scenes.SLEEPING] = ICON_SLEEPING;
  ICONS[Phaser.Scenes.PAUSED] = ICON_PAUSED;

  var getIcon = function (scene) {
    return ICONS[scene.sys.settings.status] || ICON_OTHER;
  };

  var getStatus = function (scene) {
    return SCENE_STATES[scene.sys.settings.status];
  };

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
      // Doesn't show tooltip w/ { pointer-events: none }
      this.view.title = VIEW_TITLE;
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
        var sys = arg.sys || arg;

        console.log(sys.settings.key, name);
      };
    };

    SceneWatcherPlugin.prototype.createTransitionEventHandler = function createTransitionEventHandler (name) {
      this.transitionEventHandlers[name] = function (scene) {
        console.log(scene.sys.settings.key, name);
      };
    };

    SceneWatcherPlugin.prototype.getOutput = function getOutput () {
      return this.game.scene.scenes.map(this.getSceneOutput, this).join(NEWLINE);
    };

    SceneWatcherPlugin.prototype.getSceneOutput = function getSceneOutput (scene) {
      var ref = scene.sys;
      var displayList = ref.displayList;
      var settings = ref.settings;
      var updateList = ref.updateList;

      return SPACE + getIcon(scene) + SPACE +
        Pad(settings.key.substr(0, 12), 12, SPACE, PAD_RIGHT) +
        Pad(getStatus(scene), 8, SPACE, PAD_RIGHT) +
        Pad(String(displayList.length), 4, SPACE, PAD_LEFT) +
        Pad(String(updateList.length), 4, SPACE, PAD_LEFT);
    };

    SceneWatcherPlugin.prototype.watchAll = function watchAll () {
      this.game.scene.scenes.forEach(this.watch, this);
    };

    SceneWatcherPlugin.prototype.watch = function watch (scene) {
      for (var eventName in this.eventHandlers) {
        scene.events.on(eventName, this.eventHandlers[eventName], this);
      }

      for (var eventName$1 in this.transitionEventHandlers) {
        scene.events.on(eventName$1, this.transitionEventHandlers[eventName$1], this);
      }
    };

    SceneWatcherPlugin.prototype.unwatchAll = function unwatchAll () {
      this.game.scene.scenes.forEach(this.unwatch, this);
    };

    SceneWatcherPlugin.prototype.unwatch = function unwatch (scene) {
      for (var eventName in this.eventHandlers) {
        scene.events.off(eventName, this.eventHandlers[eventName], this);
      }
    };

    return SceneWatcherPlugin;
  }(Phaser.Plugins.BasePlugin));

  return SceneWatcherPlugin;

}));
//# sourceMappingURL=phaser-plugin-scene-watcher.umd.js.map

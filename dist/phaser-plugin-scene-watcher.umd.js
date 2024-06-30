(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('phaser')) :
  typeof define === 'function' && define.amd ? define(['phaser'], factory) :
  (global = global || self, global.PhaserSceneWatcherPlugin = factory(global.Phaser));
}(this, (function (Phaser) { 'use strict';

  Phaser = Phaser && Object.prototype.hasOwnProperty.call(Phaser, 'default') ? Phaser['default'] : Phaser;

  const Pad = Phaser.Utils.String.Pad;
  const ICON_OTHER = ' ';
  const ICON_PAUSED = '.';
  const ICON_RUNNING = '*';
  const ICON_SLEEPING = '-';
  const ICON_ACTIVE = 'a';
  const ICON_VISIBLE = 'v';
  const ICON_TRANSITIONING = 't';
  const ICON_INPUT = 'i';
  const ICON_KEYBOARD = 'k';
  const NEWLINE = '\n';
  const EMPTY = '';
  const PAD_LEFT = 1;
  const PAD_RIGHT = 2;
  const ALIGN_LEFT = PAD_RIGHT;
  const ALIGN_RIGHT = PAD_LEFT;
  const SCENE_EVENTS = [
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
  const SCENE_TRANSITION_EVENTS = [
    Phaser.Scenes.Events.TRANSITION_COMPLETE,
    Phaser.Scenes.Events.TRANSITION_INIT,
    Phaser.Scenes.Events.TRANSITION_OUT,
    Phaser.Scenes.Events.TRANSITION_START,
    Phaser.Scenes.Events.TRANSITION_WAKE
  ].filter(Boolean);
  const SCENE_STATES = {
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
  const SPACE = ' ';
  const VIEW_STYLE = {
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
  const ICONS = {
    [Phaser.Scenes.RUNNING]: ICON_RUNNING,
    [Phaser.Scenes.SLEEPING]: ICON_SLEEPING,
    [Phaser.Scenes.PAUSED]: ICON_PAUSED
  };

  const Fit = function (val, width, dir) {
    return Pad(String(val).substr(0, width), width, SPACE, dir);
  };

  const getIcon = function (scene) {
    return ICONS[scene.sys.settings.status] || ICON_OTHER;
  };

  const getKey = function (scene) {
    return scene.sys.settings.key;
  };

  const getStatus = function (scene) {
    return SCENE_STATES[scene.sys.settings.status];
  };

  const getDisplayListLength = function (scene) {
    return scene.sys.displayList.length;
  };

  const getUpdateListLength = function (scene) {
    return scene.sys.updateList.length;
  };

  const getActiveIcon = function (scene) {
    return scene.sys.settings.active ? ICON_ACTIVE : ICON_OTHER;
  };

  const getVisibleIcon = function (scene) {
    return scene.sys.settings.visible ? ICON_VISIBLE : ICON_OTHER;
  };

  const getTransitioningIcon = function (scene) {
    return scene.sys.settings.isTransition ? ICON_TRANSITIONING : ICON_OTHER;
  };

  const getInputIcon = function (scene) {
    return isSceneInputActive(scene) ? ICON_INPUT : ICON_OTHER;
  };

  const getKeyboardIcon = function (scene) {
    return isSceneKeyboardActive(scene) ? ICON_KEYBOARD : ICON_OTHER;
  };

  const isSceneInputActive = function (scene) {
    const { input } = scene.sys;

    return Boolean(input && input.isActive());
  };

  const isSceneKeyboardActive = function (scene) {
    const { input } = scene.sys;

    return Boolean(input && input.keyboard && input.keyboard.isActive());
  };

  const COLS = [
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

  class SceneWatcherPlugin extends Phaser.Plugins.BasePlugin {
    constructor (pluginManager) {
      super(pluginManager);
      this.eventHandlers = {};
      this.transitionEventHandlers = {};
      this.output = '';
    }

    init () {
      this.view = document.createElement('pre');
      Object.assign(this.view.style, VIEW_STYLE);
      this.game.canvas.parentNode.append(this.view);

      SCENE_EVENTS.forEach(this.createEventHandler, this);

      SCENE_TRANSITION_EVENTS.forEach(this.createTransitionEventHandler, this);
    }

    start () {
      this.game.events.on('poststep', this.postStep, this);
    }

    stop () {
      this.game.events.off('poststep', this.postStep, this);
    }

    destroy () {
      this.unwatchAll();
      this.view.remove();
      this.view = null;
      super.destroy();
    }

    postStep () {
      const output = this.getOutput();

      if (output !== this.output) {
        this.view.textContent = output;
        this.output = output;
      }
    }

    createEventHandler (name) {
      this.eventHandlers[name] = function (arg) {
        console.info(name, (arg.sys || arg).settings.key);
      };
    }

    createTransitionEventHandler (name) {
      this.transitionEventHandlers[name] = function (scene) {
        console.info(name, scene.sys.settings.key);
      };
    }

    getOutput () {
      return this.game.scene.scenes.map(this.getSceneOutput, this).join(NEWLINE);
    }

    getSceneOutput (scene) {
      return COLS.map(function (col) { return this.getColOutput(col, scene); }, this).join(EMPTY);
    }

    getColOutput (col, scene) {
      return Fit(col.output(scene), col.width, col.pad);
    }

    watchAll () {
      this.game.scene.scenes.forEach(this.watch, this);
    }

    watch (scene) {
      for (const eventName in this.eventHandlers) {
        scene.sys.events.on(eventName, this.eventHandlers[eventName], this);
      }

      for (const eventName in this.transitionEventHandlers) {
        scene.sys.events.on(eventName, this.transitionEventHandlers[eventName], this);
      }
    }

    unwatchAll () {
      this.game.scene.scenes.forEach(this.unwatch, this);
    }

    unwatch (scene) {
      for (const eventName in this.eventHandlers) {
        scene.sys.events.off(eventName, this.eventHandlers[eventName], this);
      }
    }

    print () {
      console.info('%c' + this.getOutput(), 'font-family: monospace; white-space: pre');
    }
  }

  return SceneWatcherPlugin;

})));
//# sourceMappingURL=phaser-plugin-scene-watcher.umd.js.map

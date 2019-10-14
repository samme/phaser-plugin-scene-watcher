import Phaser from 'phaser';

const Pad = Phaser.Utils.String.Pad;
const ICON_DEFAULT = ' ';
const ICON_PAUSED = '.';
const ICON_RUNNING = '*';
const ICON_SLEEPING = '-';
const NEWLINE = '\n';
const PAD_LEFT = 1;
const PAD_RIGHT = 2;
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
const SCENE_STATES = [
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
const SPACE = ' ';
const VIEW_STYLE = {
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
const VIEW_TITLE = 'Scene key; status, display list length; update list length';
const ICONS = {
  [Phaser.Scenes.RUNNING]: ICON_RUNNING,
  [Phaser.Scenes.SLEEPING]: ICON_SLEEPING,
  [Phaser.Scenes.PAUSED]: ICON_PAUSED
};

const getIcon = function (scene) {
  return ICONS[scene.sys.settings.status] || ICON_DEFAULT;
};

const getStatus = function (scene) {
  return SCENE_STATES[scene.sys.settings.status];
};

const getDisplayListLength = function (scene) {
  return scene.sys.updateList.length;
};

const getUpdateListLength = function (scene) {
  return scene.sys.displayList.length;
};

export default class SceneWatcherPlugin extends Phaser.Plugins.BasePlugin {
  constructor (pluginManager) {
    super(pluginManager);
    this.eventHandlers = {};
    this.transitionEventHandlers = {};
    this.output = '';
  }

  init () {
    this.view = document.createElement('pre');
    // Doesn't show tooltip w/ { pointer-events: none }
    this.view.title = VIEW_TITLE;
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
      var sys = arg.sys || arg;

      console.log(sys.settings.key, name);
    };
  }

  createTransitionEventHandler (name) {
    this.transitionEventHandlers[name] = function (scene) {
      console.log(scene.sys.settings.key, name);
    };
  }

  getOutput () {
    return this.game.scene.scenes.map(this.getSceneOutput, this).join(NEWLINE);
  }

  getSceneOutput (scene) {
    return SPACE + getIcon(scene) + SPACE +
      Pad(scene.sys.settings.key.substr(0, 12), 12, SPACE, PAD_RIGHT) +
      Pad(getStatus(scene), 8, SPACE, PAD_RIGHT) +
      Pad(getDisplayListLength(scene), 4, SPACE, PAD_LEFT) +
      Pad(getUpdateListLength(scene), 4, SPACE, PAD_LEFT);
  }

  watchAll () {
    this.game.scene.scenes.forEach(this.watch, this);
  }

  watch (scene) {
    for (let eventName in this.eventHandlers) {
      scene.events.on(eventName, this.eventHandlers[eventName], this);
    }

    for (let eventName in this.transitionEventHandlers) {
      scene.events.on(eventName, this.transitionEventHandlers[eventName], this);
    }
  }

  unwatchAll () {
    this.game.scene.scenes.forEach(this.unwatch, this);
  }

  unwatch (scene) {
    for (let eventName in this.eventHandlers) {
      scene.events.off(eventName, this.eventHandlers[eventName], this);
    }
  }
}

if (typeof window !== 'undefined') {
  window.PhaserSceneWatcherPlugin = SceneWatcherPlugin;
}

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
  Phaser.Scenes.Events.WAKE,
];
const SCENE_TRANSITION_EVENTS = [
  Phaser.Scenes.Events.TRANSITION_COMPLETE,
  Phaser.Scenes.Events.TRANSITION_INIT,
  Phaser.Scenes.Events.TRANSITION_OUT,
  Phaser.Scenes.Events.TRANSITION_START,
  Phaser.Scenes.Events.TRANSITION_WAKE
];
const SCENE_STATES = [ 'pending', 'init', 'start', 'loading', 'creating', 'running', 'paused', 'sleeping', 'shutdown', 'destroyed' ];
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
  return scene.sys.updateList._list.length;
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
    Object.assign(this.view.style, VIEW_STYLE);
    this.game.canvas.parentNode.append(this.view);

    SCENE_EVENTS.forEach(function (eventName) {
      if (eventName) {
        this.eventHandlers[eventName] = function (sys) {
          console.log(eventName, sys.settings.key);
        };
      }
    }, this);

    SCENE_TRANSITION_EVENTS.forEach(function (eventName) {
      if (eventName) {
        this.transitionEventHandlers[eventName] = function (scene) {
          console.log(eventName, scene.sys.settings.key);
        };
      }
    }, this);
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

  getOutput () {
    return this.game.scene.scenes.map(this.getSceneOutput, this).join(NEWLINE);
  }

  getSceneOutput (scene) {
    return Pad(scene.sys.settings.key.substr(0, 12), 12, SPACE, PAD_LEFT) + SPACE +
      getIcon(scene) + SPACE +
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

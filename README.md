![Preview](https://i.imgur.com/Xa9HxrU.png)

Phaser 3 Scene Watcher Plugin
=============================

For each scene, it shows (left to right):

1. key
2. status
3. display list count
4. update list count
5. active (a)
6. visible (v)
7. input enabled (i)
8. keyboard input enabled (k)

See the [demo](https://codepen.io/samme/pen/VBbJZM) or [Cavern Quest](https://samme.itch.io/cavern-quest).

Browser
-------

Use [phaser-plugin-scene-watcher.umd.js](dist/phaser-plugin-scene-watcher.umd.js) and the global `PhaserSceneWatcherPlugin`.

```javascript
new Phaser.Game({
  plugins: {
    global: [
      { key: 'SceneWatcher', plugin: PhaserSceneWatcherPlugin, start: true }
    ]
  },
});
```

Modules
-------

Use [phaser-plugin-scene-watcher.esm.js](dist/phaser-plugin-scene-watcher.esm.js) (ES) or [phaser-plugin-scene-watcher.cjs.js](dist/phaser-plugin-scene-watcher.cjs.js) (CommonJS) and the plugin's default export:

```javascript
import SceneWatcherPlugin from 'phaser-plugin-scene-watcher';

new Phaser.Game({
  plugins: {
    global: [
      { key: 'SceneWatcher', plugin: SceneWatcherPlugin, start: true }
    ]
  },
});
```

Log scene events to console
---------------------------

From a scene:

```javascript
init () {
  this.plugins.get('SceneWatcher').watchAll();
}
```

From the game configuration:

```javascript
new Phaser.Game({
  callbacks: {
    postBoot: function (game) {
      game.plugins.get('SceneWatcher').watchAll();
    }
  }
});
```

Use the same `key` that you added the plugin with.
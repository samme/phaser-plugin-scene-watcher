![Screenshot](./preview.png)

Phaser 3 Scene Watcher Plugin
=============================

For each scene, it shows (left to right):

1. key
2. status
3. display list count
4. update list count
5. active (a)
6. visible (v)
7. transitioning (t)
8. [input active](https://newdocs.phaser.io/docs/3.80.0/focus/Phaser.Input.InputPlugin-isActive) (i)
9. [keyboard input active](https://newdocs.phaser.io/docs/3.80.0/focus/Phaser.Input.Keyboard.KeyboardPlugin-isActive) (k)

See the [demo](https://codepen.io/samme/pen/VBbJZM) or [Cavern Quest](https://samme.itch.io/cavern-quest).

Browser / UMD
-------------

```html
<script src="https://cdn.jsdelivr.net/npm/phaser-plugin-scene-watcher@6.0.0/dist/phaser-plugin-scene-watcher.umd.js"></script>
```

Use the global `PhaserSceneWatcherPlugin`.

```javascript
/* global PhaserSceneWatcherPlugin */

new Phaser.Game({
  plugins: {
    global: [
      { key: 'SceneWatcher', plugin: PhaserSceneWatcherPlugin, start: true }
    ]
  },
});
```

Module
------

Install `phaser-plugin-scene-watcher` from npm and use the default import:

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

Quick load
----------

```javascript
function preload () {
  this.load.plugin('PhaserSceneWatcherPlugin', 'https://cdn.jsdelivr.net/npm/phaser-plugin-scene-watcher@6.0.0/dist/phaser-plugin-scene-watcher.umd.js', true);
}
```

Log scene events to console
---------------------------

`watchAll()` starts logging scene events for **all** existing scenes. Call it **once** after all scenes are added.

From the game configuration:

```javascript
new Phaser.Game({
  callbacks: {
    postBoot: function (game) {
      // Use the `key` you added the plugin with.
      game.plugins.get('SceneWatcher').watchAll();
    }
  }
});
```

From a scene:

```javascript
function init () {
  // Use the `key` you added the plugin with.
  this.plugins.get('SceneWatcher').watchAll();
}
```

![Preview](https://i.imgur.com/Xa9HxrU.png)

Phaser 3 Scene Watcher Plugin
=============================

For each scene, it shows:

1. key
2. status
3. display list count
4. update list count

[Demo](https://codepen.io/samme/pen/VBbJZM?editors=0010)

Add
---

```javascript
new Phaser.Game({
  // ...
  plugins: {
    global: [
      { key: 'SceneWatcherPlugin', plugin: PhaserSceneWatcherPlugin, start: true }
    ]
  },
  // ...
});
```

If you're using ES6 modules, you can use this plugin's default export in place of `PhaserSceneWatcherPlugin`:

```javascript
import SceneWatcherPlugin from 'phaser-plugin-scene-watcher';
```

Log scene events to console
---------------------------

From a scene:

```javascript
init () {
  this.plugins.get('SceneWatcherPlugin').watchAll();
}
```

From the game configuration:

```javascript
new Phaser.Game({
  // ...
  callbacks: {
    postBoot: function (game) {
      game.plugins.get('SceneWatcherPlugin').watchAll();
    }
  }
  // ...
});
```

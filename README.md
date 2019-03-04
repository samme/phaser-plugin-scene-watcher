![Preview](https://i.imgur.com/Xa9HxrU.png)

Phaser 3 Scene Watcher Plugin
=============================

It shows each scene's key, status, display list size, and update list size. [Demo](https://codepen.io/samme/pen/VBbJZM?editors=0010)

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

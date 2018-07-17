Phaser 3 Scene Watcher Plugin
=============================

```javascript
new Phaser.Game({
  // ...
  plugins: {
    global: [
      { key: 'SceneWatcherPlugin', plugin: Phaser.Plugins.SceneWatcherPlugin, start: true }
    ]
  },
  // ...
});
```

It shows each scene's key, status, display list size, and update list size.

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

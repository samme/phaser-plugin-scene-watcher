Phaser 3 Scene Watcher Plugin
=============================

```javascript
new Phaser.Game({
  // ...
  plugins: {
    global: [
      { key: 'SceneWatcher', plugin: Phaser.Plugins.SceneWatcherPlugin, start: true }
    ]
  },
  // ...
});
```

It shows each scene key, status, update list size, and display list size.

Log scene events to console
---------------------------

```javascript
new Phaser.Game({
  // ...
  callbacks: {
    postBoot: function (game) {
      game.plugins.get('SceneWatcher').watchAll();
    }
  }
  // ...
});
```

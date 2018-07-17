console.assert(Phaser, 'Phaser');

console.assert(Phaser.Plugins.SceneWatcherPlugin, 'Phaser.Plugins.SceneWatcherPlugin');

class SceneA extends Phaser.Scene {

  constructor () {
    super({ key: 'SceneA' });
  }

  create () {
    let graphics = this.add.graphics();

    graphics.fillStyle(0x0074D9, 1);

    graphics.fillRect(100, 200, 600, 300);
    graphics.fillRect(100, 100, 100, 100);

    this.add.text(120, 110, 'A', { font: '96px Courier', fill: '#000000' })
      .setInteractive()
      .on('pointerdown', function () {
        this.scene.bringToTop();
      }, this);

    this.scene.launch('SceneB');
  }
}

class SceneB extends Phaser.Scene {

  constructor () {
    super({ key: 'SceneB' });
  }

  create () {
    let graphics = this.add.graphics();

    graphics.fillStyle(0xFFDC00, 1);

    graphics.fillRect(100, 200, 600, 300);
    graphics.fillRect(200, 100, 100, 100);

    this.add.text(220, 110, 'B', { font: '96px Courier', fill: '#000000' })
      .setInteractive()
      .on('pointerdown', function () {
        this.scene.bringToTop();
      }, this);

    this.scene.launch('SceneC');
  }
}

class SceneC extends Phaser.Scene {

  constructor () {
    super({ key: 'SceneC' });
  }

  create () {
    let graphics = this.add.graphics();

    graphics.fillStyle(0xFF4136, 1);

    graphics.fillRect(100, 200, 600, 300);
    graphics.fillRect(300, 100, 100, 100);

    this.add.text(320, 110, 'C', { font: '96px Courier', fill: '#000000' })
      .setInteractive()
      .on('pointerdown', function () {
        this.scene.bringToTop();
      }, this);

    // this.scene.sleep('SceneA');
    // this.scene.sleep('SceneB');
  }
}

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#001f3f',
  parent: 'phaser-example',
  scene: [ SceneA, SceneB, SceneC ],
  plugins: {
    global: [
      { key: 'SceneWatcher', plugin: Phaser.Plugins.SceneWatcherPlugin, start: true }
    ]
  },
  callbacks: {
    postBoot: function (game) {
      game.plugins.get('SceneWatcher').watchAll();
    }
  }
};

window.game = new Phaser.Game(config);

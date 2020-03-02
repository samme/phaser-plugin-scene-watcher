#### 4.1.0

- Added columns for scene active, visible, input enabled, and keyboard enabled.
- Added `print()` method. It prints the table output to the console.
- Resized the columns.

#### 4.0.0

- There are now three script endpoints for `browser` (UMD), `module` (ES), and `main` (CommonJS).
- The global `PhaserSceneWatcherPlugin` is now available only when using the browser/UMD script.

#### 3.2.2

- Fixed an error reading the update list length in Phaser v3.20.

#### 3.2.1

- Changed Phaser to a peer dependency.

#### 3.2.0

- Moved the scene status icon to the left.

#### 3.1.4

- Reverted Phaser dependency to ^3.16.2.

#### 3.1.3

- Updated dist script. It was omitted from v3.1.0 by mistake.

#### 3.1.0

- Reduced transparency.
- Reversed the order of arguments when logging scene events. Scene key is now first.
- Updated Phaser dependency to 3.17.0.

#### 3.0.1

- Updated Phaser dependency to 3.16.2 (required since plugin v3.0.0).

#### 3.0.0

- Changed 'main' script to `src/index.js`.
- Added scene transition events.

#### 2.2.0

- Added scene 'create' event.

#### 2.1.0

- View is updated only when output changes.

#### 2.0.0

- Added global `PhaserSceneWatcherPlugin`.
- Removed `Phaser.Plugin.SceneWatcher`. Use `PhaserSceneWatcherPlugin` instead.
- Renamed dist script to `dist/PhaserSceneWatcherPlugin.js`.
- Renamed src script to `src/index.js`.

#### 1.0.1

- Removed extra files from npm module.

#### 1.0.0

- npm release.

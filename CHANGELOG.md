2.0.2
-----

- Made Phaser a peer dependency (#1).

2.0.1
-----

- Fixed missing `silent` argument in PhaserHealth.Damage().
- Fixed missing `silent` argument in PhaserHealth.Heal().

2.0.0
-----

- Renamed main script to `dist/PhaserHealth.js`.
- Removed `Phaser.Health`. Use `PhaserHealth` global instead (or the default export).
- Kill methods now affect only living targets.
- Revive methods now affect only dead targets.

1.2.0
-----

- Added lots of methods
- Added Events namespace

1.1.0
-----

- Fixed inconsistent return values in damage() and heal()
- Added `silent` argument to setMaxHealth()

1.0.0
-----

- npm release

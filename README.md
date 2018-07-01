Phaser 3 Health Component
=========================

Flexible health component.

Examples
--------

```javascript
// Add to one game object. Also assign health 10 of 10.
Phaser.Health.AddTo(sprite, 10, 10);
// Same:
Phaser.Health.AddTo(sprite).setMaxHealth(10).setHealth(10);

// Add to Sprite class
Phaser.Health.MixinTo(Phaser.GameObjects.Sprite);

// Hide, deactivate sprite when dead
sprite.on('die', function (spr) {
  spr.setActive(false).setVisible(false);
});

// Show, activate sprite when revived
sprite.on('revive', function (spr) {
  spr.setActive().setVisible();
});

sprite.on('healthchange', function (spr, amount, health, maxHealth) {
  // …
});
```

Tests
-----

See [tests.js](./tests/tests.js).

Static Methods
--------------

- Phaser.Health.AddTo(obj, health?=1, maxHealth?=100) → obj
- Phaser.Health.MixinTo(class) → class

Instance Methods
----------------

- damage(amount?=1, silent?=false) → this
- getHealth() → amount
- getMaxHealth() → amount
- heal(amount?=1, silent?=false) → this
- isAlive() → boolean
- isDead() → boolean
- kill(silent?=false) → this
- revive(newHealth?=1, silent?=false) → this
- reviveAtMaxHealth(silent?=false) → this
- setHealth(health, silent?=false) → this
- setMaxHealth(maxHealth, silent?=false) → this

Events
------

1. `damage`, `heal` → (obj, amount)
2. `healthchange` → (obj, amount, health, maxHealth)
3. `die`, `revive` → (obj)

Phaser 3 Health Component
=========================

Flexible, data-based health component.

Examples
--------

```javascript
// Add component to one game object
// Also assign health 10/10
Phaser.Health.AddTo(sprite, 10, 10);

// Same:
Phaser.Health.AddTo(sprite).setMaxHealth(10).setHealth(10);

// Add component to Sprite class
Phaser.Health.MixinTo(Phaser.GameObjects.Sprite);

// Hide and deactivate sprite when dead
sprite.on('die', function (spr) {
  spr.setActive(false).setVisible(false);
});

// Show and activate sprite when revived
sprite.on('revive', function (spr) {
  spr.setActive(true).setVisible(true);
});

// React to health changes
sprite.on('healthchange', function (spr, amount, health, maxHealth) {
  // Health changed by ${amount}, now ${health}/${maxHealth}
});
```

Tests
-----

Open [tests](./tests/) in your browser.

Static Methods
--------------

- Phaser.Health.AddTo(obj, health=1, maxHealth=100) → obj
- Phaser.Health.MixinTo(class) → class
- Phaser.Health.SetHealth(obj, health, maxHealth, silent=false) → obj

Instance Methods
----------------

- damage(amount=1, silent=false) → this
- getHealth() → amount
- getMaxHealth() → amount
- heal(amount=1, silent=false) → this
- isAlive() → boolean
- isDead() → boolean
- kill(silent=false) → this
- revive(newHealth=1, silent=false) → this
- reviveAtMaxHealth(silent=false) → this
- setHealth(health, silent=false) → this
- setMaxHealth(maxHealth, silent=false) → this

Events
------

1. `damage`, `heal` → (obj, amount)
2. `healthchange` → (obj, amount, health, maxHealth)
3. `die`, `revive` → (obj)

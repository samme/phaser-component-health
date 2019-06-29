Phaser 3 Health Component
=========================

Flexible, data-based health component.

Examples
--------

```javascript
// Add component to one game object
PhaserHealth.AddTo(sprite);

// Add component to one game object and assign health 1 and max health 2
PhaserHealth.AddTo(sprite, 1, 2);

// Same:
PhaserHealth.AddTo(sprite).setMaxHealth(2).setHealth(1);

// Add component to Sprite class
PhaserHealth.MixinTo(Phaser.GameObjects.Sprite);

// Hide and deactivate sprite when health decreases below 0
sprite.on('die', function (spr) {
  spr.setActive(false).setVisible(false);
});

// Show and activate sprite when health increases above 0
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

Open [tests](./tests/index.html) in your browser.

Static Methods
--------------

- PhaserHealth.AddTo(obj, health=1, maxHealth=100) → obj
- PhaserHealth.Damage(obj, amount=1, silent=false) → obj
- PhaserHealth.Dump(objs) → undefined
- PhaserHealth.Heal(obj, amount=1, silent=false) → obj
- PhaserHealth.Kill(obj, silent=false) → obj
- PhaserHealth.MixinTo(class) → class
- PhaserHealth.Revive(obj, health=1, silent=false) → obj
- PhaserHealth.ReviveAtMaxHealth(obj, silent=false) → obj
- PhaserHealth.SetHealth(obj, health, maxHealth, silent=false) → obj

Actions
-------

- Phaser.Actions.Damage(objs, amount=1, silent=false) → objs
- Phaser.Actions.Heal(objs, amount=1, silent=false) → objs
- Phaser.Actions.Kill(objs, silent=false) → objs
- Phaser.Actions.Revive(objs, health=1, silent=false) → objs
- Phaser.Actions.ReviveAtMaxHealth(objs, silent=false) → objs
- Phaser.Actions.SetHealth(objs, health, maxHealth, silent=false) → objs

Instance Methods
----------------

- damage(amount=1, silent=false) → this
- getHealth() → number
- getMaxHealth() → number
- heal(amount=1, silent=false) → this
- isAlive() → true | false
- isDead() → true | false
- kill(silent=false) → this
- revive(health=1, silent=false) → this
- reviveAtMaxHealth(silent=false) → this
- setHealth(health, silent=false) → this
- setMaxHealth(maxHealth, silent=false) → this

Events
------

1. `damage`, `heal` → (obj, amount)
2. `healthchange` → (obj, amount, health, maxHealth)
3. `die`, `revive` → (obj)

These are also named as

- PhaserHealth.Events.DAMAGE
- PhaserHealth.Events.DIE
- PhaserHealth.Events.HEAL
- PhaserHealth.Events.HEALTH_CHANGE
- PhaserHealth.Events.REVIVE

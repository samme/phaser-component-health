Phaser 3 Health Component
=========================

Flexible, data-based health component.

Examples
--------

```javascript
// Add component to *one* game object and assign health=1, minHealth=0, maxHealth=2
PhaserHealth.AddTo(sprite, 1, 0, 2);

// Same, in two calls:
PhaserHealth.AddTo(sprite).setHealth(1, 0, 2);

// Add component to Sprite class
PhaserHealth.MixinTo(Phaser.GameObjects.Sprite);
// Then set health values on a game object
var sprite = this.add.sprite(/*…*/).setHealth(1, 0, 2);

// Hide and deactivate sprite when health decreases below 0
sprite.on('die', function (obj) {
  obj.setActive(false).setVisible(false);
});

// Show and activate sprite when health increases above 0
sprite.on('revive', function (obj) {
  obj.setActive(true).setVisible(true);
});

// React to health changes
sprite.on('healthchange', function (obj, amount, health, minHealth, maxHealth) {
  // Health changed by ${amount}, now ${health}/${maxHealth}
});

// Decrease health by 1
sprite.damage(1);

// Increase health by 2
sprite.heal(2);

// Set health to 0, only if health > 0
sprite.kill();

// Set health to 1, only if health <= 0
sprite.revive();

// Set health to maximum, only if health <= 0
sprite.reviveAtMaxHealth();
```

See the [demo](demo/demo.js) for more example uses.

Tests
-----

Open [tests](./tests/index.html) in your browser.

API
---

### Browser / UMD

Use the [UMD script](./dist/phaser-component-health.umd.js) and the global variable `PhaserHealth`.

### Modules

Use the module's default export:

```js
import PhaserHealth from 'phaser-component-health';
```

### Static Methods

- PhaserHealth.AddTo(obj, health=1, minHealth=-Infinity, maxHealth=100) → obj
- PhaserHealth.Damage(obj, amount=1, silent=false) → obj
- PhaserHealth.Dump(objs) → undefined (see output in console)
- PhaserHealth.Heal(obj, amount=1, silent=false) → obj
- PhaserHealth.Kill(obj, silent=false) → obj
- PhaserHealth.MixinTo(class) → class
- PhaserHealth.Revive(obj, health=1, silent=false) → obj
- PhaserHealth.ReviveAtMaxHealth(obj, silent=false) → obj
- PhaserHealth.SetHealth(obj, health, minHealth, maxHealth, silent=false) → obj

### Actions

- PhaserHealth.Actions.Damage(objs, amount=1, silent=false) → objs
- PhaserHealth.Actions.Heal(objs, amount=1, silent=false) → objs
- PhaserHealth.Actions.Kill(objs, silent=false) → objs
- PhaserHealth.Actions.Revive(objs, health=1, silent=false) → objs
- PhaserHealth.Actions.ReviveAtMaxHealth(objs, silent=false) → objs
- PhaserHealth.Actions.SetHealth(objs, health, minHealth, maxHealth, silent=false) → objs

### Component Methods

- damage(amount=1, silent=false) → this
- getHealth() → number
- getHealthFrac() → number
- getMaxHealth() → number
- getMinHealth() → number
- heal(amount=1, silent=false) → this
- isAlive() → boolean
- isDead() → boolean
- kill(silent=false) → this
- revive(health=1, silent=false) → this
- reviveAtMaxHealth(silent=false) → this
- setHealth(health, minHealth, maxHealth, silent=false) → this
- setMaxHealth(maxHealth, silent=false) → this
- setMinHealth(minHealth, silent=false) → this

### Events

1. `healthchange` → (obj, amount, health, minHealth, maxHealth)
2. `damage`, `heal` → (obj, amount)
3. `die`, `revive` → (obj)

These are also named as

- PhaserHealth.Events.DAMAGE
- PhaserHealth.Events.DIE
- PhaserHealth.Events.HEAL
- PhaserHealth.Events.HEALTH_CHANGE
- PhaserHealth.Events.REVIVE

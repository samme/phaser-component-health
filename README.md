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
sprite.on('die', function (spr) {
  spr.setActive(false).setVisible(false);
});

// Show and activate sprite when health increases above 0
sprite.on('revive', function (spr) {
  spr.setActive(true).setVisible(true);
});

// React to health changes
sprite.on('healthchange', function (gameObject, amount, health, minHealth, maxHealth) {
  // Health changed by ${amount}, now ${health}/${maxHealth}
});

// Modify sprite health
sprite.damage(1);
sprite.heal(2);
sprite.kill();
sprite.revive();
```

See the [demo](demo/demo.js) for more example uses.

Tests
-----

Open [tests](./tests/index.html) in your browser.

Add
---

### Browser / UMD

Include the [UMD script](https://github.com/samme/phaser-component-health/blob/master/dist/phaser-component-health.umd.js) after Phaser and then use the global variable `PhaserHealth`. [The demo](https://codepen.io/samme/pen/BeyZpX) is set up this way.

```html
<script src='https://cdn.jsdelivr.net/npm/phaser@3.52.0/dist/phaser.js'></script>
<script src='https://cdn.jsdelivr.net/npm/phaser-component-health@3.0.0/dist/phaser-component-health.umd.js'></script>
```

### Modules

Use the module's default export:

```js
import PhaserHealth from 'phaser-component-health';
```

API
---

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

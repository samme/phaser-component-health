(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('phaser')) :
  typeof define === 'function' && define.amd ? define(['phaser'], factory) :
  (global = global || self, global.PhaserHealth = factory(global.Phaser));
}(this, (function (Phaser) { 'use strict';

  Phaser = Phaser && Phaser.hasOwnProperty('default') ? Phaser['default'] : Phaser;

  var DAMAGE = 'damage';
  var DIE = 'die';
  var HEAL = 'heal';
  var HEALTH = 'health';
  var HEALTH_CHANGE = 'healthchange';
  var MAX_HEALTH = 'maxHealth';
  var MIN_HEALTH = 'minHealth';
  var REVIVE = 'revive';

  var ref = Phaser.Math;
  var Clamp = ref.Clamp;

  var getHealth = function () {
    return this.getData(HEALTH);
  };

  var getHealthFrac = function () {
    return this.getHealth() / this.getMaxHealth();
  };

  var getMinHealth = function () {
    return this.getData(MIN_HEALTH);
  };

  var getMaxHealth = function () {
    return this.getData(MAX_HEALTH);
  };

  var setHealth = function (health, minHealth, maxHealth, silent) {
    if (minHealth !== undefined) {
      this.setMinHealth(minHealth, true);
    }

    if (maxHealth !== undefined) {
      this.setMaxHealth(maxHealth, true);
    }

    minHealth = this.getMinHealth();
    maxHealth = this.getMaxHealth();

    var prevHealth = this.getHealth();
    var newHealth = Clamp(health, minHealth, maxHealth);
    var change = newHealth - prevHealth;

    if (change === 0) { return this; }

    this.setData(HEALTH, newHealth);

    if (silent) { return this; }

    this.emit(HEALTH_CHANGE, this, change, newHealth, minHealth, maxHealth);

    if (change > 0) {
      this.emit(HEAL, this, change);
    } else {
      this.emit(DAMAGE, this, -change);
    }

    if (prevHealth > 0 && newHealth <= 0) {
      this.emit(DIE, this);
    } else if (prevHealth <= 0 && newHealth > 0) {
      this.emit(REVIVE, this);
    }

    return this;
  };

  var setMinHealth = function (amount, silent) {
    this.setData(MIN_HEALTH, amount);

    if (this.getHealth() < amount) {
      this.setHealth(amount, silent);
    }

    return this;
  };

  var setMaxHealth = function (amount, silent) {
    this.setData(MAX_HEALTH, amount);

    if (this.getHealth() > amount) {
      this.setHealth(amount, silent);
    }

    return this;
  };

  var damage = function (amount, silent) {
    if (amount === 0) { return this; }

    if (!amount) { amount = 1; }

    this.setHealth(this.getHealth() - amount, undefined, undefined, silent);

    return this;
  };

  var heal = function (amount, silent) {
    if (amount === 0) { return this; }

    if (!amount) { amount = 1; }

    this.setHealth(this.getHealth() + amount, undefined, undefined, silent);

    return this;
  };

  var isAlive = function () {
    return this.getHealth() > 0;
  };

  var isDead = function () {
    return this.getHealth() <= 0;
  };

  var kill = function (silent) {
    if (this.isAlive()) {
      this.setHealth(0, silent);
    }

    return this;
  };

  var revive = function (health, silent) {
    if (this.isDead()) {
      this.setHealth(health || 1, silent);
    }

    return this;
  };

  var reviveAtMaxHealth = function (silent) {
    this.revive(this.getMaxHealth(), silent);

    return this;
  };

  var HealthComponent = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getHealth: getHealth,
    getHealthFrac: getHealthFrac,
    getMinHealth: getMinHealth,
    getMaxHealth: getMaxHealth,
    setHealth: setHealth,
    setMinHealth: setMinHealth,
    setMaxHealth: setMaxHealth,
    damage: damage,
    heal: heal,
    isAlive: isAlive,
    isDead: isDead,
    kill: kill,
    revive: revive,
    reviveAtMaxHealth: reviveAtMaxHealth
  });

  var dumpMap = function (obj) {
    return {
      name: obj.name,
      alive: obj.isAlive(),
      health: obj.getHealth(),
      minHealth: obj.getMinHealth(),
      maxHealth: obj.getMaxHealth()
    };
  };

  var AddTo = function (obj, health, minHealth, maxHealth) {
    if ( health === void 0 ) health = 1;
    if ( minHealth === void 0 ) minHealth = -Infinity;
    if ( maxHealth === void 0 ) maxHealth = 100;

    Object.assign(obj, HealthComponent);

    SetHealth(obj, health, minHealth, maxHealth, true);

    return obj;
  };

  var Damage = function (obj, amount, silent) {
    return obj.damage(amount, silent);
  };

  var Dump = function (objs) {
    console.table(objs.map(dumpMap));
  };

  var Heal = function (obj, amount, silent) {
    return obj.heal(amount, silent);
  };

  var IsAlive = function (obj) {
    return obj.isAlive();
  };

  var IsDead = function (obj) {
    return obj.isDead();
  };

  var Kill = function (obj, silent) {
    return obj.kill(silent);
  };

  var MixinTo = function (obj) {
    return Object.assign(obj.prototype, HealthComponent);
  };

  var Revive = function (obj, health, silent) {
    return obj.revive(health, silent);
  };

  var ReviveAtMaxHealth = function (obj, silent) {
    return obj.reviveAtMaxHealth(silent);
  };

  var SetHealth = function (obj, health, minHealth, maxHealth, silent) {
    return obj.setHealth(health, minHealth, maxHealth, silent);
  };

  var Health = /*#__PURE__*/Object.freeze({
    __proto__: null,
    AddTo: AddTo,
    Damage: Damage,
    Dump: Dump,
    Heal: Heal,
    IsAlive: IsAlive,
    IsDead: IsDead,
    Kill: Kill,
    MixinTo: MixinTo,
    Revive: Revive,
    ReviveAtMaxHealth: ReviveAtMaxHealth,
    SetHealth: SetHealth
  });

  var ref$1 = Phaser.Utils.Array;
  var Each = ref$1.Each;

  var Damage$1 = function (objs, amount, silent) {
    Each(objs, Damage, null, amount, silent);

    return objs;
  };

  var Heal$1 = function (objs, amount, silent) {
    Each(objs, Heal, null, amount, silent);

    return objs;
  };

  var Kill$1 = function (objs, silent) {
    Each(objs, Kill, null, silent);

    return objs;
  };

  var Revive$1 = function (objs, health, silent) {
    Each(objs, Revive, null, health, silent);

    return objs;
  };

  var ReviveAtMaxHealth$1 = function (objs, silent) {
    Each(objs, ReviveAtMaxHealth, null, silent);

    return objs;
  };

  var SetHealth$1 = function (objs, health, maxHealth, silent) {
    Each(objs, SetHealth, null, health, maxHealth, silent);

    return objs;
  };

  var Actions = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Damage: Damage$1,
    Heal: Heal$1,
    Kill: Kill$1,
    Revive: Revive$1,
    ReviveAtMaxHealth: ReviveAtMaxHealth$1,
    SetHealth: SetHealth$1
  });



  var Events = /*#__PURE__*/Object.freeze({
    __proto__: null,
    DAMAGE: DAMAGE,
    DIE: DIE,
    HEAL: HEAL,
    HEALTH_CHANGE: HEALTH_CHANGE,
    REVIVE: REVIVE
  });

  var main = Object.assign({}, Health,
    {Actions: Actions,
    Events: Events,
    HealthComponent: HealthComponent});

  return main;

})));

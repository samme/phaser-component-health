var HEALTH = 'health';
var MAX_HEALTH = 'maxHealth';
var DAMAGE = 'damage';
var HEAL = 'heal';
var HEALTH_CHANGE = 'healthchange';
var DIE = 'die';
var REVIVE = 'revive';

var Each = Phaser.Utils.Array.Each;

var dumpMap = function (obj) {
  return {
    name: obj.name,
    alive: obj.isAlive(),
    health: obj.getHealth(),
    maxHealth: obj.getMaxHealth()
  };
};

var Health = {

  AddTo: function (obj, health, maxHealth) {
    Object.assign(obj, Health.HealthComponent);

    Health.SetHealth(obj, health || 1, maxHealth || 100, true);

    return obj;
  },

  Damage: function (obj, amount, silent) {
    return obj.damage(amount, silent);
  },

  Dump: function (objs) {
    console.table(objs.map(dumpMap));
  },

  Heal: function (obj, amount, silent) {
    return obj.heal(amount, silent);
  },

  IsAlive: function (obj) {
    return obj.isAlive();
  },

  IsDead: function (obj) {
    return obj.isDead();
  },

  Kill: function (obj, silent) {
    return obj.kill(silent);
  },

  MixinTo: function (obj) {
    return Object.assign(obj.prototype, Health.HealthComponent);
  },

  Revive: function (obj, health, silent) {
    return obj.revive(health, silent);
  },

  ReviveAtMaxHealth: function (obj, silent) {
    return obj.reviveAtMaxHealth(silent);
  },

  SetHealth: function (obj, health, maxHealth, silent) {
    if (maxHealth) { obj.setMaxHealth(maxHealth); }

    return obj.setHealth(health, silent);
  },

  Actions: {

    Damage: function (objs, amount, silent) {
      Each(objs, Health.Damage, null, amount, silent);

      return objs;
    },

    Heal: function (objs, amount, silent) {
      Each(objs, Health.Heal, null, amount, silent);

      return objs;
    },

    Kill: function (objs, silent) {
      Each(objs, Health.Kill, null, silent);

      return objs;
    },

    Revive: function (objs, health, silent) {
      Each(objs, Health.Revive, null, health, silent);

      return objs;
    },

    ReviveAtMaxHealth: function ReviveAtMaxHealth (objs, silent) {
      Each(objs, Health.ReviveAtMaxHealth, null, silent);

      return objs;
    },

    SetHealth: function (objs, health, maxHealth, silent) {
      Each(objs, Health.SetHealth, null, health, maxHealth, silent);

      return objs;
    }

  },

  Events: {
    DAMAGE: DAMAGE,

    DIE: DIE,

    HEAL: HEAL,

    HEALTH_CHANGE: HEALTH_CHANGE,

    REVIVE: REVIVE
  },

  HealthComponent: {

    getHealth: function () {
      return this.getData(HEALTH);
    },

    getHealthFrac: function () {
      return this.getHealth() / this.getMaxHealth();
    },

    getMaxHealth: function () {
      return this.getData(MAX_HEALTH);
    },

    setHealth: function (health, silent) {
      var maxHealth = this.getMaxHealth();
      var prevHealth = this.getHealth();
      var newHealth = Math.min(health, maxHealth);
      var change = newHealth - prevHealth;

      if (change === 0) { return this; }

      this.setData(HEALTH, newHealth);

      if (silent) { return this; }

      this.emit(HEALTH_CHANGE, this, change, newHealth, maxHealth);

      if (prevHealth > 0 && newHealth <= 0) {
        this.emit(DIE, this);
      } else if (prevHealth <= 0 && newHealth > 0) {
        this.emit(REVIVE, this);
      }

      return this;
    },

    setMaxHealth: function (amount, silent) {
      this.setData(MAX_HEALTH, amount);

      if (this.getHealth() > amount) {
        this.setHealth(amount, silent);
      }

      return this;
    },

    damage: function (amount, silent) {
      if (amount === 0) { return this; }

      if (!amount) { amount = 1; }

      if (!silent) {
        this.emit(DAMAGE, this, amount);
      }

      this.setHealth(this.getHealth() - amount, silent);

      return this;
    },

    heal: function (amount, silent) {
      if (amount === 0) { return this; }

      if (!amount) { amount = 1; }

      if (!silent) {
        this.emit(HEAL, this, amount);
      }

      this.setHealth(this.getHealth() + amount, silent);

      return this;
    },

    isAlive: function () {
      return this.getHealth() > 0;
    },

    isDead: function () {
      return this.getHealth() <= 0;
    },

    kill: function (silent) {
      if (this.isAlive()) {
        this.setHealth(0, silent);
      }

      return this;
    },

    revive: function (health, silent) {
      if (this.isDead()) {
        this.setHealth(health || 1, silent);
      }

      return this;
    },

    reviveAtMaxHealth: function (silent) {
      this.revive(this.getMaxHealth(), silent);

      return this;
    }

  }

};

var main = Health;

export default main;

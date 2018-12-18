var HEALTH = 'health';
var MAX_HEALTH = 'maxHealth';
var DAMAGE = 'damage';
var HEAL = 'heal';

var Health = {

  AddTo: function (obj, health, maxHealth) {
    Object.assign(obj, Health.HealthComponent);

    Health.SetHealth(obj, health || 1, maxHealth || 100, true);

    return obj;
  },

  MixinTo: function (obj) {
    return Object.assign(obj.prototype, Health.HealthComponent);
  },

  SetHealth: function (obj, health, maxHealth, silent) {
    if (maxHealth) obj.setMaxHealth(maxHealth);

    return obj.setHealth(health, silent);
  },

  Actions: {

    SetHealth: function (objs, health, maxHealth, silent) {
      Phaser.Utils.Array.Each(objs, Health.SetHealth, null, health, maxHealth, silent); // TODO
    }

  },

  HealthComponent: {

    getHealth: function () {
      return this.getData(HEALTH);
    },

    getMaxHealth: function () {
      return this.getData(MAX_HEALTH);
    },

    setHealth: function (health, silent) {
      var maxHealth = this.getMaxHealth();
      var prevHealth = this.getHealth();
      var newHealth = Math.min(health, maxHealth);
      var change = newHealth - prevHealth;

      if (change === 0) return this;

      this.setData(HEALTH, newHealth);

      if (silent) return this;

      this.emit('healthchange', this, change, newHealth, maxHealth);

      if (prevHealth > 0 && newHealth <= 0) {
        this.emit('die', this);
      } else if (prevHealth <= 0 && newHealth > 0) {
        this.emit('revive', this);
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
      if (amount === 0) return this;

      if (!amount) amount = 1;

      if (!silent) {
        this.emit(DAMAGE, this, amount);
      }

      this.setHealth(this.getHealth() - amount, silent);

      return this;
    },

    heal: function (amount, silent) {
      if (amount === 0) return this;

      if (!amount) amount = 1;

      if (!silent) {
        this.emit(HEAL, this, amount);
      }

      this.setHealth(this.getHealth() + amount, silent);

      return this;
    },

    kill: function (silent) {
      this.setHealth(0, silent);

      return this;
    },

    revive: function (health, silent) {
      this.setHealth(health || 1, silent);

      return this;
    },

    reviveAtMaxHealth: function (silent) {
      this.revive(this.getMaxHealth(), silent);

      return this;
    },

    isAlive: function () {
      return this.getHealth() > 0;
    },

    isDead: function () {
      return this.getHealth() <= 0;
    }

  }

};

if ((typeof Phaser) !== 'undefined') {
  Phaser.Health = Health;
}

module.exports = Health;

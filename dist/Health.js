(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Health = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

    setMaxHealth: function (amount) {
      this.setData(MAX_HEALTH, amount);

      if (this.getHealth() > amount) {
        this.setData(HEALTH, amount); // silent
      }

      return this;
    },

    damage: function (amount, silent) {
      if (amount === 0) return;

      if (!amount) amount = 1;

      if (!silent) {
        this.emit(DAMAGE, this, amount);
      }

      this.setHealth(this.getHealth() - amount, silent);

      return this;
    },

    heal: function (amount, silent) {
      if (amount === 0) return;

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

},{}]},{},[1])(1)
});

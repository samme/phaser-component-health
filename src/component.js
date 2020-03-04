import { DAMAGE, DIE, HEAL, HEALTH, HEALTH_CHANGE, MAX_HEALTH, REVIVE } from './const';

export const getHealth = function () {
  return this.getData(HEALTH);
};

export const getHealthFrac = function () {
  return this.getHealth() / this.getMaxHealth();
};

export const getMaxHealth = function () {
  return this.getData(MAX_HEALTH);
};

export const setHealth = function (health, silent) {
  const maxHealth = this.getMaxHealth();
  const prevHealth = this.getHealth();
  const newHealth = Math.min(health, maxHealth);
  const change = newHealth - prevHealth;

  if (change === 0) return this;

  this.setData(HEALTH, newHealth);

  if (silent) return this;

  this.emit(HEALTH_CHANGE, this, change, newHealth, maxHealth);

  if (prevHealth > 0 && newHealth <= 0) {
    this.emit(DIE, this);
  } else if (prevHealth <= 0 && newHealth > 0) {
    this.emit(REVIVE, this);
  }

  return this;
};

export const setMaxHealth = function (amount, silent) {
  this.setData(MAX_HEALTH, amount);

  if (this.getHealth() > amount) {
    this.setHealth(amount, silent);
  }

  return this;
};

export const damage = function (amount, silent) {
  if (amount === 0) return this;

  if (!amount) amount = 1;

  if (!silent) {
    this.emit(DAMAGE, this, amount);
  }

  this.setHealth(this.getHealth() - amount, silent);

  return this;
};

export const heal = function (amount, silent) {
  if (amount === 0) return this;

  if (!amount) amount = 1;

  if (!silent) {
    this.emit(HEAL, this, amount);
  }

  this.setHealth(this.getHealth() + amount, silent);

  return this;
};

export const isAlive = function () {
  return this.getHealth() > 0;
};

export const isDead = function () {
  return this.getHealth() <= 0;
};

export const kill = function (silent) {
  if (this.isAlive()) {
    this.setHealth(0, silent);
  }

  return this;
};

export const revive = function (health, silent) {
  if (this.isDead()) {
    this.setHealth(health || 1, silent);
  }

  return this;
};

export const reviveAtMaxHealth = function (silent) {
  this.revive(this.getMaxHealth(), silent);

  return this;
};

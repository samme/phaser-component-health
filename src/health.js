
import * as HealthComponent from './component';

import { dumpMap } from './dumpMap';

export const AddTo = function (obj, health = 1, minHealth = -Infinity, maxHealth = 100) {
  Object.assign(obj, HealthComponent);

  SetHealth(obj, health, minHealth, maxHealth, true);

  return obj;
};

export const Damage = function (obj, amount, silent) {
  return obj.damage(amount, silent);
};

export const Dump = function (objs) {
  console.table(objs.map(dumpMap));
};

export const Heal = function (obj, amount, silent) {
  return obj.heal(amount, silent);
};

export const IsAlive = function (obj) {
  return obj.isAlive();
};

export const IsDead = function (obj) {
  return obj.isDead();
};

export const Kill = function (obj, silent) {
  return obj.kill(silent);
};

export const MixinTo = function (obj) {
  return Object.assign(obj.prototype, HealthComponent);
};

export const Revive = function (obj, health, silent) {
  return obj.revive(health, silent);
};

export const ReviveAtMaxHealth = function (obj, silent) {
  return obj.reviveAtMaxHealth(silent);
};

export const SetHealth = function (obj, health, minHealth, maxHealth, silent) {
  return obj.setHealth(health, minHealth, maxHealth, silent);
};

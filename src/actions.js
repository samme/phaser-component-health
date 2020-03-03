import * as Health from './health';

const { Each } = Phaser.Utils.Array;

export const Damage = function (objs, amount, silent) {
  Each(objs, Health.Damage, null, amount, silent);

  return objs;
};

export const Heal = function (objs, amount, silent) {
  Each(objs, Health.Heal, null, amount, silent);

  return objs;
};

export const Kill = function (objs, silent) {
  Each(objs, Health.Kill, null, silent);

  return objs;
};

export const Revive = function (objs, health, silent) {
  Each(objs, Health.Revive, null, health, silent);

  return objs;
};

export const ReviveAtMaxHealth = function (objs, silent) {
  Each(objs, Health.ReviveAtMaxHealth, null, silent);

  return objs;
};

export const SetHealth = function (objs, health, maxHealth, silent) {
  Each(objs, Health.SetHealth, null, health, maxHealth, silent);

  return objs;
};
